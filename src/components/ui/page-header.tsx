import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export default function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-10 mt-5">
      <h1 className="mb-2 flex scroll-m-20 items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {title}
        {Icon && <Icon className="h-8 w-8" />}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
