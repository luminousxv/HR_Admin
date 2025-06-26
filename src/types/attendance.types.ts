import { Employee } from "./employee.types";

export interface Attendance {
  id: string;
  clockInTime: string;
  clockOutTime: string | null;
  notes: string | null;
  employee: Pick<Employee, "id" | "name" | "department" | "position"> & {
    user: {
      email: string;
    };
  };
}
