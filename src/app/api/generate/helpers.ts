import PDFParser from "pdf2json";

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const MIN_WORD_COUNT = 100;
const MAX_WORD_COUNT = 500;

const MIN_CHAR_COUNT = 300;
const MAX_CHAR_COUNT = 3000;

export const parsePdf = async (pdfFile: Blob): Promise<string> => {
  const arrayBuffer = await pdfFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const parser = new PDFParser();

  return new Promise((resolve, reject) => {
    parser.on("pdfParser_dataError", (errData) => {
      console.error(errData.parserError);
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

export const validateAndParse = async (
  pdfFile: Blob
): Promise<string | { Error: string; status: number }> => {
  if (pdfFile.type !== "application/pdf") {
    throw new Error("Invalid file type. Only PDFs are allowed.");
  }

  if (pdfFile.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
  }

  // Parse and clean pdf
  let text = await parsePdf(pdfFile);
  text = cleanText(text);

  // Check word and char limits
  const words = countWords(text);
  const chars = text.length;
  console.log("COUNTING IN: ", text);
  console.log("Total words: ", words);
  console.log("Total chars: ", text.length);

  if (words < MIN_WORD_COUNT) {
    throw new Error(`Word count is lower than minimum of ${MIN_WORD_COUNT}`);
  }

  if (words > MAX_WORD_COUNT) {
    throw new Error(
      `Word count is higher than maximum of ${MAX_WORD_COUNT}, please remove any text that may not be useful in the creation of your cover letter.`
    );
  }

  if (chars > MAX_CHAR_COUNT || chars < MIN_CHAR_COUNT) {
    throw new Error(`Character count must be between ${MIN_CHAR_COUNT} and ${MAX_CHAR_COUNT}.`);
  }

  return text;
};
