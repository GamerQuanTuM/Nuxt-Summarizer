import { defineCronHandler } from "#nuxt/cron";
import { emptyStorageAndDatabase } from "../api/emptyStorage.get";

export default defineCronHandler("everySixHours", async() => {
  try {
    const result = await emptyStorageAndDatabase();
    console.log("Cron job result:", result);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
