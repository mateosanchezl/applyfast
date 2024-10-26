import PDFParser from "pdf2json";
import { formDataSchema, wordCharCountSchema } from "./schemas";

export const parsePdf = async (pdfFile: Blob): Promise<string> => {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const parser = new PDFParser();

  return new Promise((resolve, reject) => {
    parser.on("pdfParser_dataError", (errData) => {
      reject(new Error("Failed to parse PDF"));
    });

    parser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData.Pages.map((page) =>
        page.Texts.map((textItem) => decodeURIComponent(textItem.R[0].T)).join(" ")
      ).join("\n");

      resolve(text);
    });

    parser.parseBuffer(buffer);
  });
};

export const cleanText = (text: string): string => {
  text = text.trim();
  // Replace multiple whitespaces with one
  text = text.replace(/\s+/g, " ");
  text = text.replace(/[\u2018\u2019\u201C\u201D]/g, "'").replace(/[^\w\s.,'()-]/g, "");
  return text;
};

export const countWords = (text: string): number => {
  const words = text.match(/\b\w+\b/g);
  return words ? words.length : 0;
};

export const validateAndParsePdf = async (pdfFile: Blob): Promise<string> => {
  try {
    // Parse and clean pdf
    let text = await parsePdf(pdfFile);
    text = cleanText(text);

    // Validate
    const result = wordCharCountSchema.safeParse(text);
    if (!result.success) {
      throw new Error(result.error.errors[0].message);
    }

    return text;
  } catch (error: any) {
    // Catch parsing error
    throw new Error(`Validation and parsing failed: ${error.message}`);
  }
};

export const validateFormData = ({
  file,
  job_description,
}: {
  file: Blob;
  job_description: FormDataEntryValue | null;
}) => {
  const initialValidationResult = formDataSchema.safeParse({ file, job_description });
  if (!initialValidationResult.success) {
    throw new Error(initialValidationResult.error.errors[0].message);
  }
};
