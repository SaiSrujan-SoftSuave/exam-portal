import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://36412d22b62b.ngrok-free.app',
 headers: {
    "ngrok-skip-browser-warning": "true",
    "accept" : "application/json"
  }
});

const logApiCall = (endpoint: string, method: string, data?: any) => {
  console.log(`[API Call] ${method} ${endpoint}`, data ? { payload: data } : '');
};

export const apiGet = async <T>(endpoint: string): Promise<T> => {
  logApiCall(endpoint, 'GET');
  try {
    const response = await apiClient.get<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

export const apiPost = async <T>(endpoint: string, data: any): Promise<T> => {
  logApiCall(endpoint, 'POST', data);
  try {
    const response = await apiClient.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

export const getQuestions = async (size: number = 5) => {
  return apiGet<any>(`/first_round/questions?size=${size}`);
};

export const submitAnswers = async (submission: any) => {
  return apiPost<any>('/first_round/submit_answers', submission);
};

export const executeCode = async (code: string, language: string, test_cases: any[]) => {
  return apiPost<any>('/compiler/execute_code', { code, language, test_cases });
};

export const uploadImage = async (imageDataUrl: string): Promise<void> => {
  // The endpoint /api/upload-image is a placeholder.
  // Replace it with your actual backend endpoint for storing images.
  await apiPost('/api/upload-image', { image: imageDataUrl });
};