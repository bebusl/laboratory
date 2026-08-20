export type AttachmentKind = 'image' | 'document';

export interface AttachmentSource {
  uri: string;
  name: string;
  kind: AttachmentKind;
  mimeType: string | null;
  size: number | null;
  extension: string | null;
}

export interface StoredAttachment extends AttachmentSource {
  uri: string;
}
