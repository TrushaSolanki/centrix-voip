"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: string;
  status: string;
  amount: string;
  number: string;
  date: string;
}
const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    status: "Paid",
    amount: "50.00",
    number: "IN-7234794",
    date: "Oct 24, 2024, 12:52",
  },
  {
    id: "2",
    status: "Un-Paid",
    amount: "140.00",
    number: "IN-7466694",
    date: "Sep 25, 2024, 11:20",
  },
  {
    id: "3",
    status: "Active",
    amount: "70.50",
    number: "IN-6275674",
    date: "Sep 14, 2024, 14:52",
  },
  {
    id: "4",
    status: "Paid",
    amount: "230.50",
    number: "IN-7496432",
    date: "Sep 18, 2024, 12:52",
  },
  {
    id: "5",
    status: "Paid",
    amount: "100.00",
    number: "IN-7466694",
    date: "Sep 25, 2024, 11:20",
  },
  {
    id: "6",
    status: "Un-Paid",
    amount: "49.50",
    number: "IN-6275798",
    date: "Sep 14, 2024, 14:52",
  },
  {
    id: "7",
    status: "Paid",
    amount: "250.50",
    number: "IN-7577432",
    date: "Sep 18, 2024, 12:52",
  },
];

export default function InvoiceHistoryList() {
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("5");

  //   pagination component\
  //   const totalPages = Math.ceil(teamMembers.length / rowsPerPage);

  //   const goToPage = (page: number) => {
  //     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  //   };

  return (
    <div className="container">
      <div className="my-4">
        <h2 className="text-xl">Invoice History</h2>
        <p className="text-muted-foreground mt-1">
          Track and manage your recent invoices and payments.
        </p>
      </div>
      <div className="mt-4 w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Amount($)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.date}</TableCell>
                <TableCell>
                  <div>
                    {
                      <div className="text-sm text-cyan-500">
                        {member.number}
                      </div>
                    }
                  </div>
                </TableCell>
                <TableCell>{member.amount}</TableCell>
                <TableCell>{member.status}</TableCell>
                <TableCell className="text-center">
                  {" "}
                  <Download
                    size={20}
                    className="cursor-pointer hover:text-emerald-600"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rows per page</span>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-sm mr-4">Page {currentPage} of 10</div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(10, prev + 1))}
              disabled={currentPage === 10}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(10)}
              disabled={currentPage === 10}
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
