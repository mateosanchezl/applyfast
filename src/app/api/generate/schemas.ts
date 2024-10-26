import { z } from "zod";
import { countWords } from "./helpers";

// CONSTANTS
export const MAX_FILE_SIZE = 1 * 1024 * 1024;

export const MIN_WORD_COUNT = 100;
export const MAX_WORD_COUNT = 500;

export const MIN_CHAR_COUNT = 300;
export const MAX_CHAR_COUNT = 3000;

// SCHEMAS
export const fileSchema = z.object({
  type: z.literal("application/pdf"),
  size: z
    .number()
    .max(MAX_FILE_SIZE, `File size exceeds the limit of ${MAX_FILE_SIZE / (1024 * 1024)} MB.`),
});

export const validateWordAndCharCount = (text: string): boolean => {
  const wordCount = countWords(text);
  const charCount = text.length;
  const wordsValid = wordCount >= MIN_WORD_COUNT && wordCount <= MAX_WORD_COUNT;
  const charsValid = charCount >= MIN_CHAR_COUNT && charCount <= MAX_CHAR_COUNT;

  return wordsValid && charsValid;
};

export const formDataSchema = z.object({
  file: z.instanceof(Blob).refine((file) => fileSchema.safeParse(file).success, {
    message: "Invalid file type or size.",
  }),
  job_description: z
    .string()
    .min(1, "Job description is required.")
    .refine(validateWordAndCharCount, {
      message: `CV and Job Description word count must be between ${MIN_WORD_COUNT} and ${MAX_WORD_COUNT} and character count must be between ${MIN_CHAR_COUNT} and ${MAX_CHAR_COUNT}.`,
    }),
});

export const wordCharCountSchema = z.string().refine(validateWordAndCharCount, {
  message: `CV word count must be between ${MIN_WORD_COUNT} and ${MAX_WORD_COUNT} and character count must be between ${MIN_CHAR_COUNT} and ${MAX_CHAR_COUNT}.`,
});
