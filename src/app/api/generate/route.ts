import { NextRequest, NextResponse } from "next/server";
import { validateAndParsePdf } from "./helpers";
import { formDataSchema } from "./schemas";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();

  const file = formData.get("file") as Blob;
  const job_description = formData.get("job_description");

  const initialValidationResult = formDataSchema.safeParse({ file, job_description });

  if (!initialValidationResult.success) {
    return NextResponse.json(
      { Error: initialValidationResult.error.errors[0].message },
      { status: 400 }
    );
  }

  console.log("Initial Validation Success");

  try {
    const fileText = await validateAndParsePdf(file);
    console.log("Validated and parsed: ", fileText);
    return NextResponse.json(
      { cv_text: fileText, job_description: job_description },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ Error: error.message }, { status: 400 });
  }
}
