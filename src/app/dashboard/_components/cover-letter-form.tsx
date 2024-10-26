"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { countWords } from "@/utils/text-utils";
import FileUpload from "./file-upload";
import JobDescription from "./job-description";

export default function CoverLetterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jdWordCount, setJdWordCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !jobDescription) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      // Simulating API call
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const json = await response.json();
      // Here you would typically send the data to your API
      console.log("Submitting:", { file, jobDescription });
      if (!response.ok || json.Error) {
        toast({
          title: "Error",
          description: json.Error,
          variant: "default",
        });
      } else {
        toast({
          title: "Cover letter generated!",
          description: "Your AI-powered cover letter is ready.",
          action: <ToastAction altText="View cover letter">View</ToastAction>,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Reset form
      setFile(null);
      setJobDescription("");
      setJdWordCount(0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-1/3 h-4/5 rounded-xl p-1">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              AI Cover Letter Generator
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <FileUpload file={file} setFile={setFile} />
              <JobDescription
                jdWordCount={jdWordCount}
                jobDescription={jobDescription}
                setJdWordCount={setJdWordCount}
                setJobDescription={setJobDescription}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!file || !jobDescription || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
