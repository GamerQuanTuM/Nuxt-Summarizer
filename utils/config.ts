const config = {
  secretKey: process.env.VITE_APP_APPWRITE_SECRET_KEY,
  endpoint: process.env.VITE_APP_APPWRITE_ENDPOINT,
  projectId: process.env.VITE_APP_APPWRITE_PROJECT_ID,
  databaseId: process.env.VITE_APP_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.VITE_APP_APPWRITE_USER_COLLECTION_ID,
  summaryCollectionId: process.env.VITE_APP_APPWRITE_SUMMARY_COLLECTION_ID,
  bucketId: process.env.VITE_APP_APPWRITE_BUCKET_ID,
  geminiApiKey: process.env.VITE_APP_GEMINI_API_KEY,
};

export default config;
