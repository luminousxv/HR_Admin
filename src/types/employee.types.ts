// HR_Admin/src/types/employee.types.ts

import { Salary } from "./salary.types";
import { EmploymentStatus, EmploymentType } from "./enums";

// 백엔드의 user.entity.ts > UserRole 참고
export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

// 백엔드의 user.entity.ts 참고
export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: string;
  updatedAt: string;
}

// 백엔드의 employee.entity.ts 참고
export interface Employee {
  id: string;
  employeeNumber: string; // 사번
  name: string;
  user: User;
  joinDate: string;
  residentRegistrationNumber: string; // 주민등록번호 (민감정보)
  phoneNumber: string;
  department: string;
  position: string;
  employmentType: EmploymentType;
  bankName: string;
  bankAccountNumber: string;
  userId: string;
  resignationDate: string | null;
  status: EmploymentStatus;
  createdAt: Date;
  updatedAt: Date;
  salary?: Salary;
}

export interface CreateUserDto {
  email: string;
  password?: string;
}

export type CreateEmployeeDto = Omit<
  Employee,
  "id" | "user" | "createdAt" | "updatedAt" | "salary"
> & {
  userId: string;
  baseSalary?: number;
  effectiveDate?: string;
};

export type UpdateEmployeeDto = Partial<Omit<CreateEmployeeDto, "userId">>;
