export const compactMarkdown = (md: string) => {
  return md
  .replace(/\s+/g, '')
  .trim()
}

export const encodeBase64 = (str: string) => btoa(str);
export const decodeBase64 = (str: string) => atob(str);