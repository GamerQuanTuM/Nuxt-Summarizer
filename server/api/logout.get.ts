import { sendError, H3Event, setCookie } from "h3";
import config from "~/utils/config";

export default defineEventHandler(async (event: H3Event) => {


  // Retrieve userId and sessionId from cookies
  const userId = getCookie(event, 'userId');
  const sessionId = getCookie(event, 'sessionId');

  if (!userId || !sessionId) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Missing userId or sessionId',
      })
    );
  }

  try {
    await $fetch(`${config.endpoint}/users/${userId}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${config.projectId}`,
        "X-Appwrite-Key": `${config.secretKey}`,
      },
    });

    // Clear the cookies
    setCookie(event, 'sessionId', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
      path: '/' // Ensure the cookie is cleared for all paths
    });
    setCookie(event, 'userId', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
      path: '/' // Ensure the cookie is cleared for all paths
    });

    return { message: 'Logout successful' };
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