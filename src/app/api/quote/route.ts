import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/api";
import { quoteSchema } from "@/lib/validators/quote.schema";
import { sendQuoteEmails } from "@/lib/email/resend";

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
    const result = quoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Save to Supabase
    const supabase = createPublicClient();
    const { error } = await supabase
      .from("quotes")
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        service: data.service,
        message: data.message,
      }]);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Trigger revalidation of admin pages after successful insert
    revalidateTag('admin-stats', 'max');
    revalidateTag('admin-leads', 'max');
    revalidateTag('admin-charts', 'max');

    // Send emails (confirmation to customer + notifications to admins)
    try {
      console.log("🚀 Calling sendQuoteEmails with data:", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
      });

      const emailResult = await sendQuoteEmails({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        service: data.service,
        message: data.message,
      });

      console.log("📧 Email sending result:", emailResult);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error("❌ Failed to send emails:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your quote request has been received. We'll get back to you within 24 hours.",
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'CDN-Cache-Control': 'no-store',
        }
      }
    );
  } catch (error) {
    console.error("Quote form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
