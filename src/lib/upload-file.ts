import { supabase } from "@/lib/supabaseClient";

export const uploadFileWithProgress = async (
  file: File,
  bucket: string,
  path: string,
  onProgress: (progress: number) => void,
): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = `${path}/${fileName}`;

  // Simulate progress (because Supabase JS SDK doesn't provide it)
  let progress = 0;
  if (onProgress) {
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 90) progress = 90;
      onProgress(progress);
    }, 200);

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      clearInterval(interval);
      onProgress && onProgress(100);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    } catch (err) {
      clearInterval(interval);
      throw err;
    }
  } else {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    return urlData.publicUrl;
  }
};
