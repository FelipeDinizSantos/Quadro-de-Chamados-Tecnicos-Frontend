const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = (path: string) => `${API_URL}${path}`;