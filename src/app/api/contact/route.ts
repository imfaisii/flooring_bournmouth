import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/api";
import { contactSchema } from "@/lib/validators/contact.schema";
import { sendContactEmails } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    // Check if request has content
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = createPublicClient();
    const { error } = await supabase
      .from("contacts")
      .insert([{
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        address: result.data.address,
        service: result.data.service,
        message: result.data.message,
      }]);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Trigger revalidation of admin pages after successful insert
    revalidateTag('admin-stats', 'max');
    revalidateTag('admin-leads', 'max');
    revalidateTag('admin-charts', 'max');

    // Send emails (confirmation to user + notification to admin)
    try {
      await sendContactEmails({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        address: result.data.address,
        service: result.data.service,
        message: result.data.message,
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("Failed to send emails:", emailError);
    }

    return NextResponse.json(
      { success: true, message: "Your inquiry has been submitted successfully. We will be in touch shortly." },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'CDN-Cache-Control': 'no-store',
        }
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
