import { readBody, sendError, H3Event, setCookie } from "h3";
import { $fetch } from "ofetch";
import config from "~/utils/config";

type RequestBody = {
  email: string;
  password: string;
};

// Delete user sessions
export default defineEventHandler(async (event: H3Event) => {
  const body: RequestBody = await readBody(event);


  try {
    const dbData = await $fetch(`${config.endpoint}/account/sessions`, {
      method: "POST",
      body: {
        email: body.email,
        password: body.password,
      },
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Response-Format": "1.6.0",
        "X-Appwrite-Project": `${config.projectId}`,
      },
    });

    const userDetails = await $fetch(`${config.endpoint}/users/${dbData.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Response-Format": "1.6.0",
        "X-Appwrite-Project": `${config.projectId}`,
        "X-Appwrite-Key": `${config.secretKey}`,
      },
    });

    const storedData = await $fetch(
      `${
        config.endpoint
      }/databases/${`${config.databaseId}`}/collections/${`${config.userCollectionId}`}/documents?queries[]={"method":"equal","attribute":"email","values":["${userDetails.email}"]}`,
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


    const data = {
      name: userDetails.name,
      email: userDetails.email,
      createdAt: userDetails.$createdAt,
      updatedAt: userDetails.$updatedAt,
      userId: dbData.userId,
      sessionId:dbData.$id,
      credit:storedData.documents[0].credit,
      maxCredit:storedData.documents[0].maxCredit
    };

    setCookie(event, 'sessionId', dbData.$id, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });
    setCookie(event, 'userId', dbData.userId, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });


    event.node.res.statusCode = 200;
    return data;
  } catch (error: any) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    );
  }
});
