import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthScreen } from '@/components/auth-screen';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { SubscriptionProvider } from '@/providers/subscription-provider';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider><AuthenticatedApp /></AuthProvider>
    </ThemeProvider>
  );
}

function AuthenticatedApp() {
  const { user, loading } = useAuth();
  if (loading) return <AnimatedSplashOverlay />;
  if (!user) return <AuthScreen />;
  return <SubscriptionProvider><AnimatedSplashOverlay /><AppTabs /></SubscriptionProvider>;
}
