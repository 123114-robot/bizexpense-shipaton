export type ConnectivitySnapshot = {
  isConnected?: boolean;
  isInternetReachable?: boolean;
};

export function isOffline(state: ConnectivitySnapshot): boolean {
  return state.isConnected === false || state.isInternetReachable === false;
}
