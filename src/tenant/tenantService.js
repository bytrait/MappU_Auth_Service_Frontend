import axios from "axios"
export async function fetchTenant() {
const res = await axios.get("/api/v1/tenant")
  console.log(res)
  if (res.statusText !== "OK") {
    throw new Error("Failed to load tenant")
  }
  

  return res.data
}