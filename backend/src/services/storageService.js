import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { STORAGE_BUCKETS } from '../config/database.js';
import { AppError } from '../utils/AppError.js';

const KNOWN_BUCKETS = [env.storageBucket, STORAGE_BUCKETS.RESUMES_LEGACY];

export function extractPathFromUrl(resumeUrl) {
  try {
    const url = new URL(resumeUrl);
    for (const bucket of KNOWN_BUCKETS) {
      const marker = `/object/public/${bucket}/`;
      const idx = url.pathname.indexOf(marker);
      if (idx !== -1) {
        return { bucket, filePath: url.pathname.slice(idx + marker.length) };
      }
    }
    return null;
  } catch {
    return null;
  }
}

function resolveBucket(explicitBucket) {
  return explicitBucket && KNOWN_BUCKETS.includes(explicitBucket)
    ? explicitBucket
    : env.storageBucket;
}

export async function uploadResume(file, templateId) {
  const filePath = `${templateId}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from(env.storageBucket)
    .upload(filePath, file.buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (error) {
    throw new AppError(`Failed to upload resume: ${error.message}`, 500);
  }

  const { data } = supabase.storage.from(env.storageBucket).getPublicUrl(filePath);

  return {
    resumeUrl: data.publicUrl,
    resumePath: filePath,
    resumeName: file.originalname,
  };
}

export async function deleteResume(resumePath, bucket) {
  if (!resumePath) return;

  const targetBucket = resolveBucket(bucket);
  const { error } = await supabase.storage.from(targetBucket).remove([resumePath]);

  if (error) {
    console.warn(`[storage] Failed to delete from ${targetBucket}:`, error.message);
  }
}

/**
 * Resolves the recipient-facing attachment filename.
 * Storage paths use unique names ({timestamp}-{original}.pdf); resume_name holds the original.
 */
export function resolveAttachmentFileName(storagePath, resumeName) {
  if (resumeName?.trim()) return resumeName.trim();

  const stored = storagePath.split('/').pop() || 'resume.pdf';
  const withoutTimestamp = stored.replace(/^\d+-/, '');
  return withoutTimestamp || stored;
}

export async function downloadResume(resumeUrl, resumeName) {
  const parsed = extractPathFromUrl(resumeUrl);

  if (!parsed?.filePath) {
    throw new AppError('Invalid resume URL', 400);
  }

  const { data, error } = await supabase.storage
    .from(resolveBucket(parsed.bucket))
    .download(parsed.filePath);

  if (error || !data) {
    throw new AppError(`Failed to download resume: ${error?.message}`, 500);
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  const fileName = resolveAttachmentFileName(parsed.filePath, resumeName);

  return { buffer, fileName };
}
