import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Body, Display } from '@/components/typography';
import { colors } from '@/constants/theme';

// The gradient "Get in touch" pill from the site's .contact-cta section.
export function ContactCta() {
  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Get in touch"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
          router.navigate('/contact');
        }}
        style={({ pressed }) => [styles.shadow, pressed && styles.pressed]}
      >
        <LinearGradient
          colors={[colors.accent1, colors.accent2, colors.accent3, colors.accent4]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Body size={16} style={styles.center}>
            Let's build something amazing together
          </Body>
          <Display size={44} style={styles.center}>
            Get in touch
          </Display>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  shadow: {
    borderRadius: 999,
    backgroundColor: '#000',
    // Solid offset shadow, like the site's box-shadow: 10px 10px 0 5px #000.
    paddingRight: 8,
    paddingBottom: 8,
  },
  pressed: {
    transform: [{ translateX: 4 }, { translateY: 4 }],
    paddingRight: 4,
    paddingBottom: 4,
  },
  button: {
    height: 180,
    borderRadius: 999,
    borderWidth: 6,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  center: {
    textAlign: 'center',
  },
});
