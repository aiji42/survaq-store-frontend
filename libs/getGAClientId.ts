declare global {
  interface Window {
    gtag?: (type: string, measurementId: string, target: string, callback: (value: string) => void) => void;
  }
}

export const getGAClientId = (): undefined | string => {
  if (typeof window === "undefined" || !('gtag' in window)) return undefined;
  let clientId: string | undefined;
  window.gtag?.('get', 'GA_MEASUREMENT_ID', 'client_id', (client_id: string) => {
    clientId = client_id;
  })
  return clientId;
}