import { NextRequest, NextResponse } from "next/server";
import { validateAndParsePdf, validateFormData } from "./helpers";
import { formDataSchema } from "./schemas";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Extraction
  const formData = await req.formData();
  const file = formData.get("file") as Blob;
  const job_description = formData.get("job_description");

  console.log("Initial Validation Success");

  try {
    // Initial Val
    validateFormData({ file, job_description });
    // CV Parsing and Validation
    const cvText = await validateAndParsePdf(file);

    return NextResponse.json(
      { cv_text: cvText, job_description: job_description },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ Error: error.message }, { status: 400 });
  }
}
