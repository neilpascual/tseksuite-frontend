import DashboardCard from "../../components/admin/Card";
import { useMediaQuery } from "@mui/material";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAllExaminers, getAllResults } from "../../../api/api";
import NoDataFound from "../../components/NoDataFound";
import LoadingIndicator from "../../components/LoadingIndicator";
import { useAuthContext } from "../../contexts/AuthProvider";
import { User, CircleCheck, Ban, X, Check, TrendingUp, Users } from "lucide-react";

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
  const isMobile = useMediaQuery("(max-width:600px)");
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

  // Generate last 30 days data for the area chart
  const generateLast30DaysData = () => {
    const days = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Initialize with zero values
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

  // Department-wise Donut Chart Data
  const departmentCounts = results.reduce((acc, r) => {
    const dept = r.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(
    ([name, value]) => ({
      name,
      value,
      completed: results.filter(
        (r) => r.department === name && r.status === "COMPLETED"
      ).length,
      abandoned: results.filter(
        (r) => r.department === name && r.status === "ABANDONED"
      ).length,
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

  if (isLoading) return <div>Loading user...</div>;
  // if (error || !user) return <div>Failed to load user</div>;

  return (
    <div className="h-screen w-full pb-3 px-4 lg:px-43 sm:px-6 md:px-1 py-6 sm:mt-0 md:mb-30 lg:mb-0 ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-3xl text-cyan-700 mb-2 tracking-tight mt-1">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards - Keeping original grid layout */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-15 sm:mb-8 md:mb-0">
        <DashboardCard
          title="Examinees"
          value={examiners.length}
          icon={User}
          trend="+12%"
          description="From last month"
          gradient="from-blue-500 to-cyan-500"
        />
        <DashboardCard
          title="Completed"
          value={results.filter((r) => r.status === "COMPLETED").length}
          icon={CircleCheck}
          trend="+8%"
          description="Successful attempts"
          gradient="from-green-500 to-emerald-500"
        />
        <DashboardCard
          title="Abandoned"
          value={results.filter((r) => r.status === "ABANDONED").length}
          icon={Ban}
          trend="-5%"
          description="Improvement shown"
          gradient="from-red-500 to-rose-500"
        />
      </div>

      {isDataLoading && <LoadingIndicator />}

      {examiners.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="flex flex-col md:flex-row rounded-lg overflow-x-auto mt-10 mb-10 gap-4">
          {/* Monthly Area Chart - Updated to show 30 days */}
          <div className="w-full md:w-1/2">
            <Card className="h-100 border-1 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-cyan-700 text-lg font-bold">
                      30-Day Test Performance
                    </CardTitle>
                    <CardDescription>
                      Daily completed vs abandoned tests
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-600">Abandoned</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      interval={3} // Show every 4th label to avoid crowding
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                    />
                    <Tooltip content={<CustomAreaTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="COMPLETED"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#colorCompleted)"
                      dot={{ fill: "#22c55e", strokeWidth: 2, r: 2 }}
                      activeDot={{ r: 4, fill: "#16a34a" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ABANDONED"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="url(#colorAbandoned)"
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 2 }}
                      activeDot={{ r: 4, fill: "#dc2626" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="pt-4">
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Tracking last 30 days of test activity
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Department Donut Chart */}
          <div className="w-full md:w-1/2">
            <Card className="h-100 border-1 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden mb-1">
              <CardHeader>
                <CardTitle className="text-cyan-700 text-lg font-bold">
                  Department Distribution
                </CardTitle>
                <CardDescription>
                  Test volume and performance by department
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={75}
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
                      height={36}
                      wrapperStyle={{
                        fontSize: "12px",
                      }}
                      formatter={(value, entry) => (
                        <span className="text-gray-600 text-sm">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-gray-500 text-sm">
                  Hover over segments for detailed performance metrics
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
