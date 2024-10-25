import { NextRequest, NextResponse } from "next/server";
import { validateAndParse } from "./helpers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();

  const file = formData.get("file") as Blob;
  const job_description = formData.get("job_description");

  if (!job_description || !file) {
    return NextResponse.json({ Error: "No job_description or file." }, { status: 400 });
  }

  try {
    const cvText = await validateAndParse(file);
    return NextResponse.json(
      { cv_text: cvText, job_description: job_description },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ Error: error.message }, { status: 400 });
  }
}
