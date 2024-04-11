import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ as FAQItems } from "@/data/FAQ";

const Page = () => {
    return (
      <>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl border-b pb-2">
          Frequently asked questions
        </h1>
        <Accordion type="single" collapsible className="w-full mt-10">
          {FAQItems.map((FAQ, index) => {
            return (
              <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                <AccordionTrigger>{FAQ.question}</AccordionTrigger>
                <AccordionContent>{FAQ.answer}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </>
    );
  };
  
  export default Page;