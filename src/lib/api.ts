import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 쿠키 전송을 위한 설정
});

/**
 * 요청 인터셉터 (Request Interceptor)
 * - 모든 API 요청이 전송되기 전에 특정 작업을 수행합니다.
 * - 예: 요청 헤더에 인증 토큰 추가
 */
// api.interceptors.request.use(
//   (config) => {
//     // 여기서 토큰을 가져와 헤더에 추가할 수 있습니다.
//     // const token = localStorage.getItem('accessToken');
//     // if (token) {
//     //   config.headers['Authorization'] = `Bearer ${token}`;
//     // }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

/**
 * 응답 인터셉터 (Response Interceptor)
 * - API 응답을 받은 후 특정 작업을 수행합니다.
 * - 예: 토큰 만료 시 재발급 처리, 전역 에러 핸들링
 */
// api.interceptors.response.use(
//   (response) => {
//     // 2xx 범위의 상태 코드에 대한 응답 처리
//     return response;
//   },
//   (error) => {
//     // 2xx 범위를 벗어나는 상태 코드에 대한 응답 처리
//     // 예: 401 Unauthorized 에러 시 로그인 페이지로 리디렉션
//     // if (error.response && error.response.status === 401) {
//     //   window.location.href = '/login';
//     // }
//     return Promise.reject(error);
//   }
// );

export default api;
