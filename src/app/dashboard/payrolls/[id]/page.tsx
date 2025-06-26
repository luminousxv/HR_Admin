"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as api from "@/lib/api";
import { Payroll, DeductionType } from "@/types/payroll.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

// DeductionType enum 값을 한글로 변환하기 위한 맵
const deductionTypeToKorean: { [key in DeductionType]: string } = {
  [DeductionType.NATIONAL_PENSION]: "국민연금",
  [DeductionType.HEALTH_INSURANCE]: "건강보험",
  [DeductionType.EMPLOYMENT_INSURANCE]: "고용보험",
  [DeductionType.LONG_TERM_CARE_INSURANCE]: "장기요양보험",
  [DeductionType.INCOME_TAX]: "소득세",
  [DeductionType.OTHER]: "기타",
};

export default function PayrollDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPayroll = async () => {
        try {
          setLoading(true);
          const data = await api.getPayrollById(id);
          setPayroll(data);
        } catch (err) {
          setError("급여 정보를 불러오는데 실패했습니다.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPayroll();
    }
  }, [id]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!payroll) {
    return <div>급여 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        목록으로 돌아가기
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>급여 명세서</CardTitle>
          <CardDescription>
            {payroll.paymentMonth.substring(0, 7)} 귀속분
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-1">
            <div className="font-semibold">직원명</div>
            <div>{payroll.employee.name}</div>
          </div>
          <div className="grid gap-1">
            <div className="font-semibold">지급 연월</div>
            <div>{payroll.paymentMonth.substring(0, 7)}</div>
          </div>
          <div className="grid gap-1">
            <div className="font-semibold">기본급</div>
            <div>{payroll.baseSalary.toLocaleString()} 원</div>
          </div>
          <div className="grid gap-1">
            <div className="font-semibold">상여금</div>
            <div>{payroll.bonus.toLocaleString()} 원</div>
          </div>
          <div className="grid gap-1 text-red-600">
            <div className="font-semibold">공제 합계</div>
            <div>{payroll.totalDeductions.toLocaleString()} 원</div>
          </div>
          <div className="grid gap-1 text-blue-600">
            <div className="font-semibold">실지급액</div>
            <div>{payroll.netPay.toLocaleString()} 원</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>공제 항목 상세</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>항목</TableHead>
                <TableHead className="text-right">금액 (원)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payroll.deductions.map((deduction) => (
                <TableRow key={deduction.id}>
                  <TableCell>
                    {deductionTypeToKorean[deduction.type] || deduction.type}
                  </TableCell>
                  <TableCell className="text-right">
                    {deduction.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
