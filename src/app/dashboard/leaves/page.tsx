"use client";

import { useEffect, useState } from "react";
import { getLeaveRequests, updateLeaveRequestStatus } from "@/lib/api";
import { LeaveRequest, LeaveRequestStatus } from "@/types/leave.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusMap: Record<
  LeaveRequestStatus,
  { text: string; variant: "default" | "destructive" | "secondary" }
> = {
  [LeaveRequestStatus.PENDING]: { text: "대기중", variant: "secondary" },
  [LeaveRequestStatus.APPROVED]: { text: "승인", variant: "default" },
  [LeaveRequestStatus.REJECTED]: { text: "반려", variant: "destructive" },
};

export default function LeavesPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | LeaveRequestStatus>("all");

  const fetchLeaveRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLeaveRequests();
      setLeaveRequests(data);
    } catch (err) {
      setError("휴가 신청 목록을 불러오는 데 실패했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleStatusUpdate = async (id: string, status: LeaveRequestStatus) => {
    try {
      const updatedRequest = await updateLeaveRequestStatus(id, { status });
      setLeaveRequests((prev) =>
        prev.map((req) => (req.id === id ? updatedRequest : req))
      );
    } catch (err) {
      alert("상태 변경에 실패했습니다.");
      console.error(err);
    }
  };

  const filteredRequests =
    filter === "all"
      ? leaveRequests
      : leaveRequests.filter((req) => req.status === filter);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">휴가 신청 관리</h1>

      <div className="flex items-center gap-4 mb-4">
        <Select
          value={filter}
          onValueChange={(value: "all" | LeaveRequestStatus) =>
            setFilter(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {Object.values(LeaveRequestStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {statusMap[status].text}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>신청자</TableHead>
              <TableHead>휴가 종류</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>신청일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">작업</TableHead>
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
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.employee.name}</TableCell>
                  <TableCell>{req.leaveType}</TableCell>
                  <TableCell>
                    {new Date(req.startDate).toLocaleDateString()} ~{" "}
                    {new Date(req.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(req.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusMap[req.status].variant}>
                      {statusMap[req.status].text}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === LeaveRequestStatus.PENDING && (
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(
                              req.id,
                              LeaveRequestStatus.APPROVED
                            )
                          }
                        >
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleStatusUpdate(
                              req.id,
                              LeaveRequestStatus.REJECTED
                            )
                          }
                        >
                          반려
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  휴가 신청 내역이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
