"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatToISOWithoutTimezoneShift } from "@/lib/commanFunctions";
import { cn } from "@/lib/utils";
import {
  useGetAccountMessages,
  useGetAccountMessagesDetail,
} from "@/state/messages/messages.hook";
import { format, formatISO9075, isAfter, isBefore } from "date-fns";
import {
  ArrowDownIcon,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

// Define the structure for a message
interface Message {
  id: string;
  sentAt: string;
  direction: "Incoming" | "Outgoing";
  from: string;
  fromCountry: string;
  to: string;
  toCountry: string;
  segmentCount: number;
  status: string;
  body?: string;
  scheduledFor?: string;
  media?: any;
  text?: string;
}

interface MessageLogComponentProps {
  // messages: Message[];
  limit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
}

export function MessageLogComponent({
  // messages,
  limit,
  showFilters = true,
  showPagination = true,
}: MessageLogComponentProps) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // State for selected message in the detail view
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  // State for filter inputs
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [fromNumber, setFromNumber] = useState("");
  const [toNumber, setToNumber] = useState("");
  // State for filtered and paginated messages
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [paginatedMessages, setPaginatedMessages] = useState<Message[]>([]);
  const [pageQuery, setPageQuery] = useState<any>({
    StartDate: null,
    EndDate: null,
    FromNumber: "",
    ToNumber: "",
    PageNumber: currentPage,
    PageSize: rowsPerPage,
  });

  const {
    data: messages,
    isPending: massagePending,
    isError: massageError,
    refetch: refetchMessages,
  } = useGetAccountMessages(pageQuery);
  const {
    data: messagesDetail,
    isLoading: messageDetailPending,
    isError: messageDetailError,
  } = useGetAccountMessagesDetail(selectedMessage?.id);

  // Function to filter messages based on input criteria
  const filterMessages = () => {
    if (fromNumber !== "" && toNumber !== "") {
      setPageQuery((prev: any) => ({
        ...prev,
        FromNumber: fromNumber,
        ToNumber: toNumber,
      }));
    }
    if (dateRange?.from && dateRange?.to) {
      const StartDate = new Date(dateRange?.from);
      const EndDate = new Date(dateRange?.to);
      // convert dateRange to ios date formated string
      setPageQuery((prev: any) => ({
        ...prev,
        StartDate: StartDate
          ? formatToISOWithoutTimezoneShift(StartDate)
          : null,
        EndDate: EndDate ? formatToISOWithoutTimezoneShift(EndDate) : null,
      }));
    }
    if (rowsPerPage !== null && currentPage !== null) {
      setPageQuery((prev: any) => ({
        ...prev,
        PageNumber: currentPage,
        PageSize: rowsPerPage,
      }));
    }
    setCurrentPage(1);
  };

  // Function to reset filters
  const resetFilters = () => {
    setDateRange(undefined);
    setFromNumber("");
    setToNumber("");
    setFilteredMessages(messages?.data);
    setCurrentPage(1);
    setPageQuery({
      StartDate: null,
      EndDate: null,
      PageNumber: currentPage,
      PageSize: rowsPerPage,
    });
  };

  // Effect to initialize filtered messages
  useEffect(() => {
    setFilteredMessages(messages?.data);
  }, [messages]);

  const totalPages = Math.ceil(messages?.totalCount / rowsPerPage) || 1;

  const goToPage = (page: number) => {
    const getCurrentPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(getCurrentPage);
    setPageQuery((prev: any) => ({
      ...prev,
      PageNumber: getCurrentPage,
    }));
  };

  // Function to handle downloading messages
  const handleDownload = () => {
    const csv = [
      // CSV header
      [
        "ID",
        "Date",
        "Direction",
        "From",
        "To",
        "Segments",
        "Status",
        "Body",
      ].join(","),
      // CSV rows
      ...filteredMessages.map((message) =>
        [
          message.id,
          message.sentAt,
          message.direction,
          message.from,
          message.to,
          message.segmentCount,
          message.status,
          `"${message.body}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (typeof window !== 'undefined') {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "message_logs.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
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

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
          {/* Date Range Picker */}
          <div className="w-full sm:flex-1 min-w-[200px]">
            <label className="text-sm mb-2 block">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full relative justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                  {dateRange !== null && dateRange !== undefined && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDateRange(undefined);
                        setPageQuery((prev: any) => ({
                          ...prev,
                          StartDate: null,
                          EndDate: null,
                          PageNumber: 1,
                          PageSize: rowsPerPage,
                        }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {/* <ArrowDownIcon className="ml-auto h-4 w-4" /> */}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* From number input */}
          <div className="w-full sm:flex-1 min-w-[200px]">
            <label className="text-sm mb-2 block">From number</label>
            <div className="relative">
              <Input
                type="text"
                value={fromNumber}
                onChange={(e) => {
                  setFromNumber(e.target.value);
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (
                    event.key === "." ||
                    event.key === "-" ||
                    event.key === "e"
                  ) {
                    event.preventDefault();
                  }
                }}
                placeholder="Enter number"
              />
              {fromNumber && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => {
                    setFromNumber("");
                    setToNumber("");
                    setPageQuery((prev: any) => ({
                      ...prev,
                      FromNumber: "",
                      ToNumber: "",
                      PageNumber: 1,
                      PageSize: rowsPerPage,
                    }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* To number input */}
          <div className="w-full sm:flex-1 min-w-[200px]">
            <label className="text-sm mb-2 block">To Number</label>
            <div className="relative">
              <Input
                type="text"
                value={toNumber}
                onChange={(e) => {
                  setToNumber(e.target.value);
                }}
                placeholder="Enter number"
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (
                    event.key === "." ||
                    event.key === "-" ||
                    event.key === "e"
                  ) {
                    event.preventDefault();
                  }
                }}
              />
              {toNumber && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => {
                    setFromNumber("");
                    setToNumber("");
                    setPageQuery((prev: any) => ({
                      ...prev,
                      FromNumber: "",
                      ToNumber: "",
                      PageNumber: 1,
                      PageSize: rowsPerPage,
                    }));
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Filter, Reset, and Download buttons */}
          <div className="flex flex-wrap items-end gap-4 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-initial" onClick={filterMessages}>
              Filter
            </Button>
            <Button
              variant="secondary"
              className="flex-1 sm:flex-initial"
              onClick={resetFilters}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-initial"
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
        </div>
      )}

      {/* Message logs table */}
      <div className="border rounded-md overflow-x-auto">
        {/* {filteredMessages?.length > 0 ? ( */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[18%]">
                <div className="flex items-center gap-2">
                  Date
                  {/* <ChevronDown className="h-4 w-4" /> */}
                </div>
              </TableHead>
              <TableHead className="w-[14%]">Direction</TableHead>
              <TableHead className="w-[22%]">From</TableHead>
              <TableHead className="w-[22%]">To</TableHead>
              {/* <TableHead className="w-[12%]"># Segment</TableHead> */}
              <TableHead className="w-[12%] text-end">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {massagePending ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center !w-full justify-center overflow-hidden h-[350px]">
                    <Loader2 className="mr-2 h-[50px]  w-full align-middle animate-spin" />
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredMessages?.length !== 0 ? (
              filteredMessages?.map((message) => (
                <TableRow
                  key={message?.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedMessage(message)}
                >
                  <TableCell className="text-primary">
                    <div className="flex flex-col">
                      {message?.sentAt ? (
                        <>
                          <span className="text-sm text-muted-foreground">
                            {message?.sentAt?.split("T")[0]}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {`${message?.sentAt
                              ?.split("T")
                              .slice(1)
                              .join(" ")
                              .split("Z")[0]
                              } EDT`}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {message?.direction ? message?.direction : "-"}
                  </TableCell>
                  <TableCell>{message?.from ? message?.from : "-"}</TableCell>
                  <TableCell>{message?.to ? message?.to : "-"}</TableCell>
                  {/* <TableCell className="w-[12%]">
                    {message?.segmentCount ? message?.segmentCount : "-"}
                  </TableCell> */}
                  <TableCell className="text-end">
                    {message?.status ? message?.status : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center justify-center overflow-hidden h-[350px]">
                    Message Data not Found
                  </p>
                </TableCell>
              </TableRow>
            )}

            {massageError && (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="flex items-center justify-center overflow-hidden h-[350px]">
                    {massageError}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* // ) : (
        //   <div className="flex items-center justify-center overflow-hidden h-[350px]">
        //     Call Data not Found
        //   </div>
        // )} */}
      </div>

      {/* {
        filteredMessages?.length > 0 && ( */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select
            value={rowsPerPage.toString() ?? "5"}
            onValueChange={(value) => handlePageChange(Number(value))}
          >
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

      {/* Message details sheet */}

      <Sheet
        open={selectedMessage !== null}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <SheetContent className="w-full sm:w-[480px] sm:max-w-[calc(100vw-2rem)]">
          {messageDetailPending && (
            <div className="flex items-center justify-center overflow-hidden h-[350px]">
              <Loader2 className="mr-2 h-[50px]  w-full align-middle animate-spin" />
            </div>
          )}
          {messageDetailError && (
            <div className="flex items-center justify-center overflow-hidden h-[350px]">
              Error Message not Found
            </div>
          )}

          {!messageDetailPending && !messageDetailError && (
            <SheetHeader>
              <SheetTitle>Message Details</SheetTitle>
            </SheetHeader>
          )}

          {!messageDetailPending && !messageDetailError && selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 sm:gap-x-8 text-sm mt-4">
                {/* Left column of message details */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Message SID
                    </div>
                    <div>
                      {messagesDetail && messagesDetail?.id
                        ? messagesDetail?.id
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Created at
                    </div>
                    <div>
                      {messagesDetail && messagesDetail?.sentAt
                        ? `${messagesDetail?.sentAt?.split("T")[0]}
                            ${messagesDetail?.sentAt
                          ?.split("T")
                          .slice(1)
                          .join(" ")
                          .split("Z")[0]
                        } EDT`
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Message Segment
                    </div>
                    <div>
                      {messagesDetail && messagesDetail?.segmentCount !== 0
                        ? messagesDetail?.segmentCount
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">From</div>
                    <div>
                      {messagesDetail && messagesDetail?.from
                        ? `${messagesDetail?.from}`
                        : "-"}
                    </div>
                  </div>
                </div>

                {/* Right column of message details */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div>
                      {messagesDetail && messagesDetail?.status
                        ? messagesDetail?.status
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Direction
                    </div>
                    <div>
                      {messagesDetail && messagesDetail?.direction
                        ? messagesDetail?.direction
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Scheduled for
                    </div>
                    <div>
                      {messagesDetail && messagesDetail?.scheduledFor
                        ? messagesDetail?.scheduledFor
                        : "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">To</div>
                    <div>
                      {messagesDetail && messagesDetail?.to
                        ? `${messagesDetail?.to}`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message body */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Body</h3>
                <div className="w-full min-h-[100px] p-3 border rounded-md">
                  {messagesDetail && messagesDetail?.text
                    ? messagesDetail?.text
                    : "-"}
                </div>
              </div>

              {/* Media section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Media</h3>
                <div className="border rounded-md p-4">
                  {messagesDetail &&
                    messagesDetail?.media &&
                    messagesDetail?.media.length > 0 ? (
                    messagesDetail?.media &&
                    messagesDetail?.media.map((media: any, inx: number) => (
                      <img
                        key={`media-${inx}`}
                        src={media}
                        alt="Message media"
                        className="w-full h-auto rounded-md"
                      />
                    ))
                  ) : (
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">
                        No media attached
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
