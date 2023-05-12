import axios from "axios";

export async function fetchData(endpoint: string) {
  const res = await axios(endpoint);

  return await res.data;
}
