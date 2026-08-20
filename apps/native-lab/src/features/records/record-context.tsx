import { useSQLiteContext } from 'expo-sqlite';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import {
  insertRecord,
  listRecords,
  removeRecord,
  updateRecord as persistRecordUpdate,
  type FieldRecord,
} from '@/database/records';

interface RecordContextValue {
  records: FieldRecord[];
  isLoading: boolean;
  error: Error | null;
  createRecord: (input: Pick<FieldRecord, 'title' | 'memo'>) => Promise<FieldRecord>;
  getRecord: (id: string) => FieldRecord | undefined;
  updateRecord: (record: FieldRecord) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  retry: () => void;
}

const RecordContext = createContext<RecordContextValue | null>(null);

export function RecordProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [records, setRecords] = useState<FieldRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isMounted = true;

    listRecords(db)
      .then(nextRecords => {
        if (isMounted) {
          setRecords(nextRecords);
        }
      })
      .catch((cause: unknown) => {
        if (isMounted) {
          setError(toError(cause));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [db, reloadToken]);

  const value = useMemo<RecordContextValue>(
    () => ({
      records,
      isLoading,
      error,
      createRecord: async ({ title, memo }) => {
        const now = new Date().toISOString();
        const record: FieldRecord = {
          id: createRecordId(),
          title,
          memo,
          createdAt: now,
          updatedAt: now,
        };

        await insertRecord(db, record);
        setRecords(current => [record, ...current]);
        return record;
      },
      getRecord: id => records.find(record => record.id === id),
      updateRecord: async record => {
        await persistRecordUpdate(db, record);
        setRecords(current =>
          current.map(currentRecord => (currentRecord.id === record.id ? record : currentRecord))
        );
      },
      deleteRecord: async id => {
        await removeRecord(db, id);
        setRecords(current => current.filter(record => record.id !== id));
      },
      retry: () => {
        setError(null);
        setIsLoading(true);
        setReloadToken(current => current + 1);
      },
    }),
    [db, error, isLoading, records]
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

function createRecordId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function toError(cause: unknown) {
  return cause instanceof Error ? cause : new Error('SQLite 기록을 불러오지 못했습니다.');
}
