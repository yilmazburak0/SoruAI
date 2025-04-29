export const setAuthCookie = (token, expiryDays = 1) => {
  const maxAgeSeconds = 60 * 60 * 24 * expiryDays;
  document.cookie = `token=${token}; path=/; max-age=${maxAgeSeconds}`;
};