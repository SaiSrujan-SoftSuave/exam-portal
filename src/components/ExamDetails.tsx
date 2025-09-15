import { useState } from "react";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface ExamDetailsProps {
  examTitle?: string;
  duration?: string;
  questionCount?: number;
  allowedResources?: string[];
  instructions?: string[];
}

export const ExamDetails = ({
  examTitle = "Software Trainee Exam",
  duration = "60 minutes",
  questionCount = 15,
  allowedResources = ["Basic Calculator"],
  instructions = [
    "Camera and microphone must be enabled throughout the exam",
    "No external websites or applications allowed",
    "Ensure stable internet connection",
    "Read all questions carefully before answering"
  ]
}: ExamDetailsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-center p-3 h-auto bg-muted/20 hover:bg-muted/40 transition-all duration-200"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4 text-primary" />
            View Exam Details
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Exam Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-primary">Exam Title</h4>
              <p className="text-sm text-foreground bg-muted/30 p-2 rounded">{examTitle}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-primary">Duration</h4>
              <p className="text-sm text-foreground bg-muted/30 p-2 rounded">{duration}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-primary">Questions</h4>
              <p className="text-sm text-foreground bg-muted/30 p-2 rounded">{questionCount} questions</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-primary">Allowed Resources</h4>
              <p className="text-sm text-foreground bg-muted/30 p-2 rounded">
                {allowedResources.length > 0 ? allowedResources.join(", ") : "None"}
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-primary">Instructions</h4>
            <Card className="border-primary/20 bg-muted/10">
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="text-sm text-foreground flex items-start gap-3">
                      <span className="text-primary font-bold mt-0.5">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};