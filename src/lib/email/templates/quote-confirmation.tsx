import React from "react";

interface QuoteConfirmationEmailProps {
  name: string;
  service: string;
}

export const QuoteConfirmationEmail = ({
  name,
  service,
}: QuoteConfirmationEmailProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #5C3D2E 0%, #3E2723 100%)", padding: "30px", borderRadius: "8px 8px 0 0" }}>
            <h1 style={{ color: "#E6AA68", margin: "0", fontSize: "28px" }}>
              Quote Request Received
            </h1>
          </div>

          {/* Content */}
          <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "0 0 8px 8px", border: "1px solid #E8E5DE" }}>
            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Dear {name},
            </p>

            <p style={{ fontSize: "16px", marginBottom: "20px" }}>
              Thank you for requesting a quote from <strong>Flooring Bournemouth</strong>. We have received your request for <strong>{service}</strong>.
            </p>

            <div style={{ backgroundColor: "#FFF8F0", padding: "20px", borderRadius: "6px", marginBottom: "20px", borderLeft: "4px solid #E6AA68" }}>
              <p style={{ fontSize: "14px", margin: "0", color: "#5C3D2E", fontWeight: "600" }}>
                📋 What happens next?
              </p>
              <p style={{ fontSize: "14px", margin: "10px 0 0 0", color: "#2A2925" }}>
                Our expert team will review your requirements and prepare a detailed quote. We'll contact you within 24 hours with a competitive price and timeline for your flooring project.
              </p>
            </div>

            <p style={{ fontSize: "16px", marginBottom: "20px", color: "#2A2925" }}>
              If you have any urgent questions, feel free to call us at <strong>(01202) 123-4567</strong>.
            </p>

            <p style={{ fontSize: "16px", marginBottom: "5px", color: "#2A2925" }}>
              Best regards,
            </p>
            <p style={{ fontSize: "16px", margin: "0", fontWeight: "600", color: "#5C3D2E" }}>
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
