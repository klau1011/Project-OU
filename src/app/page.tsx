import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  BarChart3, 
  HelpCircle,
  Calculator,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from '../assets/logo.png';

const features = [
  {
    title: "General Guide",
    description: "Essential timeline and tips for your Grade 12 journey",
    href: "/guide",
    icon: BookOpen,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Community Resources",
    description: "Student-shared tips, advice and helpful resources",
    href: "/tips",
    icon: Users,
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Admissions Data",
    description: "Real admission averages from all cycles",
    href: "/admissions",
    icon: BarChart3,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "GPA Calculator",
    description: "Calculate your Ontario high school average",
    href: "/calculator",
    icon: Calculator,
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    title: "Compare Programs",
    description: "Side-by-side comparison of universities and programs",
    href: "/compare",
    icon: Sparkles,
    color: "bg-pink-500/10 text-pink-500",
  },
  {
    title: "FAQ",
    description: "Answers to frequently asked questions",
    href: "/FAQ",
    icon: HelpCircle,
    color: "bg-cyan-500/10 text-cyan-500",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 py-20 md:py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />
        
        <div className="flex items-center gap-4 mb-6">
          <Image 
            src={Logo} 
            alt="Project OU Logo" 
            width={80} 
            height={80}
            className="rounded-xl shadow-lg"
            priority
          />
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Project OU
            </span>
          </div>
        </div>
        
        <p className="max-w-2xl text-center text-lg text-muted-foreground mb-8">
          Your intelligent central source of information for Ontario university admissions. 
          Built by students, for students.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild className="group shadow-lg hover:shadow-xl">
            <Link href="/guide">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="backdrop-blur-sm">
            <Link href="/admissions">View Admissions Data</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold tracking-tight mb-12 md:text-3xl">
            Everything you need for your university journey
          </h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1"
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
                <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent transition-transform group-hover:scale-110">20+</div>
              <div className="text-sm text-muted-foreground mt-1">Ontario Universities</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent transition-transform group-hover:scale-110">500+</div>
              <div className="text-sm text-muted-foreground mt-1">Programs Listed</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-primary bg-clip-text text-transparent transition-transform group-hover:scale-110">All</div>
              <div className="text-sm text-muted-foreground mt-1">Admission Cycle Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for Ontario high school students</p>
          <p className="mt-2">© {new Date().getFullYear()} Project OU. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
