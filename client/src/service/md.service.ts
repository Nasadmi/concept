export const encodeBase64 = (str: string) => btoa(String.fromCharCode(...new TextEncoder().encode(str)));
export const decodeBase64 = (str: string) => {
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(str), c => c.charCodeAt(0)))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return '';
  }
};