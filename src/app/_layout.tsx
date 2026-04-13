import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../core/theme/theme.provider';
import { AlertBox } from '../shared/components/alert-box';
import { AuthProvider } from '../ui/auth/view-models/useAuth';
import { LoadingOverlay } from '../ui/shared/components/LoadingOverlay';

const queryClient = new QueryClient();

function MainLayout() {
  return (
    <>
      <Stack screenOptions={{ animation: 'slide_from_right' }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/add-transaction" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="(modals)/add-account" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="(modals)/add-category" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* <SplashScreenProvider> */}
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <AuthProvider>
            <MainLayout />
            <LoadingOverlay />
            <AlertBox />
          </AuthProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
      {/* </SplashScreenProvider> */}
    </ThemeProvider>
  );
}
