interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  secretKey: string;
}

function getAppwriteConfig(): AppwriteConfig {
  const appwriteEndpoint = process.env.VITE_APP_APPWRITE_ENDPOINT;
  const appwriteProjectId = process.env.VITE_APP_APPWRITE_PROJECT_ID;
  const appwriteSecretKey = process.env.VITE_APP_APPWRITE_SECRET_KEY;

  if (!appwriteEndpoint || !appwriteProjectId || !appwriteSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error: Missing Appwrite credentials",
    });
  }

  return {
    endpoint: appwriteEndpoint,
    projectId: appwriteProjectId,
    secretKey: appwriteSecretKey,
  };
};

export default getAppwriteConfig
