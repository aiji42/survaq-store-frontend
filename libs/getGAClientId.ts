declare global {
  interface Window {
    gtag?: (type: string, measurementId: string, target: string, callback: (value: string) => void) => void;
  }
}

export const getGAClientId = async  (): Promise<undefined | string> => {
  if (typeof window === "undefined" || !('gtag' in window)) return undefined;
  
  return new Promise((resolve) => {
    window.gtag?.('get', 'G-1LJBMEE5TP', 'client_id', (clientId: string) => {
      resolve(clientId);
    })
  });
}