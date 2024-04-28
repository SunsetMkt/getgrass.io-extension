// deviceUptime (in seconds)
export const calculatePoints = (deviceUptime: number, finalScore: number) => {
  let score = Number(finalScore);
  if (typeof finalScore !== "number") {
    score = 0;
  }

  return (Number(deviceUptime) / 3600) * score;
};
