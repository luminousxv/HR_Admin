import { Employee } from "@/types/employee.types";
import Link from "next/link";
import { Button } from "../ui/button";

interface EmployeeTableProps {
  employees: Employee[];
  onDelete: (employeeId: string) => void;
}

export default function EmployeeTable({
  employees,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              사번
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              이름
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              이메일
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              부서
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              직위
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              입사일
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.employeeNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {employee.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(employee.joinDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 space-x-2 whitespace-nowrap">
                <Link href={`/dashboard/employees/${employee.id}/edit`}>
                  <Button variant="outline" size="sm">
                    수정
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(employee.id)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
