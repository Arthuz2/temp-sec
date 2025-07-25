import api from "../api";

export async function getAllTemperature() {
  const response = await api.get('/temperatura/historico');
  return response.data;
}
