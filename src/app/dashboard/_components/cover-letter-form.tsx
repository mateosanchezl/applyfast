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

export default function CoverLetterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
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

      // Here you would typically send the data to your API
      console.log("Submitting:", { file, jobDescription });
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to generate cover letter. Please try again.",
          variant: "destructive",
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
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Reset form
      setFile(null);
      setJobDescription("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            AI Cover Letter Generator
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cv-upload">Upload your CV</Label>
              <div className="relative">
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("cv-upload")?.click()}
                >
                  <FileUp className="w-4 h-4 mr-2" />
                  {file ? file.name : "Choose file"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <div className="relative">
                <Textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>
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
  );
}
