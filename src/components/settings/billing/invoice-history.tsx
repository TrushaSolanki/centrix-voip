"use client";

import { useState, useEffect } from "react";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Download, Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetInvoiceData } from "@/state/billing/billing.hook";
import { format } from "date-fns";
import AppLoader from "@/components/app-loader/AppLoader";

// Define the structure of an invoice
type Invoice = {
  id: string;
  createdAt: string;
  number: string;
  amountPaid: number;
  status: string;
  url: string;
};


export default function InvoiceHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filterText, setFilterText] = useState("");
  const [startingAfter, setStartingAfter] = useState<string | null>(null);
  const [endingBefore, setEndingBefore] = useState<string | null>(null);
  const [cursorHistory, setCursorHistory] = useState<string[]>([]);
  const [pageQuery, setPageQuery] = useState<any>({
    StartingAfter: startingAfter,
    EndingBefore: endingBefore,
    Limit: rowsPerPage,
    Status: filterText,
  });

  const {
    data: invoicesListData,
    isLoading: isLoadingInvoiceListData,
    refetch
  } = useGetInvoiceData(pageQuery);

  useEffect(() => {
    refetch()
  }, [endingBefore, startingAfter, pageQuery])

  // Calculate total pages and paginated invoices
  const totalPages = invoicesListData && invoicesListData.data.length !== 0 ?
    Math.ceil(invoicesListData.data.length / rowsPerPage) : 0;


  const goToPage = (page: number) => {
    const getCurrentPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(getCurrentPage);
    setPageQuery((prev: any) => ({
      ...prev,
      StartingAfter: startingAfter,
      EndingBefore: endingBefore,
    }))
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(1);
    setRowsPerPage(Number(page));
    setCursorHistory([])
    setPageQuery((prev: any) => ({
      ...prev,
      StartingAfter: null,
      EndingBefore: null,
      Limit: Number(page),
    }));
  };

  const filterInvoiceData = () => {
    if (filterText !== "") {
      setPageQuery((prev: any) => ({
        ...prev,
        StartingAfter: null,
        EndingBefore: null,
        Status: filterText && filterText.trim()
      }));
      setCursorHistory([])
      setCurrentPage(1);
    }
  };

  const resetFilters = () => {
    setFilterText("");
    setCurrentPage(1);
    setCursorHistory([])
    setPageQuery({
      StartingAfter: null,
      EndingBefore: null,
      Limit: rowsPerPage,
      Status: "",
    });
  };

  // downalod invoice
  const downloadInvoice = async (url: string, invoiceNumber: string) => {
    try {
      if (typeof window !== 'undefined') {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.download = `invoice-${invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading the invoice:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section with description and filter input */}
      <div className="flex flex-col gap-3 lg:flex-row justify-between lg:items-center">
        <p className="text-sm text-muted-foreground">
          Recurring monthly charges will be billed to your primary payment
          method, with a backup payment method used in case the primary one
          fails.
        </p>
        <div className="flex lg:justify-end gap-4 items-center">
          <div className="relative max-w-xs">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter invoices"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-8"
            />
            {filterText && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={resetFilters}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button onClick={filterInvoiceData}>
            Filter
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5">Date created</TableHead>
              <TableHead className="w-1/4">Invoice number</TableHead>
              <TableHead className="w-1/5">Amount</TableHead>
              <TableHead className="w-1/5">Paid Amount</TableHead>
              <TableHead className="w-1/6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingInvoiceListData ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center !w-full justify-center overflow-hidden h-[350px]">
                    <Loader2 className="mr-2 h-[50px]  w-full align-middle animate-spin" />
                  </p>
                </TableCell>
              </TableRow>
            ) : invoicesListData && invoicesListData?.data?.length !== 0 ? (
              invoicesListData?.data.map((invoice: any) => (
                <TableRow key={invoice.id} className="w-full">
                  <TableCell>
                    {format(new Date(invoice?.createdAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 items-center">
                      <span className="font-mono">{invoice?.number ?? '-'}</span>
                      {/* <Link
                        href={invoice?.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      > */}
                      {invoice?.url && <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => downloadInvoice(invoice?.url, invoice?.number)}
                      >
                        <Download className="h-3 w-3 text-muted-foreground" />
                      </Button>}
                      {/* </Link> */}
                    </div>
                  </TableCell>
                  <TableCell>
                    ${invoice?.amountDue && (invoice?.amountDue / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    ${invoice?.amountPaid && (invoice?.amountPaid / 100).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        invoice?.status === "Paid"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : invoice?.status === "Unpaid"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {invoice?.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No invoice data found.
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </div>

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
          <div className="flex gap-1">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                const prevDataId = cursorHistory && cursorHistory[cursorHistory.length - 2]
                setCursorHistory((prev) => prev.slice(0, -1)); // Remove last cursor
                setEndingBefore(prevDataId);
                setStartingAfter(null);
                setPageQuery((prev: any) => ({
                  ...prev,
                  StartingAfter: null,
                  EndingBefore: prevDataId,
                }))
              }}
              disabled={cursorHistory.length === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const lastItemId = invoicesListData && invoicesListData?.data[invoicesListData?.data.length - 1]?.id;
                setCursorHistory((prev) => [...prev, lastItemId]);
                setStartingAfter(lastItemId);
                setEndingBefore(null);
                setPageQuery((prev: any) => ({
                  ...prev,
                  EndingBefore: null,
                  StartingAfter: lastItemId,
                }))

              }}
              disabled={invoicesListData && invoicesListData?.hasMore === false ? true : false}
              aria-label="Next page"
              className="cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" /> Next
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
}
