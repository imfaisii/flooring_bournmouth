export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  review: string;
  serviceType: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}
