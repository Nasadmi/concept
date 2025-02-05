export const getCookie = (name: string) => {
  const cookie = document.cookie.match('(^|;)\\s*' + name + '=([^;]*)');
  return cookie ? cookie.pop() : null;
}

export const createCookie = ({ name, value, days }: { name: string; value: string; days?: number }) => {
  let expires: string = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 3600 * 1000));
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = `${name}=${value}${expires}; path=/`
  console.log(document.cookie)
}