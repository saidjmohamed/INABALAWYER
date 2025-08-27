import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Council, Court } from "@/types";
import { ScrollArea } from "./ui/scroll-area";

interface JudicialBodySelectorProps {
  councils: Council[];
  courts: Court[];
  value: string;
  onChange: (value: string) => void;
}

export const JudicialBodySelector = ({ councils, courts, value, onChange }: JudicialBodySelectorProps) => {
  return (
    <div className="border rounded-md">
      <ScrollArea className="h-72">
        <Accordion type="single" collapsible className="w-full">
          <RadioGroup value={value} onValueChange={onChange} className="p-2">
            {councils.map((council) => {
              const councilCourts = courts.filter((court) => court.council_id === council.id);
              
              if (council.name === 'مجلس الدولة' || council.name === 'المحكمة العليا') {
                const highCourt = councilCourts[0];
                if (highCourt) {
                  const highCourtValue = `court:${highCourt.id}`;
                  return (
                    <div key={council.id} className="flex items-center space-x-2 space-x-reverse p-2 border-b">
                      <RadioGroupItem value={highCourtValue} id={highCourtValue} />
                      <Label htmlFor={highCourtValue} className="font-semibold cursor-pointer flex-grow">{council.name}</Label>
                    </div>
                  );
                }
                return null;
              }

              const councilValue = `council:${council.id}`;
              return (
                <AccordionItem value={council.id} key={council.id}>
                  <AccordionTrigger className="px-2 py-2 hover:no-underline">
                    <div className="flex items-center space-x-2 space-x-reverse w-full">
                      <RadioGroupItem value={councilValue} id={councilValue} onClick={(e) => { e.stopPropagation(); onChange(councilValue); }} />
                      <Label htmlFor={councilValue} className="cursor-pointer">{council.name} (مجلس)</Label>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-10 pr-4 pb-2 space-y-3">
                      {councilCourts.map((court) => {
                        const courtValue = `court:${court.id}`;
                        return (
                          <div key={court.id} className="flex items-center space-x-2 space-x-reverse">
                            <RadioGroupItem value={courtValue} id={courtValue} />
                            <Label htmlFor={courtValue} className="font-normal cursor-pointer">{court.name}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </RadioGroup>
        </Accordion>
      </ScrollArea>
    </div>
  );
};