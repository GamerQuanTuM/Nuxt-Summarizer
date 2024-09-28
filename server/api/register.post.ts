import { readBody, sendError, H3Event } from "h3";
import { $fetch } from "ofetch";
import { v4 as uuidv4 } from "uuid";
import config from "~/utils/config";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  userId: string;
};

export default defineEventHandler(async (event: H3Event) => {
  const body: RequestBody = await readBody(event);


  try {
    await $fetch(`${config.endpoint}/users`, {
      method: "POST",
      body: {
        email: body.email,
        password: body.password,
        name: body.name,
        userId: body.userId,
      },
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Response-Format": "1.6.0",
        "X-Appwrite-Project": `${config.projectId}`,
        "X-Appwrite-Key": `${config.secretKey}`,
      },
    });

    const dbData = await $fetch(
      `${
        config.endpoint
      }/databases/${`${config.databaseId}`}/collections/${`${config.userCollectionId}`}/documents`,
      {
        method: "POST",
        body: {
          documentId: uuidv4(),
          data: {
            email: body.email,
            name: body.name,
            userId: body.userId,
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

    event.node.res.statusCode = 201;
    return dbData;
  } catch (error: any) {
    console.error("Error:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    );
  }
});
