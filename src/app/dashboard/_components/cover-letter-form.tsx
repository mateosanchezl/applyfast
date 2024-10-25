"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileUp, Link as LinkIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function CoverLetterForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !jobUrl) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_url", jobUrl);

    try {
      // Simulating API call
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      // Here you would typically send the data to your API
      console.log("Submitting:", { file, jobUrl });
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
      setJobUrl("");
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
              <Label htmlFor="job-url">Job Advertisement URL</Label>
              <div className="relative">
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://example.com/job-posting"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="pl-10"
                />
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={!file || !jobUrl || isLoading}>
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
