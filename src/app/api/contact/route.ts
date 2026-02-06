import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import Contact from "@/lib/models/Contact";
import { contactSchema } from "@/lib/validators/contact.schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Save to database
    await dbConnect();
    await Contact.create(result.data);

    return NextResponse.json(
      { success: true, message: "Your inquiry has been submitted successfully. We will be in touch shortly." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
