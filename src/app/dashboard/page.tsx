"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEmployees } from "@/lib/api";
import { Employee } from "@/types/employee.types";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const recentHires = [...employees]
    .sort(
      (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-4 text-center md:p-6">
        <p>대시보드 데이터를 불러오는 중입니다...</p>
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

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-bold">대시보드</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>총 직원 수</CardTitle>
            <CardDescription>현재 재직 중인 총 인원</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{employees.length}명</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>휴직 인원</CardTitle>
            <CardDescription>현재 휴직 상태인 인원</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-400">0명</p>
            <p className="text-xs text-gray-500">(기능 개발 예정)</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>최근 입사자</CardTitle>
            <CardDescription>가장 최근에 입사한 5명</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentHires.map((employee) => (
                <li
                  key={employee.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {employee.name} ({employee.position})
                  </span>
                  <span className="text-gray-500">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
