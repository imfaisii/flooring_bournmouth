import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import dbConnect from "@/lib/db/connection";
import Quote from "@/lib/models/Quote";
import { quoteSchema } from "@/lib/validators/quote.schema";
import { siteConfig } from "@/lib/config/site";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    const result = quoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Save to database
    await dbConnect();
    const quote = await Quote.create(data);

    // Send email notification using Resend
    try {
      await resend.emails.send({
        from: "Flooring Bournemouth <onboarding@resend.dev>", // Use your verified domain
        to: siteConfig.company.email,
        subject: `New Quote Request from ${data.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #5C3D2E 0%, #3E2723 100%); padding: 30px; text-align: center;">
              <h1 style="color: #E6AA68; margin: 0; font-size: 28px;">New Quote Request</h1>
            </div>

            <div style="background: #ffffff; padding: 40px; border-left: 4px solid #E6AA68;">
              <h2 style="color: #3E2723; margin-top: 0;">Customer Details</h2>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #5A574F; font-weight: bold;">Name:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #2A2925;">${data.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #5A574F; font-weight: bold;">Email:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #2A2925;">
                    <a href="mailto:${data.email}" style="color: #E6AA68; text-decoration: none;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #5A574F; font-weight: bold;">Phone:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #2A2925;">
                    <a href="tel:${data.phone}" style="color: #E6AA68; text-decoration: none;">${data.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #5A574F; font-weight: bold;">Address:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #2A2925;">${data.address}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #5A574F; font-weight: bold;">Service:</td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #E8E5DE; color: #2A2925;">${data.service}</td>
                </tr>
              </table>

              ${
                data.message
                  ? `
                <div style="margin-top: 30px;">
                  <h3 style="color: #3E2723; margin-bottom: 10px;">Additional Information:</h3>
                  <p style="background: #FAFAF8; padding: 20px; border-radius: 8px; color: #2A2925; line-height: 1.6;">
                    ${data.message}
                  </p>
                </div>
              `
                  : ""
              }

              <div style="margin-top: 40px; padding: 20px; background: #FFF8F0; border-radius: 8px; text-align: center;">
                <p style="color: #5C3D2E; margin: 0; font-size: 14px;">
                  📋 Quote ID: <strong>${quote._id}</strong>
                </p>
              </div>
            </div>

            <div style="background: #0F0F0F; padding: 20px; text-align: center;">
              <p style="color: #A8A298; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} Flooring Bournemouth. All rights reserved.
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you! Your quote request has been received. We'll get back to you within 24 hours.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
