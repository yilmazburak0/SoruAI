export const saveToLocalStorage = (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
  
  export const getFromLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  };
  
  export const removeFromLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };