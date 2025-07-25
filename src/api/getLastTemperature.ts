import api from "../api";

export async function getLastTemperature() {
  const response = await api.get("/temperatura/ultima");
  return response.data;
}
