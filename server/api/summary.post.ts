import { sendError, readMultipartFormData } from "h3";
import { $fetch } from "ofetch";
import { v4 as uuidv4 } from "uuid";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { createCanvas } from "canvas";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import config from "~/utils/config";

const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  apiKey: config.geminiApiKey,
  maxOutputTokens: 2048,
});
const CHUNK_SIZE = 1000;

function chunkText(text: string, chunkSize: number): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if ((currentChunk + word).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += (currentChunk ? " " : "") + word;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function pdfToText(data: Buffer): Promise<string> {
  const pdfData = new Uint8Array(data);
  const pdf = await pdfjsLib.getDocument(pdfData).promise;
  let extractedText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const textItems = textContent.items.map((item: any) => item.str);
    extractedText += textItems.join(" ") + "\n";
  }

  return extractedText;
}

async function pdfToImage(data: Buffer): Promise<Buffer> {
  const pdfData = new Uint8Array(data);
  const pdf = await pdfjsLib.getDocument(pdfData).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 1.5 });

  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext("2d");

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  await page.render(renderContext).promise;

  return canvas.toBuffer();
}

async function summary(text: string): Promise<string> {
  const prompt = PromptTemplate.fromTemplate(
    `Please summarize the following text: {text} extracted from a PDF. Return the summary in HTML format, ensuring it follows Markdown-like formatting conventions. The output should include the following elements:

    <h1> for main headings
    <h2> for subheadings
    <h3> for sub-subheadings
    <ul> for unordered lists with <li> for each list item
    <blockquote> for quotes
    <code> for code snippets
    <strong> for bold text
    <u> for underlined text
    <em> for italicized text

    Ensure that the summary captures the main points clearly and is structured appropriately.
    Don't include the response within this \\\href\\\
    `
  );

  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  const chunks = chunkText(text, CHUNK_SIZE);
  let summarizedChunks: string[] = [];

  for (const chunk of chunks) {
    const response = await chain.invoke({
      text: chunk,
    });
    summarizedChunks.push(response);
  }

  return summarizedChunks.join("\n\n");
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readMultipartFormData(event);

    const cookies = parseCookies(event);

    if (body && body[0]?.data) {
      const { data, filename } = body[0];

      if (!(data instanceof Buffer)) {
        throw new Error("Uploaded data is not a valid buffer.");
      }

      const userDocuments = await $fetch(
        `${config.endpoint}/databases/${config.databaseId}/collections/${config.userCollectionId}/documents?queries[]={"method":"equal","attribute":"userId","values":["${cookies.userId}"]}`,
        {
          method: "GET",
          headers: {
            "X-Appwrite-Project": `${config.projectId}`,
            "X-Appwrite-Key": `${config.secretKey}`,
          },
        }
      );

      const userDocument = userDocuments.documents[0];

      if (userDocument.credit <= 0) {
        event.node.res.statusCode = 403;
        return {
          message: "You have exhausted your credit limit.",
        };
      }

      // Prepare the formData to upload to Appwrite
      const formData = new FormData();
      const fileId = uuidv4();

      formData.append("fileId", fileId);
      formData.append("file", new Blob([data]), filename);

      await $fetch(
        `${config.endpoint}/storage/buckets/${config.bucketId}/files`,
        {
          method: "POST",
          body: formData,
          headers: {
            "X-Appwrite-Project": `${config.projectId}`,
            "X-Appwrite-Key": `${config.secretKey}`,
          },
        }
      );

      const extractedText = await pdfToText(data);
      const summarisedText = await summary(extractedText);
      const imageBuffer = await pdfToImage(data);

      // Upload the image to Appwrite
      const imageFormData = new FormData();
      const imageFileId = uuidv4();

      imageFormData.append("fileId", imageFileId);
      imageFormData.append("file", new Blob([imageBuffer]), `${fileId}.png`);

      await $fetch(
        `${config.endpoint}/storage/buckets/${config.bucketId}/files`,
        {
          method: "POST",
          body: imageFormData,
          headers: {
            "X-Appwrite-Project": `${config.projectId}`,
            "X-Appwrite-Key": `${config.secretKey}`,
          },
        }
      );

      const fileUrl = `${config.endpoint}/storage/buckets/${config.bucketId}/files/${fileId}/view?project=${config.projectId}`;
      const previewImageUrl = `${config.endpoint}/storage/buckets/${config.bucketId}/files/${imageFileId}/view?project=${config.projectId}`;

      await $fetch(
        `${config.endpoint}/databases/${config.databaseId}/collections/${config.summaryCollectionId}/documents`,
        {
          method: "POST",
          body: {
            documentId: uuidv4(),
            data: {
              fileId,
              userId: cookies.userId,
              summaryText: summarisedText,
              fileUrl,
              fileName: filename,
              previewImageUrl,
            },
            permissions: [],
          },
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Response-Format": "1.6.0",
            "X-Appwrite-Project": `${config.projectId}`,
            "X-Appwrite-Key": `${config.secretKey}`,
          },
        }
      );

      let newCredit = userDocument.credit - 200;

      await $fetch(
        `${config.endpoint}/databases/${config.databaseId}/collections/${config.userCollectionId}/documents/${userDocument.$id}`,
        {
          method: "PATCH",
          body: {
            data: {
              credit: newCredit,
            },
          },
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Response-Format": "1.6.0",
            "X-Appwrite-Project": `${config.projectId}`,
            "X-Appwrite-Key": `${config.secretKey}`,
          },
        }
      );

      event.node.res.statusCode = 201;
      return {
        message: "File Uploaded",
        fileId,
        summary: summarisedText,
        fileUrl,
        previewImageUrl,
        credit: newCredit,
      };
    } else {
      event.node.res.statusCode = 400;
      return sendError(event, new Error("No PDF file found in the request"));
    }
  } catch (error: any) {
    event.node.res.statusCode = 500;
    console.error("Error during file upload:", error);
    return sendError(event, error);
  }
});
