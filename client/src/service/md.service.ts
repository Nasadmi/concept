export const encodeBase64 = (str: string) => btoa(str);
export const decodeBase64 = (str: string) => {
  try {
    return atob(str)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return '';
  }
};