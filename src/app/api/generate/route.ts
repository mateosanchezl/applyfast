import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { parsePdf } from "./helpers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();

  const file = formData.get("file") as Blob;
  const job_url = formData.get("job_url");

  if (!job_url || !file) {
    return NextResponse.json({ Error: "No job_url or file." }, { status: 400 });
  }

  const text = await parsePdf(file);
  return NextResponse.json({ text: text, job_url: job_url }, { status: 201 });
}
