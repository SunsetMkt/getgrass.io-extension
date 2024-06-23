import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    getValue();

    if (typeof chrome.storage !== "undefined") {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes[key] && changes[key].newValue) {
          setStoredValue(parseValue(changes[key].newValue));
        }
      });
    }
  }, []);

  const parseValue = (value: string) => {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };

  const getValue = async () => {
    if (typeof window === "undefined") {
      setStoredValue(initialValue);
    }

    try {
      if (typeof chrome.storage !== "undefined") {
        const result = await chrome.storage.local.get([key]);
        setStoredValue(parseValue(result[key]));
      } else {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? parseValue(item) : initialValue);
      }
    } catch (error) {
      console.error("[STORAGE ERROR]", error);
    }
  };

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      setStoredValue(value);
      if (typeof chrome.storage !== "undefined") {
        chrome.storage.local
          .set({ [key]: JSON.stringify(value) })
          .catch((err) => {
            console.error("[CHROME SET ERROR]", err);
          });
      } else if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("[STORAGE ERROR]", error);
    }
  };
  return [storedValue, setValue] as const;
}

export default useLocalStorage;
