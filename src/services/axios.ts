import axios from "axios";

export default axios.create({
  baseURL: "/api/v1", // Next.js proxy → backend рүү чиглүүлнэ
  withCredentials: true,
});