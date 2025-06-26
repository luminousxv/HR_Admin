"use client";

import { useEffect, useMemo, useState } from "react";
import EmployeeTable from "@/components/employees/EmployeeTable";
import { getEmployees, deleteEmployee } from "@/lib/api";
import { Employee } from "@/types/employee.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS } from "@/lib/constants";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지에 10명씩

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const data = await getEmployees();
        setEmployees(data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((employee) =>
        departmentFilter === "all"
          ? true
          : employee.department === departmentFilter
      );
  }, [employees, searchTerm, departmentFilter]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (employeeId: string) => {
    if (window.confirm("정말로 이 직원을 삭제하시겠습니까?")) {
      try {
        await deleteEmployee(employeeId);
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== employeeId)
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "직원 삭제 중 오류가 발생했습니다.";
        setError(errorMessage);
        alert(errorMessage); // 사용자에게 알림
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center md:p-6">
        <p>직원 목록을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 md:p-6">
        <p>오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">직원 관리</h1>
        <Link href="/dashboard/employees/new">
          <Button>신규 직원 등록</Button>
        </Link>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="이름으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="부서 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 부서</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="text-center p-4">
          <p>직원 목록을 불러오는 중입니다...</p>
        </div>
      ) : error ? (
        <div className="text-center p-4 text-red-500">
          <p>오류가 발생했습니다: {error}</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center p-4">
          <p>등록된 직원이 없습니다.</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center p-4">
          <p>검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          <EmployeeTable
            employees={paginatedEmployees}
            onDelete={handleDelete}
          />
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              이전
            </Button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="outline"
            >
              다음
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
