"use client";

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { FAQ as FAQItems } from "@/data/FAQ";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const [search, setSearch] = useState("");

  const filteredFAQs = useMemo(() => {
    if (!search.trim()) return FAQItems;
    const searchLower = search.toLowerCase();
    return FAQItems.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower)
    );
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Frequently asked questions
        </h1>
        <p className="text-muted-foreground">
          Common questions about Ontario university admissions
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {search && (
          <Badge variant="secondary">
            {filteredFAQs.length} result{filteredFAQs.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {filteredFAQs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-muted-foreground">
              No questions found matching &quot;{search}&quot;
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {filteredFAQs.map((FAQ, index) => (
            <AccordionItem key={`item-${index}`} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {FAQ.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {FAQ.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Can&apos;t find what you&apos;re looking for?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Try using our AI chatbot in the bottom right corner for personalized
          answers to your questions.
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;