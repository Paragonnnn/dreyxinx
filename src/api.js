import axios from "axios";

const api = axios.create({
    baseURL: "https://dreyxink-server.onrender.com/api",
    // baseURL: "http://localhost:2007/api",
    headers: {
        "Content-Type": "application/json",
    }
})

export default api;