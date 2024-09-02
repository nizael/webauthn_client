export const base64urlToBase64 = (base64url: string) => {
  return base64url.replace(/-/g, '+').replace(/_/g, '/')
};
