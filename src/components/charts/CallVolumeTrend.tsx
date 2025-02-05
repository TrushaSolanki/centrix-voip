"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

// Define the chart configuration
const chartConfig = {
  calls: {
    label: "Calls",
  },
  incoming: {
    label: "Total Incoming Calls",
    color: "hsl(var(--chart-1))",
  },
  outgoing: {
    label: "Total Outgoing Calls",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

// Define the complete dataset
const fullChartData = [
  { date: "2024-04-01", incoming: 222, outgoing: 150 },
  { date: "2024-04-02", incoming: 97, outgoing: 180 },
  { date: "2024-04-03", incoming: 167, outgoing: 120 },
  { date: "2024-04-04", incoming: 242, outgoing: 260 },
  { date: "2024-04-05", incoming: 373, outgoing: 290 },
  { date: "2024-04-06", incoming: 301, outgoing: 340 },
  { date: "2024-04-07", incoming: 245, outgoing: 180 },
  { date: "2024-04-08", incoming: 409, outgoing: 320 },
  { date: "2024-04-09", incoming: 59, outgoing: 110 },
  { date: "2024-04-10", incoming: 261, outgoing: 190 },
  { date: "2024-04-11", incoming: 327, outgoing: 350 },
  { date: "2024-04-12", incoming: 292, outgoing: 210 },
  { date: "2024-04-13", incoming: 342, outgoing: 380 },
  { date: "2024-04-14", incoming: 137, outgoing: 220 },
  { date: "2024-04-15", incoming: 120, outgoing: 170 },
  { date: "2024-04-16", incoming: 138, outgoing: 190 },
  { date: "2024-04-17", incoming: 446, outgoing: 360 },
  { date: "2024-04-18", incoming: 364, outgoing: 410 },
  { date: "2024-04-19", incoming: 243, outgoing: 180 },
  { date: "2024-04-20", incoming: 89, outgoing: 150 },
  { date: "2024-04-21", incoming: 137, outgoing: 200 },
  { date: "2024-04-22", incoming: 224, outgoing: 170 },
  { date: "2024-04-23", incoming: 138, outgoing: 230 },
  { date: "2024-04-24", incoming: 387, outgoing: 290 },
  { date: "2024-04-25", incoming: 215, outgoing: 250 },
  { date: "2024-04-26", incoming: 75, outgoing: 130 },
  { date: "2024-04-27", incoming: 383, outgoing: 420 },
  { date: "2024-04-28", incoming: 122, outgoing: 180 },
  { date: "2024-04-29", incoming: 315, outgoing: 240 },
  { date: "2024-04-30", incoming: 454, outgoing: 380 },
  { date: "2024-05-01", incoming: 165, outgoing: 220 },
  { date: "2024-05-02", incoming: 293, outgoing: 310 },
  { date: "2024-05-03", incoming: 247, outgoing: 190 },
  { date: "2024-05-04", incoming: 385, outgoing: 420 },
  { date: "2024-05-05", incoming: 481, outgoing: 390 },
  { date: "2024-05-06", incoming: 498, outgoing: 520 },
  { date: "2024-05-07", incoming: 388, outgoing: 300 },
  { date: "2024-05-08", incoming: 149, outgoing: 210 },
  { date: "2024-05-09", incoming: 227, outgoing: 180 },
  { date: "2024-05-10", incoming: 293, outgoing: 330 },
  { date: "2024-05-11", incoming: 335, outgoing: 270 },
  { date: "2024-05-12", incoming: 197, outgoing: 240 },
  { date: "2024-05-13", incoming: 197, outgoing: 160 },
  { date: "2024-05-14", incoming: 448, outgoing: 490 },
  { date: "2024-05-15", incoming: 473, outgoing: 380 },
  { date: "2024-05-16", incoming: 338, outgoing: 400 },
  { date: "2024-05-17", incoming: 499, outgoing: 420 },
  { date: "2024-05-18", incoming: 315, outgoing: 350 },
  { date: "2024-05-19", incoming: 235, outgoing: 180 },
  { date: "2024-05-20", incoming: 177, outgoing: 230 },
  { date: "2024-05-21", incoming: 82, outgoing: 140 },
  { date: "2024-05-22", incoming: 81, outgoing: 120 },
  { date: "2024-05-23", incoming: 252, outgoing: 290 },
  { date: "2024-05-24", incoming: 294, outgoing: 220 },
  { date: "2024-05-25", incoming: 201, outgoing: 250 },
  { date: "2024-05-26", incoming: 213, outgoing: 170 },
  { date: "2024-05-27", incoming: 420, outgoing: 460 },
  { date: "2024-05-28", incoming: 233, outgoing: 190 },
  { date: "2024-05-29", incoming: 78, outgoing: 130 },
  { date: "2024-05-30", incoming: 340, outgoing: 280 },
  { date: "2024-05-31", incoming: 178, outgoing: 230 },
  { date: "2024-06-01", incoming: 178, outgoing: 200 },
  { date: "2024-06-02", incoming: 470, outgoing: 410 },
  { date: "2024-06-03", incoming: 103, outgoing: 160 },
  { date: "2024-06-04", incoming: 439, outgoing: 380 },
  { date: "2024-06-05", incoming: 88, outgoing: 140 },
  { date: "2024-06-06", incoming: 294, outgoing: 250 },
  { date: "2024-06-07", incoming: 323, outgoing: 370 },
  { date: "2024-06-08", incoming: 385, outgoing: 320 },
  { date: "2024-06-09", incoming: 438, outgoing: 480 },
  { date: "2024-06-10", incoming: 155, outgoing: 200 },
  { date: "2024-06-11", incoming: 92, outgoing: 150 },
  { date: "2024-06-12", incoming: 492, outgoing: 420 },
  { date: "2024-06-13", incoming: 81, outgoing: 130 },
  { date: "2024-06-14", incoming: 426, outgoing: 380 },
  { date: "2024-06-15", incoming: 307, outgoing: 350 },
  { date: "2024-06-16", incoming: 371, outgoing: 310 },
  { date: "2024-06-17", incoming: 475, outgoing: 520 },
  { date: "2024-06-18", incoming: 107, outgoing: 170 },
  { date: "2024-06-19", incoming: 341, outgoing: 290 },
  { date: "2024-06-20", incoming: 408, outgoing: 450 },
  { date: "2024-06-21", incoming: 169, outgoing: 210 },
  { date: "2024-06-22", incoming: 317, outgoing: 270 },
  { date: "2024-06-23", incoming: 480, outgoing: 530 },
  { date: "2024-06-24", incoming: 132, outgoing: 180 },
  { date: "2024-06-25", incoming: 141, outgoing: 190 },
  { date: "2024-06-26", incoming: 434, outgoing: 380 },
  { date: "2024-06-27", incoming: 448, outgoing: 490 },
  { date: "2024-06-28", incoming: 149, outgoing: 200 },
  { date: "2024-06-29", incoming: 103, outgoing: 160 },
  { date: "2024-06-30", incoming: 446, outgoing: 400 },
]

export default function CallVolumeTrend() {
  // State for active chart type (incoming or outgoing)
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("incoming")
  
  // State for chart data and loading status
  const [chartData, setChartData] = React.useState<typeof fullChartData>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Effect to simulate data fetching
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real application, you would fetch data from an API here
      // For this example, we're using the predefined fullChartData
      setChartData(fullChartData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  // Calculate totals for incoming and outgoing calls
  const total = React.useMemo(
    () => ({
      incoming: chartData.reduce((acc, curr) => acc + curr.incoming, 0),
      outgoing: chartData.reduce((acc, curr) => acc + curr.outgoing, 0),
    }),
    [chartData]
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-2xl font-normal">Call volume trend</CardTitle>
          <CardDescription>
          Incoming and Outgoing call patterns over the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["incoming", "outgoing"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                {isLoading ? (
                  // Show skeleton loader while data is loading
                  <Skeleton className="h-[28px] w-[80px] sm:h-[36px] sm:w-[100px]" />
                ) : (
                  // Show actual data when loaded
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          // Show skeleton loader for the chart while data is loading
          <div className="space-y-2">
            <Skeleton className="h-[250px] w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          </div>
        ) : (
          // Show actual chart when data is loaded
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="calls"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={`var(--color-${activeChart})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}