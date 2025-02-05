"use client";

import { PageHeader } from "@/components/page-header";
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
import { ToastProvider } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { formatToISOWithoutTimezoneShift } from "@/lib/commanFunctions";
import { cn } from "@/lib/utils";
import { useGetRecording, useGetRecordingData } from "@/state/voice/voice.hook";
import {
  useGetAccountVoice,
  useGetAccountVoiceDetail,
} from "@/state/voice/voice.hook";
import { useOrganizationStore } from "@/store/auth";
import { format, previousDay } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

interface CallLog {
  id: string;
  date: string;
  status: "Failed" | "Completed" | "No Answer";
  direction: "Outgoing" | "Incoming" | "Outgoing Dial";
  from: string;
  to: string;
  callType: "Phone" | "Client";
  duration: string;
}

interface CallDetails {
  callSID: string | null;
  from: string;
  to: string;
  direction: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  duration: string;
  insights?: {
    whoHungUp: string;
    lastSIPResponse: string;
    rtpLatency: string;
    postDialDelay: string;
    callState: string;
    packetLossDetected: boolean;
    jitterDetected: boolean;
    highPostDialDelay: boolean;
  };
  audioUrl?: any;
}

export default function VoiceMainComponent() {
  const { toast } = useToast();
  const [AudioUrl, setAudioUrl] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [fromNumber, setFromNumber] = useState("");
  const [toNumber, setToNumber] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallDetails | any>({
    callSID: "",
    from: "",
    to: "",
    direction: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    insights: {
      whoHungUp: "",
      lastSIPResponse: "",
      rtpLatency: "",
      postDialDelay: "",
      callState: "",
      packetLossDetected: false,
      jitterDetected: false,
      highPostDialDelay: false,
    },
    audioUrl: null,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageQuery, setPageQuery] = useState<any>({
    StartDate: null,
    EndDate: null,
    FromNumber: "",
    ToNumber: "",
    PageNumber: currentPage,
    PageSize: rowsPerPage,
  });
  const ProviderInfo = useOrganizationStore((state) => state.Provider);

  const { data: sampleCallLogs, isPending: callLogsLoading } =
    useGetAccountVoice(pageQuery);

  const { data: sampleCallLogsDetail, isPending: isSampleCallLogsLoading } =
    useGetAccountVoiceDetail(selectedCall?.callSID);

  const {
    data: RecourdingCallAudioData,
    isLoading: RecourdingCallAudioDataLoading,
  } = useGetRecordingData(selectedCall?.callSID);

  const handleRowClick = (callId: string) => {
    setSelectedCall((prev: any) => ({
      ...prev,
      callSID: callId,
    }));
    setIsSheetOpen(true);
  };

  const handleDownload = async () => {
    if (RecourdingCallAudioData) {
      try {
        setIsDownloading(true);
        const blob = new Blob([RecourdingCallAudioData], {
          type: "audio/mpeg",
        });
        if (typeof window !== "undefined") {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          const filename = `call_audio_${selectedCall.callSID}.mp3`;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Download failed:", error);
        toast({
          title: "Download Failed",
          description:
            "There was an error downloading the audio file. Please try again later.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsDownloading(false);
      }
    }
  };

  useEffect(() => {
    if (RecourdingCallAudioData) {
      const blob = new Blob([RecourdingCallAudioData], { type: "audio/mpeg" });
      setAudioUrl(URL.createObjectURL(blob));
    }

    return () => {
      if (RecourdingCallAudioData) {
        URL.revokeObjectURL(RecourdingCallAudioData);
      }
    };
  }, [RecourdingCallAudioData]);

  const applyFilters = () => {
    if (dateRange?.from && dateRange?.to) {
      const StartDate = new Date(dateRange?.from);
      const EndDate = new Date(dateRange?.to);
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
    if (fromNumber !== "" && toNumber !== "") {
      setPageQuery((prev: any) => ({
        ...prev,
        FromNumber: fromNumber,
        ToNumber: toNumber,
      }));
    }
    // setCurrentPage(1);
  };

  const resetFilters = () => {
    setDateRange(undefined);
    setFromNumber("");
    setToNumber("");
    setCurrentPage(1);
    setPageQuery({
      StartDate: null,
      EndDate: null,
      FromNumber: "",
      ToNumber: "",
      PageNumber: currentPage,
      PageSize: rowsPerPage,
    });
  };

  const totalPages = Math.ceil(sampleCallLogs?.totalCount / rowsPerPage) || 1;

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

  return (
    <ToastProvider>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
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

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="fromNumber" className="text-sm mb-2 block">
            From number
          </label>
          <div className="relative">
            <Input
              id="fromNumber"
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

        <div className="flex-1 min-w-[200px]">
          <label htmlFor="toNumber" className="text-sm mb-2 block">
            To Number
          </label>
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

        <div className="flex items-end gap-4">
          <Button className="mb-0" onClick={applyFilters}>
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
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Call ID / Date</TableHead> */}
              <TableHead>Call ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              {/* <TableHead>Call type</TableHead> */}
              <TableHead className="text-end">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {callLogsLoading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex items-center !w-full justify-center overflow-hidden h-[350px]">
                    <Loader2 className="mr-2 h-[50px]  w-full align-middle animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : sampleCallLogs &&
              sampleCallLogs?.data &&
              sampleCallLogs?.data?.length !== 0 ? (
              sampleCallLogs?.data?.map((log: any) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(log.id)}
                >
                  <TableCell className="font-medium">
                    <div className="hover:underline">{log.id}</div>
                    {/* <div className="text-sm text-muted-foreground">
                      {log.date}
                    </div> */}
                  </TableCell>
                  <TableCell>{log.status ? log.status : "-"}</TableCell>
                  <TableCell>{log.direction ? log.direction : "-"}</TableCell>
                  <TableCell>{log.from ? log.from : "-"}</TableCell>
                  <TableCell>{log.to ? log.to : "-"}</TableCell>
                  {/* <TableCell>{log.callType}</TableCell> */}
                  <TableCell className="text-end">
                    {log.duration ? log.duration : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex items-center justify-center overflow-hidden h-[350px]">
                    Call Data not Found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* {!callLogsLoading && !callLogsErr && rowsPerPage && currentPage && ( */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => handlePageChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={rowsPerPage.toString()} />
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full !overflow-y-auto sm:max-w-[600px] ">
          <SheetHeader>
            <SheetTitle>Call Info</SheetTitle>
          </SheetHeader>
          {isSampleCallLogsLoading ? (
            <div className="flex items-center justify-center overflow-hidden h-[350px]">
              <Loader2 className="mr-2 h-[50px]  w-full align-middle animate-spin" />
            </div>
          ) : (
            !isSampleCallLogsLoading &&
            selectedCall && (
              <>
                <div className="mt-6 min-h-screen space-y-8">
                  {/* Call Info Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                      <div>
                        <div className="font-medium mb-1">Call SID</div>
                        <div className="flex items-center gap-2">
                          {sampleCallLogsDetail?.id ? (
                            <>
                              {" "}
                              <div className="text-muted-foreground">
                                {sampleCallLogsDetail?.id}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(
                                    sampleCallLogsDetail?.id
                                  );
                                }}
                              >
                                <Copy className="h-4 w-4" />
                                <span className="sr-only">Copy call ID</span>
                              </Button>
                            </>
                          ) : (
                            "-"
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Date</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail &&
                            sampleCallLogsDetail?.createdAt
                            ? `${sampleCallLogsDetail?.createdAt?.split("T")[0]}
                            ${sampleCallLogsDetail?.createdAt
                              ?.split("T")
                              .slice(1)
                              .join(" ")
                              .split("Z")[0]
                            } EDT`
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">From</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail?.from
                            ? sampleCallLogsDetail.from
                            : "-"}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium mb-1">To</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail?.to
                            ? sampleCallLogsDetail.to
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Start Time</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail?.startTime
                            ? sampleCallLogsDetail.startTime
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">End Time</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail?.endTime
                            ? sampleCallLogsDetail.endTime
                            : "-"}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium mb-1">Direction</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail?.direction
                            ? sampleCallLogsDetail?.direction
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Duration</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail?.duration
                            ? sampleCallLogsDetail.duration
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Status</div>
                        <div className="text-muted-foreground">
                          {sampleCallLogsDetail?.status
                            ? sampleCallLogsDetail.status
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <Separator /> */}

                  {/* Insights Summary Section */}

                  {ProviderInfo !== null && ProviderInfo !== "Telnyx" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Insights Summary
                      </h3>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                        <div>
                          <div className="font-medium mb-1">Who Hung Up</div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights?.whoHungUp
                              ? sampleCallLogsDetail?.insights?.whoHungUp
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">
                            Last SIP Response
                          </div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights?.lastSIPResponse
                              ? sampleCallLogsDetail?.insights?.lastSIPResponse
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">
                            RTP Latency (ms)
                          </div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights?.rtpLatency
                              ? sampleCallLogsDetail?.insights?.rtpLatency
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">
                            Post-Dial Delay
                          </div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights?.postDialDelay
                              ? sampleCallLogsDetail?.insights?.postDialDelay
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Call State</div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights?.callState
                              ? sampleCallLogsDetail?.insights?.callState
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">
                            Packet Loss Detected
                          </div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights
                              ?.packetLossDetected === true
                              ? "True"
                              : "False"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">
                            Jitter Detected
                          </div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights?.jitterDetected ===
                              true
                              ? "True"
                              : "False"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">
                            High Post-Dial Delay
                          </div>
                          <div className="text-muted-foreground">
                            {sampleCallLogsDetail?.insights
                              ?.highPostDialDelay === true
                              ? "True"
                              : "False"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* <Separator /> */}

                  {/* Media Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Media</h3>

                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold">Listen</h4>
                      {RecourdingCallAudioDataLoading &&
                        AudioUrl &&
                        AudioUrl !== null ? (
                        <div className="flex items-center justify-center overflow-hidden h-[200px]">
                          <Loader2 className="mr-2 h-[30px] w-full align-middle animate-spin" />
                        </div>
                      ) : (
                        <audio
                          controls
                          ref={audioRef}
                          src={AudioUrl}
                          className="w-full"
                        />
                      )}

                      <h4 className="text-sm font-semibold">Share</h4>

                      <Button
                        className="w-full bg-primary"
                        onClick={handleDownload}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          "Download Call Audio"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </SheetContent>
      </Sheet>
    </ToastProvider>
  );
}
