import { $fetch } from "ofetch";
import config from "~/utils/config";

export default defineEventHandler(async (event) => {
  const cookie = parseCookies(event);

  try {
    const response = await $fetch(
      `${config.endpoint}/databases/${config.databaseId}/collections/${config.summaryCollectionId}/documents?queries[]={"method":"equal","attribute":"userId","values":["${cookie.userId}"]}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Response-Format": "1.6.0",
          "X-Appwrite-Project": `${config.projectId}`,
          "X-Appwrite-Key": `${config.secretKey}`,
        },
      }
    );

    event.node.res.statusCode = 200;
    return response;
  } catch (err:any) {
    event.node.res.statusCode = 500;
    return sendError(event, err);
  }
});
