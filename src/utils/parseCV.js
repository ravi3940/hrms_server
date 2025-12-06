import fs from "fs";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export const parseCV = async (file) => {
  const ext = file.originalname.split(".").pop().toLowerCase();

  let text = "";

  if (ext === "pdf") {
    const dataBuffer = fs.readFileSync(file.path);
    const parsed = await pdf(dataBuffer);
    text = parsed.text;
  } 
  else if (ext === "docx") {
    const result = await mammoth.extractRawText({ path: file.path });
    text = result.value;
  }

  // SIMPLE AI/REGEX FIELD EXTRACTION
  const name = text.match(/Name[:\s]*([A-Za-z ]+)/i)?.[1] || "";
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/)?.[0] || "";
  const phone = text.match(/(\+91[-\s]?)?\d{10}/)?.[0] || "";

  const linkedin = text.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s]+/i)?.[0] || "";

  return { name, email, phone, linkedin, raw: text };
};
