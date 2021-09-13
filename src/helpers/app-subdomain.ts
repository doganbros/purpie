const { REACT_APP_CLIENT_HOST = 'http://localhost:3000' } = process.env;

const clientHostUrl = new URL(REACT_APP_CLIENT_HOST);

const { hostname } = window.location;

const subdomain = hostname.slice(
  0,
  hostname.lastIndexOf(clientHostUrl.hostname) - 1
);
const isValidSubDomain =
  hostname !== clientHostUrl.hostname &&
  hostname.lastIndexOf(clientHostUrl.hostname) >= 0 &&
  subdomain &&
  subdomain !== 'www';

export const appSubdomain = isValidSubDomain ? subdomain : null;

export const navigateToSubdomain = (sub?: string): void => {
  if (sub) {
    clientHostUrl.hostname = sub.concat('.', clientHostUrl.hostname);
  }
  window.location.href = clientHostUrl.href;
};
