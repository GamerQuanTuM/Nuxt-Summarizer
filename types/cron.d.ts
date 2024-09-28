function defineCronHandler(
  time: CronPresets | CronTime,
  callback: CronTick,
  options?: CronOptions
): CronJob;

type CronTime =
  | "everySecond"
  | "everyMinute"
  | "everyTwoMinutes"
  | "everyThreeMinutes"
  | "everyFourMinutes"
  | "everyFiveMinutes"
  | "everyTenMinutes"
  | "everyFifteenMinutes"
  | "everyThirtyMinutes"
  | "hourly"
  | "everyOddHour"
  | "everyTwoHours"
  | "everyThreeHours"
  | "everyFourHours"
  | "everySixHours"
  | "daily"
  | "weekly"
  | "quarterly"
  | "yearly";

type CronTime = () => string;

type CronTick = () => void | Promise<void>;

interface CronOptions {
  runOnInit?: boolean;
  timeZone?: string | null;
}

interface CronJob {
  time: CronTime;
  callback: CronTick;
  options?: CronOptions;
}
