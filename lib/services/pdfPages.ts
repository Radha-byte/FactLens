import { extractText, getDocumentProxy } from "unpdf";

/**
 * Splits a PDF buffer into an array of per-page plain text.
 * Index 0 = page 1, index 1 = page 2, etc.
 */
export async function extractPageTexts(buffer: Buffer): Promise<string[]> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: false });

  // unpdf returns a string[] when mergePages is false — one entry per page
  return Array.isArray(text) ? text : [text];
}