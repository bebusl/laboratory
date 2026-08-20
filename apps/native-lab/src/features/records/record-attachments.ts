import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

import { listAttachments, type AttachmentRecord } from '@/database/records';

export function useRecordAttachments(recordId: string) {
  const db = useSQLiteContext();
  const [attachments, setAttachments] = useState<AttachmentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(() => {
    let isMounted = true;

    setIsLoading(true);
    setError(null);

    listAttachments(db, recordId)
      .then(nextAttachments => {
        if (isMounted) {
          setAttachments(nextAttachments);
        }
      })
      .catch((cause: unknown) => {
        if (isMounted) {
          setError(cause instanceof Error ? cause : new Error('첨부파일을 불러오지 못했습니다.'));
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
  }, [db, recordId]);

  useEffect(() => {
    void Promise.resolve().then(() => reload());
  }, [reload]);

  return { attachments, error, isLoading, reload };
}
