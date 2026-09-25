import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, View } from 'react-native';

import { Body, Display, Mono } from '@/components/typography';
import { colors, spacing } from '@/constants/theme';
import { linkGroups, profile } from '@/constants/portfolio';

export function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.symbols}>
        <Image source={profile.footerSymbol} style={styles.symbol} contentFit="contain" />
        <Image source={profile.footerSymbol} style={styles.symbol} contentFit="contain" />
      </View>
      <Display size={56} style={styles.light}>
        {profile.firstName}
        {'\n'}
        {profile.lastName}
      </Display>

      <View style={styles.grid}>
        {linkGroups.map((group) => (
          <View key={group.heading} style={styles.col}>
            <Body size={16} style={styles.muted}>
              {group.heading}
            </Body>
            {group.links.map((link) => (
              <Pressable
                key={link.url}
                accessibilityRole="link"
                onPress={() => Linking.openURL(link.url)}
                hitSlop={6}
              >
                <Body size={18} style={styles.light}>
                  {link.label}
                </Body>
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Mono style={styles.muted}>
        © - {profile.firstName} {profile.lastName} // {new Date().getFullYear()}
      </Mono>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: colors.fg,
    padding: spacing.gutter,
    paddingTop: 40,
    paddingBottom: 48,
    gap: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  symbols: {
    flexDirection: 'row',
    gap: 12,
  },
  symbol: {
    width: 36,
    height: 36,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 24,
  },
  col: {
    width: '50%',
    gap: 6,
  },
  light: {
    color: colors.bg,
  },
  muted: {
    color: colors.bg2,
    opacity: 0.6,
  },
});
