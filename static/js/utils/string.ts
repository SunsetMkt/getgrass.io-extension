export const shortenString = (
  string: string | undefined | null,
  firstBreakpoint = 6,
  secondBreakpoint = 4
) => {
  if (!string) {
    return string;
  }

  return `${string.slice(0, firstBreakpoint)}...${string.slice(
    string.length - secondBreakpoint,
    string.length
  )}`;
};
