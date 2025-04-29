'use client';

export function useTokenCookie() {
  const checkTokenExists = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token' && value) {
          return true;
        }
      }
    }
    return false;
  };

  return { checkTokenExists };
}