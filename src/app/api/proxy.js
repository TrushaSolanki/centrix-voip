// proxy.js
import axios from "axios";
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
import { getItem } from "../../lib/localStorage";
export default async function handler(req, res) {
  const { method, body } = req;
  const apiUrl = `${API_ENDPOINT}${req.url}`;
  const session = getItem("accessToken") ? getItem("accessToken") : "";

  try {
    // Prepare the default headers
    const defaultHeaders = {
      Authorization: `Bearer ${session}`,
      "Content-Type": "application/json",
      ...req.headers,
    };

    // Make the request to the backend API using Axios
    const axiosResponse = await axios({
      url: apiUrl,
      method: method,
      headers: defaultHeaders,
      data: method !== "GET" ? body : undefined, // Pass body only for non-GET requests
    });
    // Forward the backend response headers and status to the client
    Object.entries(axiosResponse.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Send the response data back to the client
    res.status(axiosResponse.status).send(axiosResponse.data);
  } catch (error) {
    // Handle errors gracefully
    console.error("Proxy error:", error.response?.data || error.message);

    // Return the error response
    res.status(error.response?.status || 500).json({
      message: "Proxy error",
      error: error.response?.data || error.message,
    });
  }
}
