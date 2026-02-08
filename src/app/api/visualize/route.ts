import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/api";
import { visualizeSchema, imageValidation } from "@/lib/validators/visualize.schema";
import { generateFlooringVisualization } from "@/lib/ai/grok";
import { getClientIP } from "@/lib/utils/request";

export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse multipart form data
    const formData = await req.formData();
    const image = formData.get("image") as File | null;
    const flooringType = formData.get("flooringType") as string;
    const sessionId = formData.get("sessionId") as string;

    // 2. Validate image exists
    if (!image) {
      return NextResponse.json(
        { error: "Please upload an image" },
        { status: 400 }
      );
    }

    // 3. Validate image
    const imageCheck = imageValidation.validate({
      size: image.size,
      type: image.type,
    });
    if (!imageCheck.valid) {
      return NextResponse.json(
        { error: imageCheck.error },
        { status: 400 }
      );
    }

    // 4. Validate other fields
    const validation = visualizeSchema.safeParse({
      flooringType,
      sessionId,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // 5. Get identifiers for rate limiting
    const ipAddress = getClientIP(req);
    const supabase = createServiceClient();

    // 6. Check rate limit
    const { data: rateLimit, error: rateLimitError } = await supabase.rpc(
      "check_visualization_rate_limit",
      {
        p_ip_address: ipAddress,
        p_session_id: sessionId,
        p_max_attempts: 3,
        p_window_hours: 1,
      }
    );

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
      // Continue anyway if rate limit check fails
    }

    // RPC returns an array, get first result
    const rateLimitResult = rateLimit?.[0];

    if (rateLimitResult && !rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. You can try 3 visualizations per hour.",
          attemptsRemaining: 0,
          resetAt: rateLimitResult.reset_at,
        },
        { status: 429 }
      );
    }

    // 7. Convert image to base64
    const imageBuffer = await image.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString("base64");
    const mimeType = image.type;

    // 8. Upload original image to Supabase Storage
    const originalFileName = `originals/${sessionId}_${Date.now()}.${
      mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg"
    }`;

    const { error: uploadError } = await supabase.storage
      .from("visualizations")
      .upload(originalFileName, Buffer.from(imageBuffer), {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      // Continue even if upload fails - we can still generate
    }

    // 9. Create visualization record
    const { data: visualization, error: insertError } = await supabase
      .from("room_visualizations")
      .insert({
        session_id: sessionId,
        ip_address: ipAddress,
        original_image_path: originalFileName,
        flooring_type: flooringType,
        status: "processing",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to start visualization" },
        { status: 500 }
      );
    }

    // 10. Generate visualization with Grok
    let result;
    try {
      result = await generateFlooringVisualization({
        imageBase64,
        mimeType,
        flooringType: validation.data.flooringType,
      });
    } catch (aiError) {
      console.error("AI generation error:", aiError);

      // Update record with error
      await supabase
        .from("room_visualizations")
        .update({
          status: "failed",
          error_message: aiError instanceof Error ? aiError.message : "AI generation failed",
        })
        .eq("id", visualization.id);

      return NextResponse.json(
        { error: "Failed to generate visualization. Please try again." },
        { status: 500 }
      );
    }

    const processingTime = Date.now() - startTime;

    // 11. Upload generated image
    const generatedFileName = `generated/${sessionId}_${Date.now()}.png`;

    const { error: genUploadError } = await supabase.storage
      .from("visualizations")
      .upload(generatedFileName, Buffer.from(result.imageBase64, "base64"), {
        contentType: "image/png",
        upsert: false,
      });

    if (genUploadError) {
      console.error("Generated image upload error:", genUploadError);
    }

    // 12. Update visualization record
    await supabase
      .from("room_visualizations")
      .update({
        generated_image_path: generatedFileName,
        status: "completed",
        processing_time_ms: processingTime,
        completed_at: new Date().toISOString(),
      })
      .eq("id", visualization.id);

    // 13. Get public URL
    const { data: publicUrl } = supabase.storage
      .from("visualizations")
      .getPublicUrl(generatedFileName);

    // Calculate remaining attempts
    const attemptsRemaining = rateLimitResult
      ? Math.max(0, rateLimitResult.attempts_remaining - 1)
      : 2;

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl.publicUrl,
      // Also return base64 as fallback in case storage URL doesn't work
      imageBase64: result.imageBase64,
      attemptsRemaining,
      processingTimeMs: processingTime,
    });
  } catch (error) {
    console.error("Visualization error:", error);
    return NextResponse.json(
      { error: "Failed to generate visualization. Please try again." },
      { status: 500 }
    );
  }
}
