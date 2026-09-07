export function chunkText(
  text: string,
  chunkSize = 1200,
  overlap = 200
) {
  const chunks: string[] = [];

  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);

    chunks.push(text.slice(start, end));

    start += chunkSize - overlap;
  }

  return chunks;
}