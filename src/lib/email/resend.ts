import { Resend } from "resend";
import { ContactConfirmationEmail } from "./templates/contact-confirmation";
import { ContactNotificationEmail } from "./templates/contact-notification";
import { QuoteConfirmationEmail } from "./templates/quote-confirmation";
import { QuoteNotificationEmail } from "./templates/quote-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  message: string;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  message?: string;
}

export async function sendContactEmails(data: ContactFormData) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Flooring Bournemouth";
  const contactEmails = process.env.CONTACT_EMAILS?.split(",").map(e => e.trim()) || [];
  const fromEmail = process.env.RESEND_FROM_EMAIL || `${siteName} <onboarding@resend.dev>`;

  if (contactEmails.length === 0) {
    console.error("No CONTACT_EMAILS configured in environment variables");
  }

  const submittedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  // Send confirmation email to user
  const confirmationPromise = resend.emails.send({
    from: fromEmail,
    to: data.email,
    subject: `Thank you for contacting ${siteName}`,
    react: ContactConfirmationEmail({
      name: data.name,
      service: data.service,
    }),
  });

  // Send emails with rate limiting (Resend free plan: 2 req/sec)
  try {
    const confirmationResult = await confirmationPromise;

    // Check for Resend API error in response
    if (confirmationResult.error) {
      console.error("❌ Confirmation email failed:", confirmationResult.error);
    } else {
      console.log("✅ Confirmation email sent, ID:", confirmationResult.data?.id);
    }

    // Wait before sending notifications to respect rate limit (2 req/sec)
    await new Promise(resolve => setTimeout(resolve, 600));

    // Send notification emails sequentially with rate limit delay
    let notificationsSent = 0;

    for (let i = 0; i < contactEmails.length; i++) {
      const adminEmail = contactEmails[i];

      // Wait 600ms between each email (skip delay for first one since we already waited)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const result = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `New Contact Form Submission - ${data.service}`,
        react: ContactNotificationEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          service: data.service,
          message: data.message,
          submittedAt,
        }),
      });

      if (result.error) {
        console.error(`❌ Notification to ${adminEmail} failed:`, result.error);
      } else {
        console.log(`✅ Notification to ${adminEmail} sent, ID:`, result.data?.id);
        notificationsSent++;
      }
    }

    const confirmationSent = !confirmationResult.error && !!confirmationResult.data?.id;

    return {
      success: true,
      confirmationSent,
      notificationsSent,
    };
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    throw error;
  }
}

export async function sendQuoteEmails(data: QuoteFormData) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Flooring Bournemouth";
  const contactEmails = process.env.CONTACT_EMAILS?.split(",").map(e => e.trim()) || [];

  console.log("📧 Sending quote emails...");
  console.log("Customer email:", data.email);
  console.log("Admin emails:", contactEmails);

  if (contactEmails.length === 0) {
    console.error("No CONTACT_EMAILS configured in environment variables");
  }

  const submittedAt = new Date().toLocaleString("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  });

  // Send confirmation email to customer
  console.log(`📨 Sending confirmation to customer: ${data.email}`);
  const fromEmail = process.env.RESEND_FROM_EMAIL || `${siteName} <onboarding@resend.dev>`;
  console.log(`📧 From email: ${fromEmail}`);

  const confirmationPromise = resend.emails.send({
    from: fromEmail,
    to: data.email,
    subject: `Quote Request Received - ${siteName}`,
    react: QuoteConfirmationEmail({
      name: data.name,
      service: data.service,
    }),
  });

  // Send emails with rate limiting (Resend free plan: 2 req/sec)
  try {
    console.log("⏳ Sending confirmation email...");
    const confirmationResult = await confirmationPromise;

    // Check for Resend API error in response
    if (confirmationResult.error) {
      console.error("❌ Confirmation email failed:", confirmationResult.error);
    } else {
      console.log("✅ Confirmation email sent, ID:", confirmationResult.data?.id);
    }

    // Wait before sending notifications to respect rate limit (2 req/sec)
    await new Promise(resolve => setTimeout(resolve, 600));

    // Send notification emails sequentially with rate limit delay
    console.log("⏳ Sending admin notification emails...");
    let notificationsSent = 0;

    for (let i = 0; i < contactEmails.length; i++) {
      const adminEmail = contactEmails[i];

      // Wait 600ms between each email (skip delay for first one since we already waited)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      const result = await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `New Quote Request - ${data.service}`,
        react: QuoteNotificationEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          service: data.service,
          message: data.message,
          submittedAt,
        }),
      });

      if (result.error) {
        console.error(`❌ Notification to ${adminEmail} failed:`, result.error);
      } else {
        console.log(`✅ Notification to ${adminEmail} sent, ID:`, result.data?.id);
        notificationsSent++;
      }
    }

    const confirmationSent = !confirmationResult.error && !!confirmationResult.data?.id;

    if (confirmationSent && notificationsSent === contactEmails.length) {
      console.log("✅ All emails sent successfully!");
    } else {
      console.warn(`⚠️ Email summary: confirmation=${confirmationSent}, notifications=${notificationsSent}/${contactEmails.length}`);
    }

    return {
      success: true,
      confirmationSent,
      notificationsSent,
    };
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    throw error;
  }
}
