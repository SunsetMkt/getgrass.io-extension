import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// deviceUptime (in seconds)
export const calculatePoints = (
  deviceUptime: number,
  finalScore: number,
  ipUptime?: number
) => {
  let score = Number(finalScore);
  if (typeof finalScore !== "number") {
    score = 0;
  }
  let points = (Number(deviceUptime) / 3600) * score;

  let percentageShare = 1;
  if (ipUptime) {
    percentageShare = deviceUptime / ipUptime;

    const now = dayjs.utc();
    const startOfDay = dayjs.utc().startOf("day");
    const diffFromStartOfDay = Math.abs(now.diff(startOfDay, "seconds"));

    if (ipUptime > diffFromStartOfDay) {
      // If the ip uptime of the device exceeds the time elapsed of the current day, prevent the calculation from exceeding it.
      ipUptime = diffFromStartOfDay;
    }

    points = (Number(ipUptime) / 3600) * score * percentageShare;
  }

  return points;
};
