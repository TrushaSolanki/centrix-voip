const getItem = <T>(key: string): T | null => {
  let value = null;
  try {
    if (typeof window !== "undefined") {
      const result = window.localStorage.getItem(key);
      if (result) {
        value = JSON.parse(result);
      }
    }
  } catch (error) {
    console.error(error);
  }
  return value;
};

const getStringItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};
const clearItems = () => {
  localStorage.clear();
};

export { getStringItem, setItem, removeItem, clearItems, getItem };
