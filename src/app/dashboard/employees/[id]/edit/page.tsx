"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getEmployeeById, updateEmployee, upsertSalary } from "@/lib/api";
import { Employee } from "@/types/employee.types";
import { DEPARTMENTS, POSITIONS } from "@/lib/constants";
import { UpsertSalaryDto } from "@/types/payroll.types";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [employee, setEmployee] = useState<Partial<Employee> | null>(null);
  const [salaryInfo, setSalaryInfo] = useState<UpsertSalaryDto>({
    baseSalary: 0,
    effectiveDate: "",
  });

  const [error, setError] = useState("");
  const [salaryError, setSalaryError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSalaryLoading, setIsSalaryLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      setIsFetching(true);
      try {
        const data = await getEmployeeById(id);
        setEmployee(data);
        if (data.salary) {
          setSalaryInfo({
            baseSalary: data.salary.baseSalary,
            effectiveDate: data.salary.effectiveDate.split("T")[0],
          });
        }
      } catch (err) {
        setError("직원 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setEmployee((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSalaryInfo((prev) => ({
      ...prev,
      [name]: name === "baseSalary" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: "department" | "position") => {
    return (value: string) => {
      setEmployee((prev) => (prev ? { ...prev, [name]: value } : null));
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!employee) return;

    setIsLoading(true);
    setError("");

    try {
      const { name, department, position, joinDate } = employee;
      await updateEmployee(id, { name, department, position, joinDate });
      router.push("/dashboard/employees");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalarySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSalaryLoading(true);
    setSalaryError("");
    try {
      await upsertSalary(id, salaryInfo);
      alert("급여 정보가 성공적으로 저장되었습니다.");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "급여 정보 저장에 실패했습니다.";
      setSalaryError(errorMessage);
    } finally {
      setIsSalaryLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="p-4 text-center md:p-6">
        <p>직원 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500 md:p-6">
        <p>오류: {error}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-4 text-center md:p-6">
        <p>해당 직원을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">직원 정보 수정</h1>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-8 bg-white rounded-lg shadow"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                name="name"
                value={employee.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">부서</Label>
              <Select
                value={employee.department || ""}
                onValueChange={handleSelectChange("department")}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="부서를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">직위</Label>
              <Select
                value={employee.position || ""}
                onValueChange={handleSelectChange("position")}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="직위를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="joinDate">입사일</Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={employee.joinDate?.split("T")[0] || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div className="flex justify-end pt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading || isFetching}>
              {isLoading ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6">급여 정보 설정</h2>
        <form
          onSubmit={handleSalarySubmit}
          className="p-6 space-y-8 bg-white rounded-lg shadow"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">기본급 (월)</Label>
              <Input
                id="baseSalary"
                name="baseSalary"
                type="number"
                value={salaryInfo.baseSalary}
                onChange={handleSalaryChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">적용 시작일</Label>
              <Input
                id="effectiveDate"
                name="effectiveDate"
                type="date"
                value={salaryInfo.effectiveDate}
                onChange={handleSalaryChange}
                required
              />
            </div>
          </div>

          {salaryError && (
            <p className="text-sm text-center text-red-500">{salaryError}</p>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSalaryLoading}>
              {isSalaryLoading ? "저장 중..." : "급여 정보 저장"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
