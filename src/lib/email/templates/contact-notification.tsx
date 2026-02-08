import React from "react";

interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone: string;
  address: string;
  service: string;
  message: string;
  submittedAt: string;
}

export const ContactNotificationEmail = ({
  name,
  email,
  phone,
  address,
  service,
  message,
  submittedAt,
}: ContactNotificationEmailProps) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6", color: "#333" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
          {/* Header */}
          <div style={{ backgroundColor: "#dc2626", padding: "30px", borderRadius: "8px 8px 0 0" }}>
            <h1 style={{ color: "#ffffff", margin: "0", fontSize: "28px" }}>
              🔔 New Contact Form Submission
            </h1>
          </div>

          {/* Content */}
          <div style={{ backgroundColor: "#f9fafb", padding: "30px", borderRadius: "0 0 8px 8px" }}>
            <p style={{ fontSize: "16px", marginBottom: "25px", fontWeight: "600" }}>
              You have received a new contact form submission:
            </p>

            {/* Customer Details */}
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
              <h2 style={{ fontSize: "18px", marginTop: "0", marginBottom: "15px", color: "#1e40af" }}>
                Customer Details
              </h2>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600", width: "130px" }}>Name:</td>
                  <td style={{ padding: "8px 0" }}>{name}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600" }}>Email:</td>
                  <td style={{ padding: "8px 0" }}>
                    <a href={`mailto:${email}`} style={{ color: "#1e40af", textDecoration: "none" }}>
                      {email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600" }}>Phone:</td>
                  <td style={{ padding: "8px 0" }}>
                    <a href={`tel:${phone}`} style={{ color: "#1e40af", textDecoration: "none" }}>
                      {phone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600" }}>Address:</td>
                  <td style={{ padding: "8px 0" }}>{address}</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 0", fontWeight: "600" }}>Service:</td>
                  <td style={{ padding: "8px 0" }}>
                    <span style={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      padding: "4px 12px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontWeight: "600"
                    }}>
                      {service}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            {/* Message */}
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "6px", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
              <h2 style={{ fontSize: "18px", marginTop: "0", marginBottom: "15px", color: "#1e40af" }}>
                Message
              </h2>
              <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6" }}>
                {message}
              </p>
            </div>

            {/* Submission Time */}
            <div style={{ textAlign: "center", fontSize: "13px", color: "#6b7280", marginTop: "20px" }}>
              <p style={{ margin: "0" }}>
                Submitted on {submittedAt}
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
