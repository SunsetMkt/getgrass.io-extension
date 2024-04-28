export const formatNumber = (
  n: string | number,
  decimals = 2,
  options?: Intl.NumberFormatOptions
) => {
  const num = Number(n);
  const defaultOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  };

  if (num >= 100000) {
    defaultOptions.notation = "compact";
  }

  return num.toLocaleString("en-US", { ...defaultOptions, ...options });
};

export const truncateString = (string: string, maxLength = 15) => {
  if (string.length <= maxLength) {
    return string;
  }

  return `${string.slice(0, maxLength)}...`;
};
