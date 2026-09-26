import type { UploadedFile } from './data.ts'
export const MAX_FILE_BYTES = 20 * 1024 * 1024
export const MAX_PAPERS = 24
export async function validateFiles(incoming: File[], existing: UploadedFile[]) {
 const accepted: UploadedFile[] = []
 const errors: string[] = []
 for (const file of incoming) {
  if (!file.name.toLowerCase().endsWith('.pdf')) { errors.push(`${file.name}: please choose a PDF file.`); continue }
  if (file.size > MAX_FILE_BYTES) { errors.push(`${file.name}: exceeds the 20 MB limit.`); continue }
  if (!file.size) { errors.push(`${file.name}: this file is empty.`); continue }
  if ([...existing, ...accepted].some(f => f.name === file.name && f.size === file.size)) { errors.push(`${file.name}: already added.`); continue }
  if (existing.length + accepted.length >= MAX_PAPERS) { errors.push('This prototype supports up to 24 papers per collection.'); break }
  try {
   if (await file.slice(0, 5).text() !== '%PDF-') { errors.push(`${file.name}: this does not appear to be a valid PDF.`); continue }
   accepted.push({ id: crypto.randomUUID(), name: file.name, size: file.size, lastModified: file.lastModified })
  } catch { errors.push(`${file.name}: we couldn’t read this file. Please try adding it again.`) }
 }
 return { files: [...existing, ...accepted], errors }
}
