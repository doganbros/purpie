export function setCookie(name: string, days?: number, value?: string): void {
  const date = new Date();

  let expires = '; expires=Thu, 01-Jan-70 00:00:01 GMT';
  if (days) {
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  const domain = `.${new URL(process.env.REACT_APP_CLIENT_HOST!).hostname}`;

  document.cookie = `${name}=${
    value || ''
  }${expires}; path=/; domain=${domain}`;
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function removeCookie(name: string): void {
  setCookie(name);
}
