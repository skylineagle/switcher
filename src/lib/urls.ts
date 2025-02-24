const PORTS = {
  switcher: 8000,
  stream: 8889,
  pocketbase: 8090,
  baker: 3000,
} as const;

function getServiceUrl(service: keyof typeof PORTS): string {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = PORTS[service];

  return `${protocol}//${hostname}:${port}`;
}

export const urls = {
  get switcher() {
    return getServiceUrl("switcher");
  },
  get pocketbase() {
    return getServiceUrl("pocketbase");
  },
  get baker() {
    return getServiceUrl("baker");
  },
  get mediamtx() {
    return getServiceUrl("stream");
  },
};
