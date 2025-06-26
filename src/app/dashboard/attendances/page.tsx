"use client";

import { useEffect, useState } from "react";
import { getAttendances } from "@/lib/api";
import { Attendance } from "@/types/attendance.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AttendancesPage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  useEffect(() => {
    const fetchAttendances = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAttendances(date.year, date.month);
        setAttendances(data);
      } catch (err) {
        setError("근태 기록을 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendances();
  }, [date]);

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "-";
    return new Date(timeString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">전체 근태 기록</h1>
      <div className="flex items-center gap-4 mb-4">
        <Select
          value={String(date.year)}
          onValueChange={(value) =>
            setDate((prev) => ({ ...prev, year: Number(value) }))
          }
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
          value={String(date.month)}
          onValueChange={(value) =>
            setDate((prev) => ({ ...prev, month: Number(value) }))
          }
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
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead>이름</TableHead>
              <TableHead>부서</TableHead>
              <TableHead>출근 시간</TableHead>
              <TableHead>퇴근 시간</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  데이터를 불러오는 중...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-red-500"
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : attendances.length > 0 ? (
              attendances.map((att) => (
                <TableRow key={att.id}>
                  <TableCell>
                    {new Date(att.clockInTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{att.employee.name}</TableCell>
                  <TableCell>{att.employee.department}</TableCell>
                  <TableCell>{formatTime(att.clockInTime)}</TableCell>
                  <TableCell>{formatTime(att.clockOutTime)}</TableCell>
                  <TableCell>
                    <Badge variant={att.clockOutTime ? "default" : "secondary"}>
                      {att.clockOutTime ? "근무 완료" : "근무 중"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  해당 기간의 근태 기록이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
