import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { MessageSquare, TrendingUp, Users, CheckCircle } from "lucide-react";

const stats = [
  {
    label: "New Inquiries",
    value: "12",
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    label: "Total Contacts",
    value: "148",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Responded",
    value: "96",
    icon: CheckCircle,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    label: "This Month",
    value: "24",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary-dark mb-2">
          Welcome Back
        </h2>
        <p className="text-neutral-600">
          Here's what's happening with your flooring business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-primary-dark">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-primary-dark mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/contacts"
            className="p-4 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <MessageSquare className="w-6 h-6 text-primary mb-2" />
            <p className="font-semibold text-primary-dark">View Inquiries</p>
            <p className="text-sm text-neutral-600">
              Manage contact submissions
            </p>
          </a>
        </div>
      </Card>
    </div>
  );
}
