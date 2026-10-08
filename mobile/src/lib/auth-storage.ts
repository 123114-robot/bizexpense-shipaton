import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'bizexpense_token';
const REFRESH_TOKEN_KEY = 'bizexpense_refresh_token';

export async function loadStoredSession() {
  if (Platform.OS === 'web') return typeof localStorage === 'undefined' ? { access: null, refresh: null } : {
    access: localStorage.getItem(ACCESS_TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
  const [access, refresh] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);
  return { access, refresh };
}

export async function storeSession(access: string | null, refresh: string | null) {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') return;
    if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
    else localStorage.removeItem(ACCESS_TOKEN_KEY);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    else localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }
  await Promise.all([
    access ? SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access) : SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    refresh ? SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh) : SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
}
