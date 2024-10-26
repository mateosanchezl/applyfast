import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { countWords } from "@/utils/text-utils";

interface JobDescriptionProps {
  jobDescription: string;
  setJobDescription: (description: string) => void;
  jdWordCount: number;
  setJdWordCount: (count: number) => void;
}

const JobDescription = ({
  jobDescription,
  setJobDescription,
  jdWordCount,
  setJdWordCount,
}: JobDescriptionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center">
        <Label htmlFor="job-description" className="pr-2">
          Job Description
        </Label>
        <Popover>
          <PopoverTrigger>
            <QuestionMarkCircledIcon />
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Job Description</h4>
              </div>
              <div className="grid gap-2">
                Please provide a detailed job description.
                <br /> Include key responsibilities, required skills, and any other relevant
                information that will help us tailor your cover letter to the job. <br />
                The more specific you are, the better we can customize your cover letter to match
                the job requirements.
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {jdWordCount > 0 ? (
          <p className="pl-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Words: {jdWordCount}
          </p>
        ) : undefined}
      </div>
      <div className="relative">
        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            setJdWordCount(countWords(e.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default JobDescription;
