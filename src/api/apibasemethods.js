import axios from "axios";
import { APP_API } from "src/config-global";

const apiHandle = axios.create({
  baseURL: APP_API,
});

const Get = (endPoint) => apiHandle.get(endPoint);

const GetById = (endPoint, id) => apiHandle.get(`${endPoint}/${id}`);

const Post = (endPoint, body) =>  apiHandle.post(endPoint, body);

const Put = (endPoint, body) => apiHandle.put(endPoint, body);

const Delete = (endPoint) => apiHandle.delete(endPoint);


export { Get, Put, Post, Delete, GetById };