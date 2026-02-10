import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${baseURL}/api/v1`, 
});


export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: string;
  latitude: number;
  longitude: number;
  depth: number;
  url: string;

  detail?: string;
  status?: string;
  tsunami?: number;
  sig?: number;
}

export const getEarthquakes = async (): Promise<Earthquake[]> => {
  const response = await api.get<Earthquake[]>('/earthquakes/');
  return response.data;
};

export interface SyncResponse {
  status: string;
  new: number;
  updated: number;
}

export const syncEarthquakes = async (): Promise<SyncResponse> => {
  const response = await api.post<SyncResponse>('/earthquakes/sync');
  return response.data;
};