import {
  Users,
  ClipboardList,
  Wallet,
  CalendarDays,
  MessageSquare,
  Package,
  CalendarCheck,
  FileText,
  Smartphone,
  BarChart3,
  ShieldCheck,
  Layers,
  GraduationCap,
  Bell,
  CreditCard,
  Globe,
  Zap,
  Lock,
  TrendingUp,
  Clock,
  UserCheck,
  Settings,
  PieChart,
  FileCheck,
  Headphones,
  Cloud,
  RefreshCw,
  AlertTriangle,
  Target,
  Repeat,
  Send,
  Eye,
  LayoutDashboard,
  Database,
  Workflow,
  GitBranch,
  QrCode,
  MapPin,
  Star,
  BookOpen,
  Video,
  MessageCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  iconName: string;
  color: string;
  bgColor: string;
  category: string;
  highlights: string[];
  benefits: { title: string; description: string; icon: LucideIcon }[];
  useCases: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  stats?: { value: string; label: string }[];
}

export const features: Feature[] = [
  {
    slug: "student-management",
    name: "Student Management",
    tagline: "From enquiry to graduation - every student tracked",
    description:
      "Capture every student enquiry, automate follow-ups, manage admissions, and track the entire student lifecycle from first contact to course completion. Never lose a lead again.",
    icon: Users,
    iconName: "Users",
    color: "text-primary",
    bgColor: "bg-primary/10",
    category: "Admissions",
    highlights: [
      "Lead capture from WhatsApp, website, walk-in",
      "Automated follow-up sequences",
      "Student profile with complete history",
      "Document management and verification",
      "Batch assignment and transfer",
      "Parent/guardian linkage",
    ],
    benefits: [
      {
        title: "Never Miss a Lead",
        description:
          "Capture enquiries from every channel - WhatsApp, website forms, walk-ins, referrals - and automatically assign them to your team.",
        icon: Target,
      },
      {
        title: "Automated Follow-ups",
        description:
          "Set up drip sequences that nurture leads automatically. Remind your team when a follow-up is due.",
        icon: RefreshCw,
      },
      {
        title: "360° Student View",
        description:
          "See attendance, fees, communications, and performance in one unified profile. No more jumping between spreadsheets.",
        icon: Eye,
      },
      {
        title: "Document Management",
        description:
          "Upload and verify ID proofs, certificates, and agreements directly within the student profile.",
        icon: FileCheck,
      },
    ],
    useCases: [
      {
        title: "Music Academy",
        description:
          "Track students from trial class enquiry through enrollment, manage age groups, and auto-assign to appropriate batches.",
      },
      {
        title: "Dance Studio",
        description:
          "Handle walk-in enquiries, schedule demo classes, and convert trials to full enrollments with automated reminders.",
      },
      {
        title: "Tuition Center",
        description:
          "Manage parent contacts, track sibling groups, and handle fee concessions with complete audit trails.",
      },
    ],
    faqs: [
      {
        question: "Can I import existing student data?",
        answer:
          "Yes, you can import students from Excel/CSV files. Our onboarding team will help migrate your data at no extra cost.",
      },
      {
        question: "How does lead capture work?",
        answer:
          "Leads are captured from WhatsApp Business API, website forms, manual entry, and can even be auto-created from missed calls.",
      },
      {
        question: "Can parents access student information?",
        answer:
          "Yes, parents get a separate login to view attendance, fees, and communicate with the institute.",
      },
    ],
    stats: [
      { value: "40%", label: "Faster enrollment" },
      { value: "2.5x", label: "More leads converted" },
      { value: "100%", label: "Lead tracking" },
    ],
  },
  {
    slug: "student-attendance",
    name: "Attendance",
    tagline: "Mark attendance in seconds from any device",
    description:
      "Replace manual attendance registers with instant digital tracking. Students can self-check-in via QR codes, staff can mark from mobile, and parents receive real-time updates.",
    icon: ClipboardList,
    iconName: "ClipboardList",
    color: "text-accent-blue",
    bgColor: "bg-accent-blue/10",
    category: "Admissions",
    highlights: [
      "QR code self check-in for students",
      "Mobile app for staff attendance",
      "Real-time parent notifications",
      "Batch-wise and class-wise reports",
      "Late arrival tracking",
      "Leave management",
    ],
    benefits: [
      {
        title: "Save 15 Minutes Daily",
        description:
          "Replace manual roll calls with QR scanning or one-tap marking. What used to take 15 minutes now takes 30 seconds.",
        icon: Clock,
      },
      {
        title: "Real-time Parent Alerts",
        description:
          "Parents get instant WhatsApp/SMS when their child checks in or if they're marked absent. No more anxious calls.",
        icon: Bell,
      },
      {
        title: "Attendance Analytics",
        description:
          "Identify patterns - which students are consistently late, which batches have low attendance, and act before it's too late.",
        icon: PieChart,
      },
      {
        title: "Works Offline",
        description:
          "Mark attendance even without internet. Data syncs automatically when connectivity is restored.",
        icon: Cloud,
      },
    ],
    useCases: [
      {
        title: "Weekend Classes",
        description:
          "Students scan QR at entry. Parents get notified instantly. No more confusion about whether their child attended.",
      },
      {
        title: "Evening Batches",
        description:
          "Track late arrivals automatically. Generate monthly reports for parents showing punctuality trends.",
      },
      {
        title: "Multi-location Institutes",
        description:
          "Centralized attendance across all branches. See real-time attendance dashboard from anywhere.",
      },
    ],
    faqs: [
      {
        question: "What if students don't have smartphones?",
        answer:
          "Staff can mark attendance on behalf of students using the mobile app. Multiple marking modes are supported.",
      },
      {
        question: "Can students mark proxy attendance for friends?",
        answer:
          "QR codes refresh every 30 seconds and are tied to specific batches. Location-based check-in adds another layer of security.",
      },
      {
        question: "How are attendance reports generated?",
        answer:
          "Reports are auto-generated daily, weekly, and monthly. You can also create custom date-range reports instantly.",
      },
    ],
    stats: [
      { value: "30sec", label: "Per batch attendance" },
      { value: "95%", label: "Parent satisfaction" },
      { value: "0", label: "Proxy attendance" },
    ],
  },
  {
    slug: "fee-collection",
    name: "Fee Collection",
    tagline: "Automated reminders and payment links",
    description:
      "Automate fee collection with payment links, recurring reminders, and multiple payment gateway integrations. Reduce pending fees by 60% with smart follow-up sequences.",
    icon: Wallet,
    iconName: "Wallet",
    color: "text-accent-green",
    bgColor: "bg-accent-green/10",
    category: "Admissions",
    highlights: [
      "Online payment gateway integration",
      "Automated fee reminders via WhatsApp",
      "Partial payment support",
      "Recurring fee scheduling",
      "Receipt generation",
      "Late fee automation",
    ],
    benefits: [
      {
        title: "Get Paid Faster",
        description:
          "Payment links sent via WhatsApp mean parents can pay in 2 taps. No more chasing or awkward conversations.",
        icon: Zap,
      },
      {
        title: "Zero Manual Tracking",
        description:
          "System tracks who's paid, who's pending, and who's overdue. Automatic reminders go out without you lifting a finger.",
        icon: RefreshCw,
      },
      {
        title: "Multiple Payment Modes",
        description:
          "Accept UPI, cards, net banking, wallets, and even cash with proper reconciliation. All in one place.",
        icon: CreditCard,
      },
      {
        title: "Financial Reports",
        description:
          "Real-time revenue tracking, pending fee reports, and collection efficiency metrics at your fingertips.",
        icon: BarChart3,
      },
    ],
    useCases: [
      {
        title: "Monthly Tuition Fees",
        description:
          "Set up recurring fees with auto-reminders starting 7 days before due date. Late fees applied automatically.",
      },
      {
        title: "Course Packages",
        description:
          "Sell 3-month, 6-month, or annual packages with installment options. Track each payment milestone.",
      },
      {
        title: "Event Registrations",
        description:
          "Collect one-time payments for workshops and events with instant confirmation and receipt.",
      },
    ],
    faqs: [
      {
        question: "Which payment gateways are supported?",
        answer:
          "We support Razorpay, PayU, CCAvenue, and can integrate with your preferred gateway on request.",
      },
      {
        question: "Can I offer installment plans?",
        answer:
          "Yes, you can split fees into multiple installments with individual due dates and automated reminders for each.",
      },
      {
        question: "How are refunds handled?",
        answer:
          "Refunds can be processed directly from the dashboard with proper audit trails and parent notifications.",
      },
    ],
    stats: [
      { value: "60%", label: "Less pending fees" },
      { value: "2min", label: "Average payment time" },
      { value: "100%", label: "Payment tracking" },
    ],
  },
  {
    slug: "batch-scheduling",
    name: "Batch Scheduling",
    tagline: "Manage classes, trainers, and rooms",
    description:
      "Create and manage batches with smart scheduling that avoids conflicts, optimizes room utilization, and handles trainer availability. Drag-and-drop simplicity.",
    icon: CalendarDays,
    iconName: "CalendarDays",
    color: "text-accent-cyan",
    bgColor: "bg-accent-cyan/10",
    category: "Admissions",
    highlights: [
      "Drag-and-drop scheduling",
      "Trainer availability management",
      "Room/resource booking",
      "Conflict detection",
      "Student-batch assignment",
      "Schedule sharing via WhatsApp",
    ],
    benefits: [
      {
        title: "Zero Scheduling Conflicts",
        description:
          "System automatically detects and prevents double-booking of trainers, rooms, or time slots.",
        icon: AlertTriangle,
      },
      {
        title: "Optimize Utilization",
        description:
          "See which rooms and trainers are underutilized. Fill gaps and maximize revenue from existing infrastructure.",
        icon: TrendingUp,
      },
      {
        title: "Flexible Rescheduling",
        description:
          "Handle cancellations and rescheduling with automatic notifications to affected students and trainers.",
        icon: RefreshCw,
      },
      {
        title: "Share Schedules Instantly",
        description:
          "One-click sharing of updated schedules via WhatsApp to all affected students and parents.",
        icon: Send,
      },
    ],
    useCases: [
      {
        title: "Music School",
        description:
          "Schedule individual instrument classes across multiple rooms with different teachers, avoiding all conflicts.",
      },
      {
        title: "Fitness Studio",
        description:
          "Manage class Timetables with instructor availability, room capacity limits, and equipment requirements.",
      },
      {
        title: "Coaching Center",
        description:
          "Create subject-wise batches, assign teachers based on expertise, and share weekly schedules automatically.",
      },
    ],
    faqs: [
      {
        question: "Can students choose their own batch?",
        answer:
          "Students can view available batches and request enrollment. You approve or auto-assign based on your rules.",
      },
      {
        question: "How does trainer availability work?",
        answer:
          "Trainers set their available hours. The system only shows feasible slots when creating or modifying batches.",
      },
      {
        question: "Can I create recurring schedules?",
        answer:
          "Yes, set up weekly recurring schedules with a single configuration. Holiday management is built-in.",
      },
    ],
    stats: [
      { value: "0", label: "Scheduling conflicts" },
      { value: "30%", label: "Better utilization" },
      { value: "1-click", label: "Schedule sharing" },
    ],
  },
  {
    slug: "whatsapp-notifications",
    name: "WhatsApp Notifications",
    tagline: "Instant updates to parents and students",
    description:
      "Send automated WhatsApp messages for attendance alerts, fee reminders, schedule changes, and announcements. Personalized, timely, and trackable.",
    icon: MessageSquare,
    iconName: "MessageSquare",
    color: "text-accent-green",
    bgColor: "bg-accent-green/10",
    category: "Admissions",
    highlights: [
      "Automated attendance alerts",
      "Fee payment reminders",
      "Schedule change notifications",
      "Bulk announcements",
      "Read receipts tracking",
      "Template management",
    ],
    benefits: [
      {
        title: "98% Open Rate",
        description:
          "WhatsApp messages are read within minutes. Far better than email (20%) or SMS (45%).",
        icon: Eye,
      },
      {
        title: "Automated Workflows",
        description:
          "Set it and forget it. Messages go out automatically based on triggers - no manual sending needed.",
        icon: Workflow,
      },
      {
        title: "Personalized Messages",
        description:
          "Each message is personalized with student name, batch details, and specific information. Not generic blasts.",
        icon: UserCheck,
      },
      {
        title: "Track Delivery",
        description:
          "Know exactly who received, read, and engaged with your messages. Follow up with non-readers.",
        icon: PieChart,
      },
    ],
    useCases: [
      {
        title: "Daily Attendance",
        description:
          "Parents receive instant notification when their child checks in. Absence alerts sent automatically.",
      },
      {
        title: "Fee Collection",
        description:
          "Reminders start 7 days before due date. Escalating messages for overdue payments.",
      },
      {
        title: "Event Announcements",
        description:
          "Share event details, holiday notices, and important updates to all parents at once.",
      },
    ],
    faqs: [
      {
        question: "Do parents need to install any app?",
        answer:
          "No, messages are delivered directly to their existing WhatsApp. No app installation required.",
      },
      {
        question: "Can parents reply to messages?",
        answer:
          "Yes, two-way communication is supported. Parents can reply and staff can respond from the dashboard.",
      },
      {
        question: "What about message limits?",
        answer:
          "We provide enterprise-grade WhatsApp Business API access with high volume limits and dedicated support.",
      },
    ],
    stats: [
      { value: "98%", label: "Message read rate" },
      { value: "<2min", label: "Average read time" },
      { value: "24/7", label: "Automated delivery" },
    ],
  },
  {
    slug: "rental-booking",
    name: "Rental Booking",
    tagline: "Real-time availability and booking calendar",
    description:
      "Manage your rental inventory with real-time availability tracking, instant booking confirmations, and automated invoicing. Perfect for equipment, venues, or vehicle rentals.",
    icon: Package,
    iconName: "Package",
    color: "text-accent-blue",
    bgColor: "bg-accent-blue/10",
    category: "Inventory",
    highlights: [
      "Real-time availability calendar",
      "Online booking portal",
      "Automated invoicing",
      "Damage/return tracking",
      "Maintenance scheduling",
      "Multi-location inventory",
    ],
    benefits: [
      {
        title: "No Double Bookings",
        description:
          "Real-time availability ensures each item is booked only once. Conflicts are prevented automatically.",
        icon: Lock,
      },
      {
        title: "24/7 Online Booking",
        description:
          "Customers can check availability and book online anytime. You get notified and approve with one tap.",
        icon: Globe,
      },
      {
        title: "Automated Invoicing",
        description:
          "Invoices generated automatically based on booking duration, with proper GST calculation and payment tracking.",
        icon: FileText,
      },
      {
        title: "Asset Tracking",
        description:
          "Track condition, maintenance schedule, and complete booking history for every item in your inventory.",
        icon: Database,
      },
    ],
    useCases: [
      {
        title: "Event Equipment",
        description:
          "Manage sound systems, lighting, and staging equipment across multiple events with conflict-free scheduling.",
      },
      {
        title: "Vehicle Fleet",
        description:
          "Track availability, maintenance schedules, and rental history for your vehicle fleet.",
      },
      {
        title: "Venue Rental",
        description:
          "Manage hall bookings with time slots, catering add-ons, and deposit tracking.",
      },
    ],
    faqs: [
      {
        question: "Can customers book online?",
        answer:
          "Yes, you get a branded booking portal where customers can check availability and make bookings.",
      },
      {
        question: "How are deposits handled?",
        answer:
          "System tracks advance payments, security deposits, and final settlements with automated reminders.",
      },
      {
        question: "Can I manage multiple locations?",
        answer:
          "Yes, inventory can be organized by location with cross-location visibility for better utilization.",
      },
    ],
    stats: [
      { value: "0", label: "Double bookings" },
      { value: "50%", label: "More bookings" },
      { value: "100%", label: "Asset visibility" },
    ],
  },
  {
    slug: "event-planning",
    name: "Event Planning",
    tagline: "From enquiry to closure report",
    description:
      "Plan, execute, and track events end-to-end. Manage vendors, budgets, tasks, and communications in one place. Never miss a detail again.",
    icon: CalendarCheck,
    iconName: "CalendarCheck",
    color: "text-primary",
    bgColor: "bg-primary/10",
    category: "Inventory",
    highlights: [
      "Event timeline management",
      "Vendor coordination",
      "Budget tracking",
      "Task assignment",
      "Guest list management",
      "Post-event reports",
    ],
    benefits: [
      {
        title: "Complete Visibility",
        description:
          "See your entire event pipeline - upcoming, in-progress, and completed - in a single dashboard.",
        icon: LayoutDashboard,
      },
      {
        title: "Budget Control",
        description:
          "Track expenses against budget in real-time. Get alerts when spending approaches limits.",
        icon: Wallet,
      },
      {
        title: "Team Coordination",
        description:
          "Assign tasks, set deadlines, and track progress. Everyone knows what they need to do.",
        icon: Users,
      },
      {
        title: "Vendor Management",
        description:
          "Maintain vendor database, track performance, manage contracts, and compare quotes easily.",
        icon: Star,
      },
    ],
    useCases: [
      {
        title: "Wedding Planning",
        description:
          "Coordinate multiple vendors, track deposits, manage guest lists, and handle last-minute changes.",
      },
      {
        title: "Corporate Events",
        description:
          "Manage speaker schedules, attendee registrations, AV requirements, and post-event feedback.",
      },
      {
        title: "Cultural Programs",
        description:
          "Coordinate performers, manage rehearsal schedules, track ticket sales, and handle logistics.",
      },
    ],
    faqs: [
      {
        question: "Can multiple team members work on the same event?",
        answer:
          "Yes, with role-based access. Each team member sees and edits only what they're responsible for.",
      },
      {
        question: "How are vendor payments tracked?",
        answer:
          "System tracks advance payments, milestone payments, and final settlements with proper audit trails.",
      },
      {
        question: "Can I create event templates?",
        answer:
          "Yes, save successful events as templates to quickly set up similar future events.",
      },
    ],
    stats: [
      { value: "100%", label: "Task completion" },
      { value: "20%", label: "Cost savings" },
      { value: "5-star", label: "Client ratings" },
    ],
  },
  {
    slug: "reports",
    name: "Reports",
    tagline: "Revenue, attendance, and utilization reports",
    description:
      "Generate comprehensive reports on revenue, attendance, enrollment, and operations. Export to Excel, schedule email delivery, and make data-driven decisions.",
    icon: FileText,
    iconName: "FileText",
    color: "text-accent-yellow",
    bgColor: "bg-accent-yellow/10",
    category: "Operations",
    highlights: [
      "Revenue and collection reports",
      "Attendance analytics",
      "Enrollment trends",
      "Trainer performance",
      "Custom report builder",
      "Scheduled email reports",
    ],
    benefits: [
      {
        title: "Instant Insights",
        description:
          "Pre-built reports for common metrics. No waiting for data team or complex spreadsheet formulas.",
        icon: Zap,
      },
      {
        title: "Custom Analytics",
        description:
          "Build custom reports by combining metrics. Drag-and-drop interface - no coding required.",
        icon: Settings,
      },
      {
        title: "Scheduled Delivery",
        description:
          "Reports delivered to your inbox daily, weekly, or monthly. Start every morning with insights.",
        icon: Send,
      },
      {
        title: "Export Anywhere",
        description:
          "Export to Excel, PDF, or share via link. Perfect for board meetings or investor updates.",
        icon: FileText,
      },
    ],
    useCases: [
      {
        title: "Daily Operations",
        description:
          "Morning report showing yesterday's collections, attendance, and pending follow-ups.",
      },
      {
        title: "Monthly Review",
        description:
          "Comprehensive monthly report covering revenue, growth, expenses, and profitability.",
      },
      {
        title: "Investor Updates",
        description:
          "Professional reports showcasing growth metrics, utilization rates, and financial health.",
      },
    ],
    faqs: [
      {
        question: "Can I schedule reports?",
        answer:
          "Yes, set up daily, weekly, or monthly reports that are automatically emailed to you or your team.",
      },
      {
        question: "How far back can I view data?",
        answer:
          "All historical data is retained. You can view and export reports from the day you started using the system.",
      },
      {
        question: "Can I create custom reports?",
        answer:
          "Yes, the report builder lets you select metrics, filters, and groupings to create exactly what you need.",
      },
    ],
    stats: [
      { value: "50+", label: "Pre-built reports" },
      { value: "1-click", label: "Report export" },
      { value: "Real-time", label: "Data freshness" },
    ],
  },
  {
    slug: "mobile-app",
    name: "Mobile App",
    tagline: "Manage everything from your phone",
    description:
      "Full-featured mobile app for admins, trainers, and students. Mark attendance, check schedules, collect fees, and communicate - all from your pocket.",
    icon: Smartphone,
    iconName: "Smartphone",
    color: "text-accent-blue",
    bgColor: "bg-accent-blue/10",
    category: "Operations",
    highlights: [
      "iOS and Android support",
      "Offline functionality",
      "Push notifications",
      "QR code scanning",
      "Real-time sync",
      "Biometric login",
    ],
    benefits: [
      {
        title: "Manage On-the-Go",
        description:
          "Run your institute from anywhere. Full admin capabilities in your pocket - no desktop required.",
        icon: Smartphone,
      },
      {
        title: "Trainer Productivity",
        description:
          "Trainers mark attendance, view schedules, and communicate with students without leaving the class.",
        icon: UserCheck,
      },
      {
        title: "Student Experience",
        description:
          "Students check attendance, pay fees, view schedules, and receive notifications on their phone.",
        icon: Star,
      },
      {
        title: "Works Offline",
        description:
          "Full functionality even without internet. Data syncs automatically when connectivity returns.",
        icon: Cloud,
      },
    ],
    useCases: [
      {
        title: "Admin Dashboard",
        description:
          "Check collections, attendance stats, and pending tasks while commuting or traveling.",
      },
      {
        title: "Trainer App",
        description:
          "Mark attendance with QR scan, view today's schedule, and communicate with students.",
      },
      {
        title: "Parent App",
        description:
          "View child's attendance, pay fees, receive notifications, and communicate with institute.",
      },
    ],
    faqs: [
      {
        question: "Is the app free?",
        answer:
          "Yes, the mobile app is included free with all plans. Students and parents can download it at no cost.",
      },
      {
        question: "Does it work on all phones?",
        answer:
          "Supports iOS 14+ and Android 8+. Works on 99% of smartphones in use today.",
      },
      {
        question: "Can I customize the app?",
        answer:
          "White-label options available on Enterprise plan - your logo, your brand, your app store listing.",
      },
    ],
    stats: [
      { value: "4.8★", label: "App store rating" },
      { value: "99%", label: "Device compatibility" },
      { value: "Offline", label: "Full support" },
    ],
  },
  {
    slug: "analytics",
    name: "Analytics",
    tagline: "Smart insights for better decisions",
    description:
      "AI-powered analytics that surface insights you'd miss. Predict churn, identify growth opportunities, and optimize operations with data-driven intelligence.",
    icon: BarChart3,
    iconName: "BarChart3",
    color: "text-primary",
    bgColor: "bg-primary/10",
    category: "Operations",
    highlights: [
      "Revenue forecasting",
      "Churn prediction",
      "Utilization optimization",
      "Growth analytics",
      "Custom dashboards",
      "AI-powered insights",
    ],
    benefits: [
      {
        title: "Predict Before It Happens",
        description:
          "AI identifies students likely to drop out, revenue dips, and capacity issues before they become problems.",
        icon: TrendingUp,
      },
      {
        title: "Growth Opportunities",
        description:
          "Discover which batches to expand, which courses to launch, and where to focus marketing efforts.",
        icon: Target,
      },
      {
        title: "Benchmark Performance",
        description:
          "Compare performance across batches, trainers, and time periods. Identify what's working and replicate it.",
        icon: GitBranch,
      },
      {
        title: "Visual Dashboards",
        description:
          "Beautiful, interactive dashboards that make complex data easy to understand at a glance.",
        icon: LayoutDashboard,
      },
    ],
    useCases: [
      {
        title: "Revenue Forecasting",
        description:
          "Predict next month's revenue based on enrollment trends, payment patterns, and seasonal factors.",
      },
      {
        title: "Student Retention",
        description:
          "Identify at-risk students early and take proactive action to prevent dropouts.",
      },
      {
        title: "Capacity Planning",
        description:
          "Optimize batch sizes and schedules based on actual utilization patterns and demand forecasts.",
      },
    ],
    faqs: [
      {
        question: "Do I need data expertise to use analytics?",
        answer:
          "No, the system presents insights in plain language with actionable recommendations. No data science degree required.",
      },
      {
        question: "How accurate are predictions?",
        answer:
          "Models are trained on millions of data points across similar businesses. Accuracy improves as you use the system more.",
      },
      {
        question: "Can I create custom dashboards?",
        answer:
          "Yes, drag-and-drop dashboard builder lets you create views tailored to your specific needs.",
      },
    ],
    stats: [
      { value: "85%", label: "Prediction accuracy" },
      { value: "3x", label: "Faster decisions" },
      { value: "25%", label: "Revenue growth" },
    ],
  },
  {
    slug: "multi-tenant-architecture",
    name: "Multi-Tenant Architecture",
    tagline: "True tenant isolation and elastic scalability",
    description:
      "Enterprise-grade multi-tenant architecture ensuring complete data isolation, elastic scalability, and 99.9% uptime. Your data is yours alone.",
    icon: Layers,
    iconName: "Layers",
    color: "text-accent-cyan",
    bgColor: "bg-accent-cyan/10",
    category: "Platform",
    highlights: [
      "Complete data isolation",
      "99.9% uptime SLA",
      "Auto-scaling infrastructure",
      "Daily backups",
      "Global CDN",
      "SOC 2 compliant",
    ],
    benefits: [
      {
        title: "Your Data is Safe",
        description:
          "Complete tenant isolation means your data is never mixed with others. Military-grade encryption at rest and in transit.",
        icon: ShieldCheck,
      },
      {
        title: "Grow Without Limits",
        description:
          "Infrastructure scales automatically. Whether you have 100 or 100,000 students, performance stays consistent.",
        icon: TrendingUp,
      },
      {
        title: "Always Available",
        description:
          "99.9% uptime guarantee with redundant infrastructure across multiple availability zones.",
        icon: Clock,
      },
      {
        title: "Disaster Recovery",
        description:
          "Automated daily backups with point-in-time recovery. Your data is safe even in worst-case scenarios.",
        icon: RefreshCw,
      },
    ],
    useCases: [
      {
        title: "Multi-branch Institutes",
        description:
          "Each branch operates independently with centralized reporting and management.",
      },
      {
        title: "Franchise Operations",
        description:
          "Franchisees get their own isolated environment while franchisor maintains visibility.",
      },
      {
        title: "Enterprise Deployment",
        description:
          "Large organizations with strict data governance requirements get dedicated infrastructure.",
      },
    ],
    faqs: [
      {
        question: "Is my data shared with other tenants?",
        answer:
          "Never. Each tenant has complete data isolation at the database level. Your data is only accessible to you.",
      },
      {
        question: "What about data residency?",
        answer:
          "Choose from India, US, or EU data centers. Enterprise plans offer custom data residency options.",
      },
      {
        question: "How often is data backed up?",
        answer:
          "Automated backups every 6 hours with 30-day retention. Point-in-time recovery available for the last 7 days.",
      },
    ],
    stats: [
      { value: "99.9%", label: "Uptime SLA" },
      { value: "256-bit", label: "Encryption" },
      { value: "Zero", label: "Data breaches" },
    ],
  },
  {
    slug: "role-based-access",
    name: "Role-Based Access Control",
    tagline: "Granular permissions for every team member",
    description:
      "Define exactly what each team member can see and do. From admin to trainer to front desk - everyone gets the right level of access.",
    icon: Lock,
    iconName: "Lock",
    color: "text-accent-red",
    bgColor: "bg-accent-red/10",
    category: "Platform",
    highlights: [
      "Pre-built role templates",
      "Custom role creation",
      "Module-level permissions",
      "Audit logging",
      "IP restrictions",
      "Session management",
    ],
    benefits: [
      {
        title: "Right Access, Right People",
        description:
          "Trainers see only their batches. Accountants see only financial data. Everyone sees what they need.",
        icon: UserCheck,
      },
      {
        title: "Audit Everything",
        description:
          "Complete audit trail of who accessed what, when, and what changes were made. Essential for compliance.",
        icon: Eye,
      },
      {
        title: "Easy Management",
        description:
          "Pre-built roles for common positions. Create custom roles in minutes with our visual permission editor.",
        icon: Settings,
      },
      {
        title: "Secure by Default",
        description:
          "Least-privilege principle applied by default. Permissions can only be expanded, never accidentally reduced.",
        icon: ShieldCheck,
      },
    ],
    useCases: [
      {
        title: "Institute Owner",
        description:
          "Full access to everything including financial data, settings, and user management.",
      },
      {
        title: "Center Manager",
        description:
          "Access to operations, attendance, fees, and reports - but not system settings or billing.",
      },
      {
        title: "Trainer",
        description:
          "View only their assigned batches, mark attendance, and communicate with their students.",
      },
    ],
    faqs: [
      {
        question: "How many roles can I create?",
        answer:
          "Unlimited custom roles on all plans. Start with pre-built templates and customize as needed.",
      },
      {
        question: "Can a user have multiple roles?",
        answer:
          "Yes, users can be assigned multiple roles with permissions merged. The most permissive access wins.",
      },
      {
        question: "How is access enforced?",
        answer:
          "Enforced at both UI and API level. Even direct API calls are filtered by permissions.",
      },
    ],
    stats: [
      { value: "100%", label: "Access control" },
      { value: "Unlimited", label: "Custom roles" },
      { value: "Full", label: "Audit trail" },
    ],
  },
];

export function getFeatureBySlug(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}

export function getAllFeatureSlugs(): string[] {
  return features.map((f) => f.slug);
}

export function getFeaturesByCategory(category: string): Feature[] {
  return features.filter((f) => f.category === category);
}
