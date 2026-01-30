import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const timelineData = [
  {
    period: "September to November",
    badge: "Getting Started",
    badgeVariant: "default" as const,
    icon: "🍂",
    items: [
      "Start building good life and studying habits now. Sleep is everything.",
      "Get involved! This is your last chance to join clubs, teams, council which are crucial to having a competitive application.",
      "Research into university programs that you may be interested in, take online quizzes, attend open house/Q&A sessions",
      "Begin to look into common supp app questions (requires lots of thought & time but you don't need to figure out the details now)",
    ],
  },
  {
    period: "November to February",
    badge: "Application Season",
    badgeVariant: "secondary" as const,
    icon: "📝",
    items: [
      {
        main: "You will receive your OUAC pins to register & apply, usually by mid-November",
        sub: [
          "You have until early-mid January for equal consideration",
          "Log into your university portals ASAP & start brainstorming for any supp apps",
        ],
      },
      {
        main: "Many programs will begin to offer early admissions starting December",
        sub: [
          "More competitive programs only start after they see your first semester marks in February",
        ],
      },
      {
        main: "Start early for supp apps. You want to have fresh eyes on it as many times as you can.",
        sub: [
          "Have you submitted an English assignment and were confident in your work after looking it over a million times, only to get it back with a bunch of silly errors you can't believe you didn't notice?",
          "Aim to finish your supp app early then put it away for a few days or a week before revising",
        ],
        highlight: true,
      },
    ],
  },
  {
    period: "February to May",
    badge: "Waiting Game",
    badgeVariant: "outline" as const,
    icon: "⏳",
    items: [
      "Congrats, you're half way there!",
      "Something called senioritis will start to devour you. Stay focused, your marks likely still matter.",
      "Most people will receive their final decisions by mid-May. Some (cough cough UofT for '22) waited until the last week of May.",
      {
        main: "After semester 2 midterm marks are locked in, marks don't really matter anymore for admission purposes. You can let loose a bit now, but don't be reckless.",
        sub: [
          "It's uncommon but people do get rescinded for not meeting conditionals on their offer.",
        ],
      },
    ],
  },
  {
    period: "Mid-May to June",
    badge: "Final Stretch",
    badgeVariant: "default" as const,
    icon: "🎓",
    items: [
      "Accept your offer before June 1",
      "Senioritis cannot be controlled now. Your classes might have 5 people in them in June.",
      "You're pretty much done! Make the most of your last weeks of high school, as you will not see many of these people ever again :'(",
    ],
  },
];

type TimelineItem = string | { main: string; sub: string[]; highlight?: boolean };

const TimelineCard = ({
  period,
  badge,
  badgeVariant,
  icon,
  items,
}: {
  period: string;
  badge: string;
  badgeVariant: "default" | "secondary" | "outline" | "destructive";
  icon: string;
  items: TimelineItem[];
}) => (
  <Card className="relative overflow-hidden">
    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" />
    <CardHeader className="pb-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-lg sm:text-xl">{period}</CardTitle>
            <Badge variant={badgeVariant} className="w-fit">{badge}</Badge>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-2">
            <span className="text-primary mt-1.5 text-xs">●</span>
            <div className="flex-1">
              {typeof item === "string" ? (
                <span className="text-muted-foreground">{item}</span>
              ) : (
                <>
                  <span
                    className={
                      item.highlight
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    {item.main}
                  </span>
                  {item.sub && (
                    <ul className="mt-2 ml-4 space-y-1.5">
                      {item.sub.map((subItem, subIdx) => (
                        <li
                          key={subIdx}
                          className="text-sm text-muted-foreground flex gap-2"
                        >
                          <span className="text-primary/60">○</span>
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const GuidePage = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          A guide to your Grade 12 year
        </h1>
        <p className="text-lg text-muted-foreground">
          All the essentials to be successful in your last year of high school!
        </p>
      </div>

      <div className="grid gap-6">
        {timelineData.map((section) => (
          <TimelineCard key={section.period} {...section} />
        ))}
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤔</span>
            <div>
              <CardTitle>Choosing a program</CardTitle>
              <CardDescription>Coming soon...</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default GuidePage;
