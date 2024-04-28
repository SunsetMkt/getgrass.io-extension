const parseValue = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

export const getStorageValue = async (key: string) => {
  let result;

  try {
    if (typeof chrome.storage !== "undefined") {
      const value = await chrome.storage.local.get([key]);
      result = value[key];
    } else {
      result = window.localStorage.getItem(key);
    }
  } catch (error) {
    console.error("[STORAGE ERROR]", error);
  }

  return parseValue(result as string);
};
