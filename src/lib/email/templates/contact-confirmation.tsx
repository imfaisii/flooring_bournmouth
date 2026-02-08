import React from "react";

interface ContactConfirmationEmailProps {
  name: string;
  service: string;
}

export const ContactConfirmationEmail = ({
  name,
  service,
}: ContactConfirmationEmailProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          {/* Header */}
          <div style={{ backgroundColor: "#1e40af", padding: "30px", borderRadius: "8px 8px 0 0" }}>
            <h1 style={{ color: "#ffffff", margin: "0", fontSize: "28px" }}>
              Thank You for Contacting Us
            </h1>
          </div>

          {/* Content */}
          <div style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "0 0 8px 8px" }}>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Dear {name},
            </p>

            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Thank you for reaching out to <strong>Flooring Bournemouth</strong>. We have received your inquiry regarding <strong>{service}</strong>.
            </p>

            <div style={{ backgroundColor: "#dbeafe", padding: "20px", borderRadius: "6px", marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", margin: "0", color: "#1e40af" }}>
                <strong>What happens next?</strong>
              </p>
              <p style={{ fontSize: "14px", margin: "10px 0 0 0" }}>
                Our team will review your inquiry and get back to you within 24 hours. We look forward to helping you with your flooring needs!
              </p>
            </div>

            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              If you have any urgent questions, feel free to call us at <strong>(01202) 123-4567</strong>.
            </p>

            <p style={{ fontSize: "16px", marginBottom: "5px" }}>
              Best regards,
            </p>
            <p style={{ fontSize: "16px", margin: "0", fontWeight: "600" }}>
              The Flooring Bournemouth Team
            </p>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#6b7280" }}>
            <p>© {new Date().getFullYear()} Flooring Bournemouth. All rights reserved.</p>
            <p>This is an automated confirmation email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
    </html>
  );
};
