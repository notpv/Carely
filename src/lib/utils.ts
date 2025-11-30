// src/lib/utils.ts

export const formatAiResponseText = (text: string): string => {
  if (!text) return '';

  let formattedText = text;

  // 1. Remove headings in asterisks (e.g., *Diet*, *Exercise*)
  // This regex looks for an asterisk, then captures any characters that are not asterisks,
  // then another asterisk, followed by a newline or end of string.
  // It replaces them with just the captured content or nothing if it's truly a standalone heading to be removed.
  formattedText = formattedText.replace(/\*(.*?)\*\n?/g, '');

  // Replace multiple newlines with at most two to prevent excessive spacing,
  // primarily to clean up after potential markdown list parsing issues for plain text contexts.
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');

  return formattedText.trim();
};