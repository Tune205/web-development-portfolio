import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, fonts } from '@/constants/theme';

type Props = TextProps & { size?: number };

// h1/h2/h3 on the site: uppercase italic Rader.
export function Display({ size = 64, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[styles.display, { fontSize: size, lineHeight: size * 0.95 }, style]}
    />
  );
}

// p / p.ss on the site: Formula Narrow semibold.
export function Body({ size = 20, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[styles.body, { fontSize: size, lineHeight: size * 1.125 }, style]}
    />
  );
}

// p.mn on the site: uppercase Supply Mono.
export function Mono({ size = 13, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[styles.mono, { fontSize: size, lineHeight: size * 1.25 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  display: {
    fontFamily: fonts.display,
    textTransform: 'uppercase',
    color: colors.fg,
    // Rader's italic glyphs overhang their advance width.
    paddingRight: 4,
  },
  body: {
    fontFamily: fonts.body,
    color: colors.fg,
  },
  mono: {
    fontFamily: fonts.mono,
    textTransform: 'uppercase',
    color: colors.fg,
  },
});
