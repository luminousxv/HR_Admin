"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployee, createUser } from "@/lib/api";
import { EmploymentType, EmploymentStatus } from "@/types/enums";
import { CreateEmployeeDto } from "@/types/employee.types";
import { AxiosError } from "axios";

export default function NewEmployeePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [joinDate, setJoinDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [baseSalary, setBaseSalary] = useState<number | string>("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const newUser = await createUser({ email, password });

      const employeeData: CreateEmployeeDto = {
        name,
        userId: newUser.id,
        department,
        position,
        joinDate,
        employeeNumber: `EMP-${Date.now()}`,
        residentRegistrationNumber: "000000-0000000",
        phoneNumber: "010-0000-0000",
        employmentType: EmploymentType.FULL_TIME,
        status: EmploymentStatus.EMPLOYED,
        resignationDate: null,
        bankName: "Test Bank",
        bankAccountNumber: "123-456-7890",
      };

      if (baseSalary && effectiveDate) {
        employeeData.baseSalary =
          typeof baseSalary === "string" ? parseFloat(baseSalary) : baseSalary;
        employeeData.effectiveDate = effectiveDate;
      }

      await createEmployee(employeeData);

      router.push("/dashboard/employees");
    } catch (err) {
      const error = err as AxiosError<{ message: string | string[] }>;
      const backendMessage = error.response?.data?.message;

      let displayMessage: string;
      if (Array.isArray(backendMessage)) {
        displayMessage = backendMessage.join(", ");
      } else if (typeof backendMessage === "string") {
        displayMessage = backendMessage;
      } else {
        displayMessage = "알 수 없는 오류가 발생했습니다.";
      }

      setError(displayMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">신규 직원 등록</h1>
        <Button variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-8 bg-white rounded-lg shadow"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일 (로그인 계정)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">초기 비밀번호</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">부서</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              placeholder="부서를 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">직위</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              placeholder="직위를 입력하세요"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="joinDate">입사일</Label>
            <Input
              id="joinDate"
              type="date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseSalary">기본급 (월)</Label>
            <Input
              id="baseSalary"
              type="number"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              placeholder="예: 3000000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="effectiveDate">급여 적용 시작일</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "등록 중..." : "직원 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}
