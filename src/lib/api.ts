import {
  CreateEmployeeDto,
  CreateUserDto,
  Employee,
  UpdateEmployeeDto,
} from "@/types/employee.types";
import { LoginRequest, LoginResponse } from "@/types/auth.types";
import axios from "axios";
import { User } from "@/types/user.types";
import { Attendance } from "@/types/attendance.types";
import { LeaveRequest, UpdateLeaveStatusDto } from "@/types/leave.types";
import { Payroll, UpsertSalaryDto } from "@/types/payroll.types";
import { Salary } from "@/types/salary.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

/**
 * 요청 인터셉터 (Request Interceptor)
 * - 모든 API 요청이 전송되기 전에 특정 작업을 수행합니다.
 * - 예: 요청 헤더에 인증 토큰 추가
 */
api.interceptors.request.use(
  (config) => {
    // 코드가 실행되는 환경이 브라우저(클라이언트)인지 확인합니다.
    if (typeof window !== "undefined") {
      // 브라우저 환경일 경우에만 localStorage에서 토큰을 가져옵니다.
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // 서버 환경에서는 쿠키가 자동으로 전송되므로 별도의 처리를 하지 않습니다.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// --- API 함수들 ---

/**
 * 모든 직원 목록을 조회하는 API 함수
 * @returns {Promise<Employee[]>} 직원 목록
 */
export const getEmployees = async (): Promise<Employee[]> => {
  const response = await api.get<Employee[]>("/employees");
  return response.data;
};

/**
 * 로그인 API 함수
 * @param {LoginRequest} credentials - 이메일, 비밀번호
 * @returns {Promise<LoginResponse>} 로그인 응답 (access_token 포함)
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", data);
  return response.data;
};

/**
 * 신규 사용자를 생성하는 API 함수
 * @param {CreateUserDto} userData - 이메일, 비밀번호
 * @returns {Promise<User>} 생성된 사용자 정보
 */
export const createUser = async (data: CreateUserDto): Promise<User> => {
  const response = await api.post<User>("/users", data);
  return response.data;
};

/**
 * 신규 직원을 생성하는 API 함수
 * @param {CreateEmployeeDto} employeeData - 신규 직원 정보
 * @returns {Promise<Employee>} 생성된 직원 정보
 */
export const createEmployee = async (
  data: CreateEmployeeDto
): Promise<Employee> => {
  const response = await api.post<Employee>("/employees", data);
  return response.data;
};

/**
 * 특정 ID의 직원을 삭제하는 API 함수
 * @param {string} employeeId - 삭제할 직원의 ID
 * @returns {Promise<void>}
 */
export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/${id}`);
};

/**
 * 특정 ID의 직원 정보를 조회하는 API 함수
 * @param {string} employeeId - 조회할 직원의 ID
 * @returns {Promise<Employee>} 직원 정보
 */
export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await api.get<Employee>(`/employees/${id}`);
  return response.data;
};

/**
 * 특정 ID의 직원 정보를 수정하는 API 함수
 * @param {string} employeeId - 수정할 직원의 ID
 * @param {Partial<CreateEmployeeDto>} employeeData - 수정할 직원 정보
 * @returns {Promise<Employee>} 수정된 직원 정보
 */
export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDto
): Promise<Employee> => {
  const response = await api.patch<Employee>(`/employees/${id}`, data);
  return response.data;
};

/**
 * 모든 직원의 근태 기록을 조회하는 API 함수 (관리자용)
 * @param {number} year - 조회할 연도
 * @param {number} month - 조회할 월
 * @returns {Promise<Attendance[]>} 근태 기록 목록
 */
export const getAttendances = async (
  year: number,
  month: number
): Promise<Attendance[]> => {
  const response = await api.get<Attendance[]>("/attendances", {
    params: { year, month },
  });
  return response.data;
};

/**
 * 모든 휴가 신청 목록을 조회하는 API 함수 (관리자용)
 * @returns {Promise<LeaveRequest[]>} 휴가 신청 목록
 */
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const response = await api.get<LeaveRequest[]>("/leaves/admin/all");
  return response.data;
};

/**
 * 휴가 신청 상태를 변경하는 API 함수 (관리자용)
 * @param {string} leaveId - 처리할 휴가 신청의 ID
 * @param {UpdateLeaveStatusDto} data - 변경할 상태 정보
 * @returns {Promise<LeaveRequest>} 업데이트된 휴가 신청 정보
 */
export const updateLeaveRequestStatus = async (
  id: string,
  dto: UpdateLeaveStatusDto
): Promise<LeaveRequest> => {
  const response = await api.patch<LeaveRequest>(`/leaves/${id}/status`, dto);
  return response.data;
};

// Payrolls
export const getPayrolls = async (
  year: number,
  month: number
): Promise<Payroll[]> => {
  const response = await api.get<Payroll[]>("/payrolls", {
    params: { year, month },
  });
  return response.data;
};

export const getPayrollById = async (id: string): Promise<Payroll> => {
  const response = await api.get<Payroll>(`/payrolls/${id}`);
  return response.data;
};

export const upsertSalary = async (
  employeeId: string,
  data: UpsertSalaryDto
): Promise<Salary> => {
  const response = await api.post<Salary>(
    `/payrolls/salaries/${employeeId}`,
    data
  );
  return response.data;
};

export const generatePayrolls = async (
  year: number,
  month: number
): Promise<{ count: number }> => {
  const response = await api.post<{ count: number }>("/payrolls/generate", {
    year,
    month,
  });
  return response.data;
};

export const deletePayrollsByMonth = async (
  year: number,
  month: number
): Promise<{ deletedCount: number }> => {
  const response = await api.delete<{ deletedCount: number }>("/payrolls", {
    params: { year, month },
  });
  return response.data;
};
