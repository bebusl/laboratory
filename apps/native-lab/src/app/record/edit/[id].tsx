import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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
import type { FieldRecord } from '@/database/records';

export default function EditRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { error, getRecord, isLoading } = useRecords();
  const record = getRecord(id);

  if (isLoading) {
    return <StatusScreen message="기록을 불러오는 중입니다." />;
  }

  if (error || !record) {
    return <StatusScreen message="수정할 기록을 찾을 수 없습니다." />;
  }

  return <EditRecordForm record={record} />;
}

function EditRecordForm({ record }: { record: FieldRecord }) {
  const router = useRouter();
  const { updateRecord } = useRecords();
  const [title, setTitle] = useState(record.title);
  const [memo, setMemo] = useState(record.memo);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isActiveRef = useRef(true);

  useEffect(() => {
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  const handleSave = async () => {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setFormError('기록 제목을 입력해 주세요.');
      return;
    }

    setIsSaving(true);

    try {
      await updateRecord({
        ...record,
        title: normalizedTitle,
        memo: memo.trim(),
        updatedAt: new Date().toISOString(),
      });
      if (!isActiveRef.current) return;
      router.back();
    } catch {
      if (!isActiveRef.current) return;
      setFormError('기록을 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSaving(false);
    }
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
              accessibilityLabel="기록 수정 취소"
              disabled={isSaving}
              onPress={() => router.back()}
              style={[styles.backButton, isSaving && styles.disabledButton]}
            >
              <Text style={styles.backLabel}>‹ 상세</Text>
            </Pressable>
            <Text style={styles.title}>기록 수정</Text>
            <Text style={styles.description}>변경한 내용을 저장하면 수정 시각이 갱신됩니다.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>제목</Text>
              <TextInput
                accessibilityLabel="기록 제목"
                onChangeText={value => {
                  setTitle(value);
                  setFormError(null);
                }}
                placeholder="기록 제목"
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
                placeholder="현장 메모"
                placeholderTextColor="#9aa5b4"
                style={[styles.input, styles.memoInput]}
                textAlignVertical="top"
                value={memo}
              />
            </View>

            {formError ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {formError}
              </Text>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="기록 수정 저장"
              disabled={isSaving}
              onPress={handleSave}
              style={({ pressed }) => [
                styles.saveButton,
                isSaving && styles.disabledButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.saveLabel}>{isSaving ? '저장 중…' : '수정 저장'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function StatusScreen({ message }: { message: string }) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centered}>
        <Text style={styles.description}>{message}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="기록 목록으로 돌아가기"
          onPress={() => router.replace('/')}
          style={styles.saveButton}
        >
          <Text style={styles.saveLabel}>목록으로 돌아가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f9' },
  flex: { flex: 1 },
  content: { padding: 24, gap: 32 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  header: { gap: 8 },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
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
  disabledButton: { opacity: 0.55 },
  pressed: { opacity: 0.72 },
});
