import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUp } from "lucide-react";

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileUpload = ({ file, setFile }: FileUploadProps) => {
  return (
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
  );
};

export default FileUpload;
