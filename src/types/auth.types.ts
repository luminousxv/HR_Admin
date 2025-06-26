export interface LoginRequest {
  email: string;
  password?: string; // 비밀번호는 요청 시에만 필요
}

export interface LoginResponse {
  access_token: string;
}
