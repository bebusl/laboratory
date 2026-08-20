import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

export interface FieldRecord {
  id: string;
  title: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

interface RecordContextValue {
  records: FieldRecord[];
  createRecord: (input: Pick<FieldRecord, 'title' | 'memo'>) => FieldRecord;
  getRecord: (id: string) => FieldRecord | undefined;
}

const RecordContext = createContext<RecordContextValue | null>(null);

export function RecordProvider({ children }: PropsWithChildren) {
  const [records, setRecords] = useState<FieldRecord[]>([]);

  const value = useMemo<RecordContextValue>(
    () => ({
      records,
      createRecord: ({ title, memo }) => {
        const now = new Date().toISOString();
        const record: FieldRecord = {
          id: `${Date.now()}`,
          title,
          memo,
          createdAt: now,
          updatedAt: now,
        };

        setRecords(current => [record, ...current]);
        return record;
      },
      getRecord: id => records.find(record => record.id === id),
    }),
    [records]
  );

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
}

export function useRecords() {
  const context = useContext(RecordContext);

  if (!context) {
    throw new Error('useRecords must be used inside RecordProvider');
  }

  return context;
}
