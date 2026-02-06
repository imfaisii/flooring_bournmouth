import { Card } from "@/components/ui/Card";
import { Mail, Phone, Calendar } from "lucide-react";

// This would come from your database in a real app
const mockContacts = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "01202 123 456",
    service: "Hardwood Flooring",
    message: "I need a quote for oak flooring in my living room, approximately 25sqm.",
    status: "new",
    createdAt: "2024-02-04T10:30:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "01202 987 654",
    service: "Luxury Vinyl (LVT)",
    message: "Looking for waterproof flooring for kitchen and bathroom.",
    status: "read",
    createdAt: "2024-02-03T14:15:00Z",
  },
];

export default function ContactsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary-dark mb-2">
          Contact Inquiries
        </h2>
        <p className="text-neutral-600">
          Manage customer inquiries and quote requests.
        </p>
      </div>

      <div className="space-y-4">
        {mockContacts.map((contact) => (
          <Card key={contact.id} className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-primary-dark">
                    {contact.name}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      contact.status === "new"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {contact.status === "new" ? "New" : "Read"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-4">
              <p className="text-sm font-medium text-neutral-700 mb-2">
                Service: <span className="text-primary">{contact.service}</span>
              </p>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {contact.message}
              </p>
            </div>

            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm transition-colors">
                Mark as Responded
              </button>
              <button className="px-4 py-2 border border-neutral-300 hover:border-primary hover:bg-primary/5 text-primary-dark rounded-lg font-medium text-sm transition-colors">
                Archive
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
