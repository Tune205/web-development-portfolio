import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { colors, fonts } from '@/constants/theme';

function glyph(char: string) {
  return function TabIcon({ color }: { color: ColorValue }) {
    return <Text style={{ color, fontSize: 18 }}>{char}</Text>;
  };
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent1,
        tabBarInactiveTintColor: colors.fg,
        tabBarStyle: { backgroundColor: colors.bg, borderTopColor: colors.bg2 },
        tabBarLabelStyle: {
          fontFamily: fonts.mono,
          fontSize: 11,
          textTransform: 'uppercase',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: glyph('✦') }} />
      <Tabs.Screen name="work" options={{ title: 'Work', tabBarIcon: glyph('▦') }} />
      <Tabs.Screen name="contact" options={{ title: 'Contact', tabBarIcon: glyph('✉') }} />
    </Tabs>
  );
}
