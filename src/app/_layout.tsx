import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '@/context/auth-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="requests" />
          <Stack.Screen name="services" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="emergency" />
          <Stack.Screen name="explore" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(customer)" />
          <Stack.Screen name="(mechanic)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
