"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { Payroll } from "@/types/payroll.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";
import { AxiosError } from "axios";

export default function PayrollsPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPayrolls = async () => {
    try {
      const data = await api.getPayrolls(year, month);
      setPayrolls(data);
    } catch (error) {
      console.error("Failed to fetch payrolls:", error);
      // TODO: Add user-friendly error handling
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [year, month]);

  const handleSearch = () => {
    fetchPayrolls();
  };

  const handleGenerate = async () => {
    if (
      !window.confirm(
        `${year}년 ${month}월 급여 명세서를 일괄 생성하시겠습니까?\n기존에 생성된 데이터가 있다면 충돌이 발생할 수 있습니다.`
      )
    ) {
      return;
    }
    setIsGenerating(true);
    try {
      const result = await api.generatePayrolls(year, month);
      alert(`${result.count}명의 급여 명세서가 성공적으로 생성되었습니다.`);
      fetchPayrolls(); // 목록 새로고침
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Failed to generate payrolls:", axiosError);
      const errorMessage =
        axiosError.response?.data?.message ||
        "급여 명세서 생성 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteByMonth = async () => {
    if (
      !window.confirm(
        `${year}년 ${month}월의 모든 급여 명세서를 삭제합니다.\n이 작업은 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?`
      )
    ) {
      return;
    }
    setIsDeleting(true);
    try {
      const result = await api.deletePayrollsByMonth(year, month);
      alert(`${result.deletedCount}개의 급여 명세서가 삭제되었습니다.`);
      fetchPayrolls(); // 목록 새로고침
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error("Failed to delete payrolls:", axiosError);
      const errorMessage =
        axiosError.response?.data?.message ||
        "명세서 삭제 중 오류가 발생했습니다.";
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>급여 관리</CardTitle>
        <CardDescription>
          월별 급여 명세서를 조회하고 관리합니다.
        </CardDescription>
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="연도" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="월" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m}월
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>조회</Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || isDeleting}
            variant="secondary"
          >
            {isGenerating ? "생성 중..." : "명세서 일괄 생성"}
          </Button>
          <Button
            onClick={handleDeleteByMonth}
            disabled={isDeleting || isGenerating}
            variant="destructive"
          >
            {isDeleting ? "삭제 중..." : "해당 월 명세서 삭제"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>지급 연월</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>기본급</TableHead>
              <TableHead>상여금</TableHead>
              <TableHead>공제 합계</TableHead>
              <TableHead>실지급액</TableHead>
              <TableHead>상세보기</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.length > 0 ? (
              payrolls.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>{payroll.paymentMonth.substring(0, 7)}</TableCell>
                  <TableCell>{payroll.employee.name}</TableCell>
                  <TableCell>{payroll.baseSalary.toLocaleString()}</TableCell>
                  <TableCell>{payroll.bonus.toLocaleString()}</TableCell>
                  <TableCell>
                    {payroll.totalDeductions.toLocaleString()}
                  </TableCell>
                  <TableCell>{payroll.netPay.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/dashboard/payrolls/${payroll.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  해당 연월의 급여 데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
