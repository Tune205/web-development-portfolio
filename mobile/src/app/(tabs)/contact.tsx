import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Body, Display, Mono } from '@/components/typography';
import { profile, projectTypes } from '@/constants/portfolio';
import { colors, fonts, spacing } from '@/constants/theme';

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
};

const EMPTY: Form = { firstName: '', lastName: '', email: '', phone: '', projectType: '', message: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: Form) {
  const errors: Partial<Record<keyof Form, string>> = {};
  if (!form.firstName.trim()) errors.firstName = 'Required';
  if (!form.lastName.trim()) errors.lastName = 'Required';
  if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email';
  if (!form.projectType) errors.projectType = 'Pick one';
  if (!form.message.trim()) errors.message = 'Required';
  return errors;
}

export default function ContactScreen() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof Form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }

    // No backend: hand the message off to the user's mail app.
    const subject = `${form.projectType} inquiry from ${form.firstName} ${form.lastName}`;
    const body = [
      form.message,
      '',
      `— ${form.firstName} ${form.lastName}`,
      form.email,
      form.phone,
    ]
      .filter((line, i) => i < 3 || line)
      .join('\n');
    const url = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    await Linking.openURL(url);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setSent(true);
    setForm(EMPTY);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Display size={64}>Let's Connect</Display>
          <Body>
            Got a project idea? Need a stunning website or a robust app? Or just want to geek out
            over code and design? I'm all in. Drop me a line, and let's create something
            extraordinary together.
          </Body>

          <View style={styles.infoRow}>
            <InfoItem label="Project Inquiries" value={profile.email} url={`mailto:${profile.email}`} />
            <InfoItem label="Quick Chat" value="@arkynox_" url="https://x.com/arkynox_" />
          </View>

          <View style={styles.card}>
            <Display size={36}>Start a Project</Display>
            <Body size={16} style={styles.muted}>
              Tell me about your vision and let's make it reality
            </Body>

            {sent ? (
              <View style={styles.success}>
                <Mono>Message ready ✦</Mono>
                <Body size={16}>
                  Your mail app should have opened with the details filled in. Hit send there and
                  I'll get back to you soon.
                </Body>
                <Pressable onPress={() => setSent(false)} hitSlop={8}>
                  <Mono style={styles.link}>Write another</Mono>
                </Pressable>
              </View>
            ) : (
              <>
                <View style={styles.row}>
                  <Field
                    half
                    label="First Name"
                    value={form.firstName}
                    onChangeText={set('firstName')}
                    error={errors.firstName}
                    autoComplete="given-name"
                    textContentType="givenName"
                  />
                  <Field
                    half
                    label="Last Name"
                    value={form.lastName}
                    onChangeText={set('lastName')}
                    error={errors.lastName}
                    autoComplete="family-name"
                    textContentType="familyName"
                  />
                </View>
                <Field
                  label="Email Address"
                  placeholder="your@email.com"
                  value={form.email}
                  onChangeText={set('email')}
                  error={errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
                <Field
                  label="Phone Number (optional)"
                  value={form.phone}
                  onChangeText={set('phone')}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                />

                <View style={styles.field}>
                  <Mono size={11}>Project Type</Mono>
                  <View style={styles.chips}>
                    {projectTypes.map((type) => {
                      const selected = form.projectType === type;
                      return (
                        <Pressable
                          key={type}
                          accessibilityRole="radio"
                          accessibilityState={{ selected }}
                          onPress={() => {
                            Haptics.selectionAsync().catch(() => {});
                            set('projectType')(type);
                          }}
                          style={[styles.chip, selected && styles.chipSelected]}
                        >
                          <Body size={15} style={selected && { color: colors.bg }}>
                            {type}
                          </Body>
                        </Pressable>
                      );
                    })}
                  </View>
                  {errors.projectType && <Mono size={11} style={styles.error}>{errors.projectType}</Mono>}
                </View>

                <Field
                  label="Project Details"
                  placeholder="Tell me about your project, goals, timeline, and budget..."
                  value={form.message}
                  onChangeText={set('message')}
                  error={errors.message}
                  multiline
                  style={styles.textarea}
                />

                <Pressable
                  accessibilityRole="button"
                  onPress={submit}
                  style={({ pressed }) => [styles.submit, pressed && { opacity: 0.8 }]}
                >
                  <Mono style={{ color: colors.bg }}>Send Message →</Mono>
                </Pressable>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InfoItem({ label, value, url }: { label: string; value: string; url: string }) {
  return (
    <Pressable accessibilityRole="link" onPress={() => Linking.openURL(url)} style={styles.info}>
      <Mono size={11} style={styles.muted}>
        {label}
      </Mono>
      <Body size={17} style={styles.link} numberOfLines={1}>
        {value}
      </Body>
    </Pressable>
  );
}

function Field({
  label,
  error,
  half,
  style,
  ...input
}: TextInputProps & { label: string; error?: string; half?: boolean }) {
  return (
    <View style={[styles.field, half && styles.flex]}>
      <Mono size={11}>{label}</Mono>
      <TextInput
        placeholderTextColor="#14141466"
        {...input}
        style={[styles.input, error && styles.inputError, style]}
      />
      {error && <Mono size={11} style={styles.error}>{error}</Mono>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: { padding: spacing.gutter, paddingTop: 32, gap: 20, paddingBottom: 48 },
  muted: { opacity: 0.6 },
  link: { textDecorationLine: 'underline' },
  infoRow: { gap: 16 },
  info: { gap: 4 },
  card: {
    backgroundColor: colors.bg2,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    marginTop: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  field: { gap: 6 },
  input: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.fg,
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: { borderColor: colors.accent1 },
  error: { color: colors.accent1 },
  textarea: { minHeight: 140, textAlignVertical: 'top' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 2,
    borderColor: colors.fg,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: colors.fg },
  submit: {
    backgroundColor: colors.fg,
    borderRadius: 999,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  success: { gap: 12, paddingVertical: 8 },
});
