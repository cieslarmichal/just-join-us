import { config } from '../../config';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${config.backendUrl}/images`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();

    return data.url;
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}
