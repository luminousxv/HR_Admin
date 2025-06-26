import { Employee } from "./employee.types";

export enum LeaveType {
  ANNUAL_LEAVE = "ANNUAL_LEAVE", // 연차
  SICK_LEAVE = "SICK_LEAVE", // 병가
  BEREAVEMENT_LEAVE = "BEREAVEMENT_LEAVE", // 경조사 휴가
  OTHER = "OTHER", // 기타
}

export enum LeaveRequestStatus {
  PENDING = "PENDING", // 대기중
  APPROVED = "APPROVED", // 승인
  REJECTED = "REJECTED", // 반려
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveRequestStatus;
  leaveType: LeaveType;
  employee: Pick<Employee, "id" | "name" | "department" | "position">;
  createdAt: string;
  updatedAt: string;
}

export type UpdateLeaveStatusDto = {
  status: LeaveRequestStatus;
};
