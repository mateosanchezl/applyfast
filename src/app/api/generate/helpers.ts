import PDFParser from "pdf2json";

export const MAX_FILE_SIZE = 1 * 1024 * 1024;

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

      console.log("Extracted text: ", text);

      resolve(text);
    });

    parser.parseBuffer(buffer);
  });
};

export const removeExcessWhitespace = (text: string) => {
  text = text.trim();
  // Replace multiple whitespaces with one
  text = text.replace(/\s+/g, " ");
  return text;
};
