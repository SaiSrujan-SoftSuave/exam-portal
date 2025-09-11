import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";

interface ExamDetailsProps {
  examTitle?: string;
  duration?: string;
  questionCount?: number;
  allowedResources?: string[];
  instructions?: string[];
}

export const ExamDetails = ({
  examTitle = "Mathematics Final Exam",
  duration = "120 minutes",
  questionCount = 50,
  allowedResources = ["Basic Calculator"],
  instructions = [
    "Camera and microphone must be enabled throughout the exam",
    "No external websites or applications allowed",
    "Ensure stable internet connection",
    "Read all questions carefully before answering"
  ]
}: ExamDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-4 h-auto bg-muted/20 hover:bg-muted/40 transition-all duration-200"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 text-primary" />
            Click to View Exam Details
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <Card className="border-primary/20 bg-background/50">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-primary mb-1">Exam Title</h4>
                <p className="text-sm text-foreground">{examTitle}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-primary mb-1">Duration</h4>
                <p className="text-sm text-foreground">{duration}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-primary mb-1">Questions</h4>
                <p className="text-sm text-foreground">{questionCount} questions</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm text-primary mb-1">Allowed Resources</h4>
                <p className="text-sm text-foreground">
                  {allowedResources.length > 0 ? allowedResources.join(", ") : "None"}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm text-primary mb-2">Instructions</h4>
              <ul className="space-y-1">
                {instructions.map((instruction, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};