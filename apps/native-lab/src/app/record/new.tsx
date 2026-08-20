import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecords } from '@/features/records/record-context';

export default function NewRecordScreen() {
  const router = useRouter();
  const { createRecord } = useRecords();
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError('기록 제목을 입력해 주세요.');
      return;
    }

    const record = createRecord({ title: normalizedTitle, memo: memo.trim() });
    router.replace({ pathname: '/record/[id]', params: { id: record.id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="기록 작성 취소"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backLabel}>‹ 목록</Text>
            </Pressable>
            <Text style={styles.title}>새 기록</Text>
            <Text style={styles.description}>현장에서 확인한 내용을 간단히 남겨 보세요.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>제목</Text>
              <TextInput
                accessibilityLabel="기록 제목"
                autoFocus
                onChangeText={value => {
                  setTitle(value);
                  setError(null);
                }}
                placeholder="예: 1층 배관 점검"
                placeholderTextColor="#9aa5b4"
                style={styles.input}
                value={title}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>메모</Text>
              <TextInput
                accessibilityLabel="기록 메모"
                multiline
                onChangeText={setMemo}
                placeholder="현장 상황이나 다음 작업을 적어 주세요."
                placeholderTextColor="#9aa5b4"
                style={[styles.input, styles.memoInput]}
                textAlignVertical="top"
                value={memo}
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="기록 저장"
              onPress={handleSave}
              style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
            >
              <Text style={styles.saveLabel}>기록 저장</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f9' },
  flex: { flex: 1 },
  content: { padding: 24, gap: 32 },
  header: { gap: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 4 },
  backLabel: { color: '#1769e0', fontSize: 15, fontWeight: '600' },
  title: { color: '#17202d', fontSize: 32, fontWeight: '700' },
  description: { color: '#637083', fontSize: 15, lineHeight: 22 },
  form: { gap: 22 },
  field: { gap: 8 },
  label: { color: '#17202d', fontSize: 14, fontWeight: '700' },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d9e0e8',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    color: '#17202d',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  memoInput: { minHeight: 160 },
  error: { color: '#b42318', fontSize: 14, lineHeight: 20 },
  saveButton: {
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1769e0',
    paddingVertical: 15,
  },
  saveLabel: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.72 },
});
