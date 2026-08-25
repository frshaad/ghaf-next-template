import type { Metadata } from 'next';

type CreateMetadataOptions = {
  title?: Metadata['title'];
  description?: Metadata['description'];
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description,
  noIndex = false,
}: CreateMetadataOptions): Metadata {
  return {
    title,
    description,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
