import { NextRequest, NextResponse } from "next/server";
import { MAX_FILE_SIZE, parsePdf, removeExcessWhitespace } from "./helpers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();

  const file = formData.get("file") as Blob;
  const job_url = formData.get("job_url");

  if (!job_url || !file) {
    return NextResponse.json({ Error: "No job_url or file." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ Error: "Invalid file type." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { Error: `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.` },
      { status: 400 }
    );
  }

  // Parse and clean pdf
  let text = await parsePdf(file);
  text = removeExcessWhitespace(text);

  return NextResponse.json({ text: text, job_url: job_url }, { status: 201 });
}
