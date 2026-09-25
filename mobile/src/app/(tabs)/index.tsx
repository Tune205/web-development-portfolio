import { Image } from 'expo-image';
import { Link } from 'expo-router';
import * as Linking from 'expo-linking';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContactCta } from '@/components/contact-cta';
import { Footer } from '@/components/footer';
import { Body, Display, Mono } from '@/components/typography';
import { projects, profile, services } from '@/constants/portfolio';
import { colors, spacing } from '@/constants/theme';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  // Size the hero so the longest name fits on one line, like the site's full-bleed h1.
  const longest = Math.max(profile.firstName.length, profile.lastName.length);
  const heroSize = Math.min(140, (width - spacing.gutter * 2) / (longest * 0.62));

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* nav */}
        <View style={styles.nav}>
          <Mono>P ✦ K</Mono>
          <Mono>Showcase Mode: ON</Mono>
        </View>

        {/* hero */}
        <View style={styles.section}>
          <Display size={heroSize} numberOfLines={1}>
            {profile.firstName}
          </Display>
          <Display size={heroSize} numberOfLines={1} style={styles.alignRight}>
            {profile.lastName}
          </Display>
        </View>
        <View style={styles.heroFooter}>
          <Image source={profile.symbols} style={styles.symbols} contentFit="contain" />
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(profile.resumeUrl)}
            hitSlop={8}
          >
            <Mono style={styles.underline}>Fetch // Resume</Mono>
          </Pressable>
        </View>
        <Image source={profile.heroImage} style={styles.heroImage} contentFit="cover" transition={300} />

        {/* about */}
        <View style={[styles.section, styles.about]}>
          <View>
            <Display size={56}>Hi, I'm</Display>
            <Display size={56} style={{ color: colors.accent1 }}>
              {profile.firstName}
            </Display>
          </View>
          <Image source={profile.portrait} style={styles.portrait} contentFit="cover" />
          <Body>{profile.bio}</Body>
          <Mono>{profile.tagline}</Mono>
        </View>

        {/* featured work */}
        <View style={styles.section}>
          <Display size={48}>Featured Projects</Display>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          snapToInterval={CARD_WIDTH + 12}
          decelerationRate="fast"
        >
          {projects.map((project, i) => (
            <View key={project.id} style={styles.card}>
              <Image source={project.image} style={styles.cardImage} contentFit="cover" />
              <Mono>{String(i + 1).padStart(2, '0')}</Mono>
              <Display size={28}>{project.title}</Display>
            </View>
          ))}
        </ScrollView>
        <View style={styles.row}>
          <Mono>Project Portfolio [ {projects.length} ]</Mono>
          <Link href="/work">
            <Mono style={styles.underline}>View All Projects</Mono>
          </Link>
        </View>

        {/* services */}
        <View style={[styles.section, styles.servicesHeader]}>
          <Image source={profile.portrait} style={styles.avatar} contentFit="cover" />
          <Body>Your Vision. My Expertise.</Body>
          <Display size={40} style={styles.center}>
            Full-stack development & Design Solutions
          </Display>
          <Display size={40}>↓</Display>
        </View>
        <View style={styles.services}>
          {services.map((service, i) => (
            <View key={service.title} style={[styles.service, { backgroundColor: SERVICE_BG[i] }]}>
              <Display size={36}>{service.title}</Display>
              <Image source={service.image} style={styles.serviceImage} contentFit="cover" />
            </View>
          ))}
        </View>

        <ContactCta />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_WIDTH = 260;
const SERVICE_BG = [colors.accent2, colors.accent3, colors.accent1, colors.bg2];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 0 },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingVertical: 16,
  },
  section: { paddingHorizontal: spacing.gutter, paddingTop: 24 },
  alignRight: { textAlign: 'right' },
  center: { textAlign: 'center' },
  underline: { textDecorationLine: 'underline' },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
    paddingVertical: 20,
  },
  symbols: { width: 120, height: 24 },
  heroImage: {
    marginHorizontal: spacing.gutter,
    height: 420,
    borderRadius: 16,
  },
  about: { gap: 20, paddingTop: 64 },
  portrait: { width: '100%', aspectRatio: 4 / 5, borderRadius: 16 },
  carousel: {
    paddingHorizontal: spacing.gutter,
    paddingVertical: 20,
    gap: 12,
  },
  card: { width: CARD_WIDTH, gap: 8 },
  cardImage: { width: CARD_WIDTH, height: CARD_WIDTH * 1.25, borderRadius: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.gutter,
  },
  servicesHeader: { alignItems: 'center', gap: 16, paddingTop: 80, paddingBottom: 32 },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  services: { paddingHorizontal: spacing.gutter, gap: 16 },
  service: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 3,
    borderColor: colors.fg,
  },
  serviceImage: { width: '100%', height: 180, borderRadius: 12 },
});
