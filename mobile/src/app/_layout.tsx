import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { colors, fonts } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    [fonts.display]: require('../../assets/fonts/PPRader-Italic.ttf'),
    [fonts.displayBold]: require('../../assets/fonts/PPRader-BoldItalic.ttf'),
    [fonts.body]: require('../../assets/fonts/PPFormula-NarrowSemibold.ttf'),
    [fonts.mono]: require('../../assets/fonts/PPSupplyMono-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Fall back to system fonts rather than a blank screen if loading fails.
  if (!loaded && !error) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </>
  );
}
