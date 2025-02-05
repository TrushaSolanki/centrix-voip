"use client";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { useGetAccountNumber } from "@/state/phone-number/phone-number.hook";
import {
  Check,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader2,
  MessageCircleMore,
  Pencil,
  Phone,
  Printer,
  RefreshCw,
  Search,
  Voicemail,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface NumberData {
  id: string;
  number: string;
  geography: string;
  country: string;
  friendlyName: string;
  capabilities: any;
  createdAt: string;
  status: string;
}

export default function PhoneNumber() {
  const { toast } = useToast();
  const [numbers, setNumbers] = useState<NumberData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [filteredNumbers, setFilteredNumbers] = useState<NumberData[]>([]);
  const [filters, setFilters] = useState({ country: "all", search: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [pageQuery, setPageQuery] = useState<any>({
    PageNumber: currentPage,
    PageSize: rowsPerPage,
  });

  const {
    data: apiNumbers,
    isPending: samplePhoneNumberLoading,
    isError: samplePhoneNumberError,
  } = useGetAccountNumber(pageQuery);

  useEffect(() => {
    if (apiNumbers?.data && apiNumbers?.data?.length !== 0) {
      setNumbers(apiNumbers?.data);
    }
  }, [apiNumbers]);

  useEffect(() => {
    const filtered = numbers.filter((number) => {
      const countryMatch =
        filters.country === "all" || number.country === filters.country;
      const searchMatch = filters.search
        ? number.friendlyName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        number.number.includes(filters.search)
        : true;
      return countryMatch && searchMatch;
    });
    setFilteredNumbers(filtered);
    // setCurrentPage(1);
  }, [filters, numbers]);

  const sortedAndFilteredNumbers = useMemo(() => {
    return filteredNumbers.sort((a, b) => a.number.localeCompare(b.number));
  }, [filteredNumbers]);

  const totalPages = Math.ceil(apiNumbers?.totalCount / rowsPerPage) || 1;

  // const paginatedNumbers = useMemo(() => {
  //   const startIndex = (currentPage - 1) * rowsPerPage;
  //   return sortedAndFilteredNumbers.slice(startIndex, startIndex + rowsPerPage);
  // }, [sortedAndFilteredNumbers, currentPage, rowsPerPage]);

  const copyToClipboard = (number: string) => {
    navigator.clipboard
      .writeText(number)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${number} has been copied to your clipboard.`,
        });
      })
      .catch((err: Error) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying the number.",
          variant: "destructive",
        });
      });
  };

  const goToPage = (page: number) => {
    const getCurrentPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(getCurrentPage);
    setPageQuery((prev: any) => ({
      ...prev,
      PageNumber: getCurrentPage,
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(1);
    setRowsPerPage(Number(page));
    setPageQuery((prev: any) => ({
      ...prev,
      PageNumber: 1,
      PageSize: Number(page),
    }));
  };

  const resetFilters = () => {
    setFilters({ country: "all", search: "" });
    setCurrentPage(1);
    setPageQuery({
      PageNumber: currentPage,
      PageSize: rowsPerPage,
    });
  };

  return (
    <>
      {" "}
      <div className="flex flex-col sm:flex-row gap-4 mt-7">
        <div className="relative w-full sm:w-auto flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by number"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-initial"
            onClick={resetFilters}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
      <div className="border rounded-md mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Number</TableHead>
              {/* <TableHead>Country</TableHead> */}
              {/* <TableHead>Friendly Name</TableHead> */}
              <TableHead>Capabilities</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead className="text-right">Date Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {samplePhoneNumberLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center !w-full justify-center overflow-hidden h-[350px]">
                    <Loader2 className="mr-2 h-[50px]  w-full align-middle animate-spin" />
                  </p>
                </TableCell>
              </TableRow>
            ) : sortedAndFilteredNumbers &&
              sortedAndFilteredNumbers.length !== 0 ? (
              sortedAndFilteredNumbers?.map((number: NumberData) => (
                <TableRow key={number.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-start gap-2 group">
                      <div>
                        <span>{number?.number}</span>
                        <br />
                        <span className="text-sm text-muted-foreground">
                          {number?.geography}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-1"
                        onClick={() => copyToClipboard(number.number)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy number</span>
                      </Button>
                    </div>
                  </TableCell>
                  {/* <TableCell>{number.country}</TableCell> */}
                  {/* <TableCell>
                    <div className="flex items-center justify-between group">
                      <span>{number?.friendlyName}</span>
                    </div>
                    
                  </TableCell> */}
                  <TableCell>
                    <div className="flex gap-2">
                      <Phone
                        className={`h-4 w-4 ${!number.capabilities.includes("voice") && "opacity-70"
                          }`}
                      />
                      <MessageCircleMore
                        className={`h-4 w-4 ${!number.capabilities.includes("sms") && "opacity-70"
                          }`}
                      />
                      <Printer
                        className={`h-4 w-4 ${!number.capabilities.includes("fax") && "opacity-70"
                          }`}
                      />
                      <Voicemail
                        className={`h-4 w-4 ${!number.capabilities.includes("mms") && "opacity-70"
                          }`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{number?.status ? number?.status : "-"}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {number?.createdAt?.split("T")[0]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {`${number?.createdAt
                        ?.split("T")
                        .slice(1)
                        .join(" ")
                        .split("Z")[0]
                        } EDT`}
                    </span>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center justify-center overflow-hidden h-[350px]">
                    Phone Number Data not Found
                  </p>
                </TableCell>
              </TableRow>
            )}
            {/* {samplePhoneNumberError && (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center justify-center overflow-hidden h-[350px]">
                    {samplePhoneNumberError}
                  </p>
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </div>
      {/* {apiNumbers && ( */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => handlePageChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue>{rowsPerPage}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
}
