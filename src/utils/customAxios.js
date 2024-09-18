import axios from "axios"
import { getCookie } from "./storage";

const baseURL = `http:///localhost:8080`;
export const customAxios = axios.create({
  baseURL: baseURL, // 기본 서버 주소 입력
});

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJsZXZlbCI6MCwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJzZXFsIjoxLCJleHAiOjE3MDgyMzg4NDZ9.c6UpI8HAvMxUqMHnCgeBXJ7uYSig4m1DVJ87EQg6yGc';

const headers = {
  'Content-Type' : 'application/json',
  'Authorization' : 'Bearer ' + token//getCookie("token")
}
// const headers = {}


export const api = {
  get: (url, params) => customAxios.get(url, {
    params : params,
    headers : headers
  })
    .then(response => response)
    .catch(error => {
      // 개별 에러 처리
      console.error(`GET request failed for ${url}`, error);
      // throw error;
    }),

  post: (url, data) => customAxios.post(url,data,{headers})
    .then(response => response)
    .catch(error => {
      // 개별 에러 처리
      console.error(`POST request failed for ${url}`, error);
      throw error;
    }),

  put: (url, data) => customAxios.put(url, data)
    .then(response => response)
    .catch(error => {
      // 개별 에러 처리
      console.error(`PUT request failed for ${url}`, error);
      throw error;
    }),

  delete: (url) => customAxios.delete(url,{headers})
    .then(response => response)
    .catch(error => {
      // 개별 에러 처리
      console.error(`DELETE request failed for ${url}`, error);
      throw error;
    }),
};

//커스텀 axios가 발생할때마다 request를 interceptor 해서 토큰을 먼저 검증한다.
// customAxios.interceptors.request.use(verifyToken,
//   function (error) {
//   return Promise.reject(error);
// });

