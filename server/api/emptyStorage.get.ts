import { $fetch } from "ofetch";
import config from "~/utils/config";


const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Response-Format": "1.6.0",
  "X-Appwrite-Project": `${config.projectId}`,
  "X-Appwrite-Key": `${config.secretKey}`,
}

const listFiles = async () => {
  const response = await $fetch(
    `${config.endpoint}/storage/buckets/${config.bucketId}/files`,
    {
      method: "GET",
      headers,
    }
  );
  return response.files;
};

const deleteFile = async (fileId: string) => {
  await $fetch(
    `${config.endpoint}/storage/buckets/${config.bucketId}/files/${fileId}`,
    {
      method: "DELETE",
      headers,
    }
  );
};

const listDocuments = async () => {
  const response = await $fetch(
    `${config.endpoint}/databases/${config.databaseId}/collections/${config.summaryCollectionId}/documents`,
    {
      method: "GET",
      headers,
    }
  );
  return response.documents;
};

const deleteDocument = async (documentId: string) => {
  await $fetch(
    `${config.endpoint}/databases/${config.databaseId}/collections/${config.summaryCollectionId}/documents/${documentId}`,
    {
      method: "DELETE",
      headers,
    }
  );
};

export const emptyStorageAndDatabase = async () => {
  try {
    // Empty storage bucket
    const files = await listFiles();
    for (const file of files) {
      await deleteFile(file.$id);
    }
    
    // Empty Summary database
    const documents = await listDocuments();
    for (const document of documents) {
      await deleteDocument(document.$id);
    }
    
    return { success: true, message: 'All files and documents deleted successfully' };
  } catch (error: any) {
    console.error("Error emptying storage and database:", error);
    throw error;
  }
};

export default defineEventHandler(async (event) => {
  try {
    const result = await emptyStorageAndDatabase();
    event.node.res.statusCode = 200;
    return result;
  } catch (error: any) {
    event.node.res.statusCode = 500;
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message
    }));
  }
});