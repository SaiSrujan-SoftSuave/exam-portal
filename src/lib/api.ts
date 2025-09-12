const logApiCall = (endpoint: string, method: string, data?: any) => {
  console.log(`[API Call] ${method} ${endpoint}`, data ? { payload: data } : '');
};

export const apiPost = async <T>(endpoint: string, data: any): Promise<T> => {
  logApiCall(endpoint, 'POST', data);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

export const uploadImage = async (imageDataUrl: string): Promise<void> => {
  // The endpoint /api/upload-image is a placeholder.
  // Replace it with your actual backend endpoint for storing images.
  await apiPost('/api/upload-image', { image: imageDataUrl });
};
