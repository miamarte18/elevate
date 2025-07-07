export const cookieStorage = {
  getItem: (key: string) => {
    if (typeof document === "undefined") return null; // Server side, no document
    const match = document.cookie.match(new RegExp("(^| )" + key + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (key: string, value: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/;`;
  },
  removeItem: (key: string) => {
    if (typeof document === "undefined") return;
    document.cookie = `${key}=; Max-Age=0; path=/;`;
  },
};
