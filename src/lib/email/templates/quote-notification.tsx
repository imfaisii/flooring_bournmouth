import React from "react";

interface QuoteNotificationEmailProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  message?: string;
  submittedAt: string;
}

export const QuoteNotificationEmail = ({
  name,
  email,
  phone,
  address,
  service,
  message,
  submittedAt,
}: QuoteNotificationEmailProps) => {
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
              💰 New Quote Request
            </h1>
          </div>

          {/* Content */}
          <div style={{ backgroundColor: "#FAFAF8", padding: "30px", borderRadius: "0 0 8px 8px" }}>
            <p style={{ fontSize: "16px", marginBottom: "25px", fontWeight: "600", color: "#2A2925" }}>
              You have received a new quote request:
            </p>

            {/* Customer Details */}
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #E8E5DE" }}>
              <h2 style={{ fontSize: "18px", marginTop: "0", marginBottom: "15px", color: "#5C3D2E" }}>
                Customer Details
              </h2>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", width: "130px", color: "#5A574F" }}>Name:</td>
                  <td style={{ padding: "8px 0", color: "#2A2925" }}>{name}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#5A574F" }}>Email:</td>
                  <td style={{ padding: "8px 0" }}>
                    <a href={`mailto:${email}`} style={{ color: "#E6AA68", textDecoration: "none" }}>
                      {email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#5A574F" }}>Phone:</td>
                  <td style={{ padding: "8px 0" }}>
                    <a href={`tel:${phone}`} style={{ color: "#E6AA68", textDecoration: "none" }}>
                      {phone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#5A574F" }}>Address:</td>
                  <td style={{ padding: "8px 0", color: "#2A2925" }}>{address}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", color: "#5A574F" }}>Service:</td>
                  <td style={{ padding: "8px 0" }}>
                    <span style={{
                      backgroundColor: "#FFF8F0",
                      color: "#5C3D2E",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontWeight: "600",
                      border: "1px solid #E6AA68"
                    }}>
                      {service}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            {/* Message (if provided) */}
            {message && (
              <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #E8E5DE" }}>
                <h2 style={{ fontSize: "18px", marginTop: "0", marginBottom: "15px", color: "#5C3D2E" }}>
                  Additional Information
                </h2>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#2A2925" }}>
                  {message}
                </p>
              </div>
            )}

            {/* Submission Time */}
            <div style={{ textAlign: "center", fontSize: "13px", color: "#5A574F", marginTop: "20px", padding: "15px", backgroundColor: "#FFF8F0", borderRadius: "6px" }}>
              <p style={{ margin: "0" }}>
                📅 Submitted on {submittedAt}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#6b7280" }}>
            <p>This is an automated notification from your Flooring Bournemouth website.</p>
          </div>
        </div>
      </body>
    </html>
  );
};
