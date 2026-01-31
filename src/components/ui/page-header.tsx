import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  gradient?: boolean;
}

export default function PageHeader({ title, description, icon: Icon, gradient = false }: PageHeaderProps) {
  return (
    <div className="mb-10 mt-5">
      <h1 className={`mb-3 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl ${
        gradient ? "bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent" : ""
      }`}>
        {title}
        {Icon && <Icon className="h-8 w-8 text-primary" />}
      </h1>
      {description && (
        <p className="text-base text-muted-foreground max-w-2xl">{description}</p>
      )}
    </div>
  );
}
