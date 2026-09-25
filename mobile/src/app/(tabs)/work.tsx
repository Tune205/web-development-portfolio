import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Display, Mono } from '@/components/typography';
import { projects } from '@/constants/portfolio';
import { colors, spacing } from '@/constants/theme';

const GITHUB = 'https://github.com/prashantkoirala465';

export default function WorkScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Mono>Project Portfolio [ {projects.length} ]</Mono>
            <Display size={64}>Selected Work</Display>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Image source={item.image} style={styles.image} contentFit="cover" transition={200} />
            <View style={styles.caption}>
              <Display size={32} style={styles.title}>
                {item.title}
              </Display>
              <Mono>{String(index + 1).padStart(2, '0')}</Mono>
            </View>
          </View>
        )}
        ListFooterComponent={
          <Pressable
            accessibilityRole="link"
            onPress={() => Linking.openURL(GITHUB)}
            style={({ pressed }) => [styles.more, pressed && { opacity: 0.6 }]}
          >
            <Mono style={{ color: colors.bg }}>More on Github ↗</Mono>
          </Pressable>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.gutter, gap: 32 },
  header: { gap: 8, paddingTop: 16 },
  item: { gap: 12 },
  image: { width: '100%', aspectRatio: 4 / 3, borderRadius: 16 },
  caption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: colors.fg,
    paddingBottom: 12,
  },
  title: { flexShrink: 1 },
  more: {
    alignSelf: 'center',
    backgroundColor: colors.fg,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
    marginBottom: 24,
  },
});
