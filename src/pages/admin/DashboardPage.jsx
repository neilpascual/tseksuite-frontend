import DashboardCard from "../../components/admin/Card";
import { useMediaQuery } from "@mui/material";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAllExaminers, getAllResults } from "../../../api/api";
import NoDataFound from "../../components/NoDataFound";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useAuthContext } from "../../contexts/AuthProvider";
import {
  User,
  CircleCheck,
  Ban,
  X,
  Check,
  TrendingUp,
  Users,
  Clock,
  Target,
  BarChart3,
  Calendar,
  Award,
  Activity,
  Smartphone,
  Monitor,
  Star,
  Trophy,
  TrendingDown,
} from "lucide-react";

// Recharts imports
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function DashboardPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [examiners, setExaminers] = useState([]);
  const [results, setResults] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { user, isLoading, error } = useAuthContext();

  const fetchAllExaminers = async () => {
    try {
      setIsDataLoading(true);
      const res = await getAllExaminers();
      setExaminers(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch examiners");
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchAllResults = async () => {
    try {
      setIsDataLoading(true);
      const res = await getAllResults();
      setResults(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch results");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExaminers();
    fetchAllResults();
  }, []);

  // Calculate key metrics
  const totalTests = results.length;
  const completedTests = results.filter((r) => r.status === "COMPLETED").length;
  const abandonedTests = results.filter((r) => r.status === "ABANDONED").length;
  const completionRate =
    totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
  const avgScore =
    completedTests > 0
      ? results
          .filter((r) => r.status === "COMPLETED")
          .reduce((acc, curr) => acc + (curr.score || 0), 0) / completedTests
      : 0;

  // Performance tiers data for the new chart
  const performanceTiers = {
    excellent:
      completedTests > 0
        ? results.filter(
            (r) => r.status === "COMPLETED" && (r.score || 0) >= 90
          ).length
        : 0,
    good:
      completedTests > 0
        ? results.filter(
            (r) =>
              r.status === "COMPLETED" &&
              (r.score || 0) >= 70 &&
              (r.score || 0) < 90
          ).length
        : 0,
    average:
      completedTests > 0
        ? results.filter(
            (r) =>
              r.status === "COMPLETED" &&
              (r.score || 0) >= 50 &&
              (r.score || 0) < 70
          ).length
        : 0,
    poor:
      completedTests > 0
        ? results.filter((r) => r.status === "COMPLETED" && (r.score || 0) < 50)
            .length
        : 0,
  };

  // New Score Distribution Data - Radial Bar Chart
  const scoreDistributionData = [
    {
      name: "Excellent",
      value: performanceTiers.excellent,
      percentage: completedTests > 0 ? (performanceTiers.excellent / completedTests) * 100 : 0,
      color: "#22c55e",
      fill: "#22c55e",
      icon: Trophy,
      range: "90-100%"
    },
    {
      name: "Good",
      value: performanceTiers.good,
      percentage: completedTests > 0 ? (performanceTiers.good / completedTests) * 100 : 0,
      color: "#3b82f6",
      fill: "#3b82f6",
      icon: TrendingUp,
      range: "70-89%"
    },
    {
      name: "Average",
      value: performanceTiers.average,
      percentage: completedTests > 0 ? (performanceTiers.average / completedTests) * 100 : 0,
      color: "#f59e0b",
      fill: "#f59e0b",
      icon: BarChart3,
      range: "50-69%"
    },
    {
      name: "Poor",
      value: performanceTiers.poor,
      percentage: completedTests > 0 ? (performanceTiers.poor / completedTests) * 100 : 0,
      color: "#ef4444",
      fill: "#ef4444",
      icon: TrendingDown,
      range: "<50%"
    },
  ];

  // Data for radial bar chart
  const radialData = scoreDistributionData.map(item => ({
    ...item,
    fullMark: completedTests,
  }));

  // Weekly performance data - simplified for mobile
  const generateWeeklyPerformance = () => {
    const days = isMobile ? ["M", "T", "W", "T", "F", "S", "S"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyData = days.map((day) => ({
      day,
      completed: 0,
      abandoned: 0,
      avgScore: 0,
    }));

    results.forEach((result) => {
      const resultDate = new Date(result.created_at);
      const dayIndex = (resultDate.getDay() + 6) % 7;

      if (weeklyData[dayIndex]) {
        if (result.status === "COMPLETED") {
          weeklyData[dayIndex].completed += 1;
          weeklyData[dayIndex].avgScore += result.score || 0;
        } else if (result.status === "ABANDONED") {
          weeklyData[dayIndex].abandoned += 1;
        }
      }
    });

    // Calculate average scores
    weeklyData.forEach((day) => {
      if (day.completed > 0) {
        day.avgScore = Math.round(day.avgScore / day.completed);
      }
    });

    return weeklyData;
  };

  // Generate last 30 days data for the area chart - reduced data points for mobile
  const generateLast30DaysData = () => {
    const days = [];
    const today = new Date();
    const dataPoints = isMobile ? 15 : 30;

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const dateString = isMobile 
        ? date.toLocaleDateString("en-US", { day: "numeric" })
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });

      days.push({
        date: dateString,
        COMPLETED: 0,
        ABANDONED: 0,
        fullDate: date.toISOString().split("T")[0],
      });
    }

    // Populate with actual data
    results.forEach((result) => {
      const resultDate = new Date(result.created_at)
        .toISOString()
        .split("T")[0];
      const dayData = days.find((day) => day.fullDate === resultDate);

      if (dayData) {
        if (result.status === "COMPLETED") {
          dayData.COMPLETED += 1;
        } else if (result.status === "ABANDONED") {
          dayData.ABANDONED += 1;
        }
      }
    });

    return days;
  };

  const chartData = generateLast30DaysData();
  const weeklyData = generateWeeklyPerformance();

  // Department-wise Donut Chart Data
  const departmentCounts = results.reduce((acc, r) => {
    const dept = r.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(
    ([name, value]) => ({
      name: isMobile && name.length > 8 ? name.substring(0, 6) + '...' : name,
      value,
      completed: results.filter(
        (r) => r.department === name && r.status === "COMPLETED"
      ).length,
      abandoned: results.filter(
        (r) => r.department === name && r.status === "ABANDONED"
      ).length,
      avgScore:
        results.filter((r) => r.department === name && r.status === "COMPLETED")
          .length > 0
          ? Math.round(
              results
                .filter(
                  (r) => r.department === name && r.status === "COMPLETED"
                )
                .reduce((acc, curr) => acc + (curr.score || 0), 0) /
                results.filter(
                  (r) => r.department === name && r.status === "COMPLETED"
                ).length
            )
          : 0,
    })
  );

  const MODERN_COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#a855f7",
    "#ec4899",
  ];

  // Custom Tooltip for Area Chart
  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-xl p-4 shadow-2xl">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {entry.dataKey.toLowerCase()}:
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-xl p-4 shadow-2xl min-w-[200px]">
          <p className="text-sm font-semibold text-gray-800 mb-3">
            {data.name}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tests:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.value}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">Completed:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.completed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600">Abandoned:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.abandoned}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate:</span>
                <span className="text-sm font-semibold text-green-600">
                  {Math.round((data.completed / data.value) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-xl p-4 shadow-2xl">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {entry.dataKey === "avgScore"
                    ? "Average Score"
                    : entry.dataKey.toLowerCase()}
                  :
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {entry.dataKey === "avgScore"
                    ? `${entry.value}%`
                    : entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Radial Chart
  const CustomRadialTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-xl p-4 shadow-2xl">
          <p className="text-sm font-semibold text-gray-800 mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Tests:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.value}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Percentage:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Range:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.range}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) return <div>Loading user...</div>;

  return (
    <div className="min-h-screen w-full pb-3 px-3 sm:px-4 xl:px-43 py-6 sm:mt-0 mb-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-cyan-700 mb-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Comprehensive overview of test performance and analytics
            </p>
          </div>
          {/* <div className="hidden sm:flex items-center gap-2 text-gray-500">
            {isMobile ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            <span className="text-sm">{isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</span>
          </div> */}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-4 mb-6">
        <DashboardCard
          title="Total Examinees"
          value={examiners.length}
          icon={Users}
          trend="+12%"
          description="Registered users"
          gradient="from-blue-500 to-cyan-500"
          compact={isMobile}
        />
        <DashboardCard
          title="Completion Rate"
          value={`${Math.round(completionRate)}%`}
          icon={CircleCheck}
          trend="+8%"
          description="Successful attempts"
          gradient="from-green-500 to-emerald-500"
          compact={isMobile}
        />
        <DashboardCard
          title="Avg. Score"
          value={`${Math.round(avgScore)}%`}
          icon={Target}
          trend="+3%"
          description="Overall performance"
          gradient="from-purple-500 to-pink-500"
          compact={isMobile}
        />
        <DashboardCard
          title="Abandoned Tests"
          value={abandonedTests}
          trend="-5%"
          description="Improvement shown"
          icon={Ban}
          gradient="from-red-500 to-rose-500"
          compact={isMobile}
        />
      </div>

      {isDataLoading && <LoadingIndicator />}

      {examiners.length === 0 ? (
        <NoDataFound />
      ) : (
        <>
          {/* Main Charts Row */}
          <div className="flex flex-col xl:flex-row rounded-lg overflow-x-auto mb-6 gap-4 sm:gap-6">
            {/* Monthly Area Chart */}
            <div className="w-full xl:w-2/3">
              <Card className="h-full border-1 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-cyan-700 text-lg sm:text-xl">
                        30-Day Test Performance
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        Daily completed vs abandoned tests
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs sm:text-sm text-gray-600">Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs sm:text-sm text-gray-600">Abandoned</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: isMobile ? 10 : 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorCompleted"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#22c55e"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#22c55e"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorAbandoned"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: isMobile ? 10 : 11 }}
                        interval={isMobile ? 3 : 2}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: isMobile ? 10 : 11 }}
                      />
                      <Tooltip content={<CustomAreaTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="COMPLETED"
                        stroke="#22c55e"
                        strokeWidth={2}
                        fill="url(#colorCompleted)"
                        dot={{ fill: "#22c55e", strokeWidth: 2, r: isMobile ? 1 : 2 }}
                        activeDot={{ r: isMobile ? 3 : 4, fill: "#16a34a" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ABANDONED"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fill="url(#colorAbandoned)"
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: isMobile ? 1 : 2 }}
                        activeDot={{ r: isMobile ? 3 : 4, fill: "#dc2626" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="pt-4">
                  <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    Tracking last {isMobile ? '15' : '30'} days of test activity
                  </p>
                </CardFooter>
              </Card>
            </div>

            {/* Department Donut Chart */}
            <div className="w-full xl:w-1/3">
              <Card className="h-full border-1 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-cyan-700 text-lg sm:text-xl">
                    Department Distribution
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Test volume and performance by department
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-64 sm:h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={isMobile ? 30 : 35}
                        outerRadius={isMobile ? 60 : 75}
                        paddingAngle={2}
                        cornerRadius={6}
                      >
                        {departmentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={MODERN_COLORS[index % MODERN_COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={isMobile ? 28 : 36}
                        wrapperStyle={{
                          fontSize: isMobile ? '10px' : '12px',
                        }}
                        formatter={(value, entry) => (
                          <span className="text-gray-600 text-xs sm:text-sm">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Hover over segments for detailed performance metrics
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Additional Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Weekly Performance Bar Chart */}
            <Card className="border-1 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-cyan-700 text-lg sm:text-xl">
                  Weekly Performance
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Test activity and average scores by day of week
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{ top: 20, right: isMobile ? 10 : 30, left: isMobile ? 0 : 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: isMobile ? 10 : 11 }}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: isMobile ? 10 : 11 }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: isMobile ? 10 : 11 }}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Legend 
                      wrapperStyle={{
                        fontSize: isMobile ? '10px' : '12px',
                        paddingTop: isMobile ? '10px' : '0'
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="completed"
                      name="Completed Tests"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="abandoned"
                      name="Abandoned Tests"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgScore"
                      name="Avg Score %"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: isMobile ? 2 : 3 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* NEW Score Distribution - Radial Bar Chart */}
            <Card className="border-1 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-cyan-700 text-lg sm:text-xl">
                  Score Distribution
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Performance analysis of completed tests
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 sm:h-80">
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Radial Chart */}
                  <div className="w-full lg:w-1/2 h-48 lg:h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius={isMobile ? "40%" : "30%"}
                        outerRadius={isMobile ? "80%" : "90%"}
                        data={radialData}
                        startAngle={180}
                        endAngle={0}
                      >
                        <RadialBar
                          minAngle={15}
                          background
                          clockWise
                          dataKey="percentage"
                          cornerRadius={10}
                        >
                          {radialData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </RadialBar>
                        <Tooltip content={<CustomRadialTooltip />} />
                        <Legend
                          iconSize={isMobile ? 8 : 10}
                          layout="vertical"
                          verticalAlign="middle"
                          wrapperStyle={{
                            fontSize: isMobile ? '10px' : '11px',
                            paddingLeft: isMobile ? '5px' : '10px'
                          }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Performance Stats */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-3 lg:space-y-4 p-4 lg:p-6">
                    {scoreDistributionData.map((tier, index) => {
                      const IconComponent = tier.icon;
                      return (
                        <div
                          key={tier.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: tier.color }}
                            >
                              <IconComponent className="w-2 h-2 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
                                {tier.name}
                              </p>
                              <p className="text-xs text-gray-500">{tier.range}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm">
                              {tier.value}
                            </p>
                            <p className="text-xs text-gray-500">
                              {tier.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full text-center">
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Based on {completedTests} completed tests
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;