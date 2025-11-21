import DashboardCard from "../../components/admin/Card";
import { useAuth } from "../../hooks/useAuth";
import { useMediaQuery } from "@mui/material";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAllExaminers, getAllResults } from "../../../api/api";
import NoDataFound from "../../components/NoDataFound";
import LoadingIndicator from "../../components/LoadingIndicator";
import { User, CircleCheck, Ban, X, Check } from "lucide-react";

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

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

function DashboardPage() {
  const { data: user, isLoading, isError } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [examiners, setExaminers] = useState([]);
  const [results, setResults] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

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

  // Monthly Area Chart Data
  const chartData = results.reduce((acc, r) => {
    const date = new Date(r.created_at);
    const monthYear = date.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    const existing = acc.find((d) => d.month === monthYear);
    if (existing) {
      if (r.status === "COMPLETED") existing.COMPLETED += 1;
      else if (r.status === "ABANDONED") existing.ABANDONED += 1;
    } else {
      acc.push({
        month: monthYear,
        COMPLETED: r.status === "COMPLETED" ? 1 : 0,
        ABANDONED: r.status === "ABANDONED" ? 1 : 0,
      });
    }
    return acc;
  }, []);
  chartData.sort((a, b) => new Date(a.month) - new Date(b.month));

  // Department-wise Donut Chart Data
  const departmentCounts = results.reduce((acc, r) => {
    const dept = r.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  if (isLoading) return <div>Loading user...</div>;
  if (isError || !user) return <div>Failed to load user</div>;

  return (
    <div className="h-screen w-full pb-3 px-4 lg:px-43 sm:px-6 md:px-1 py-6 sm:mt-0 md:mb-30 lg:mb-0">
      <h1 className="text-3xl sm:text-3xl text-cyan-700 mb-2 tracking-tight mt-1">
        Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-4 lg:gap-15 sm:mb-8 md:mb-0">
        <DashboardCard title="Examinees" value={examiners.length} icon={User} />
        <DashboardCard
          title="Completed"
          value={results.filter((r) => r.status === "COMPLETED").length}
          icon={CircleCheck}
        />
        <DashboardCard
          title="Abandoned"
          value={results.filter((r) => r.status === "ABANDONED").length}
          icon={Ban}
        />
      </div>

      {isDataLoading && <LoadingIndicator />}

      {examiners.length === 0 ? (
        <NoDataFound />
      ) : (
        <div className="flex flex-col md:flex-row rounded-lg overflow-x-auto mt-10 mb-10 gap-4">
          {/* Monthly Area Chart */}
          <div className="w-full md:w-1/2">
            <Card className="h-100">
              <CardHeader>
                <CardTitle>Monthly Test Status</CardTitle>
                <CardDescription>Track Completed vs Abandoned tests by month</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAbandoned" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area type="monotone" dataKey="COMPLETED" stroke="#22c55e" fillOpacity={1} fill="url(#colorCompleted)" />
                    <Area type="monotone" dataKey="ABANDONED" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbandoned)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-gray-500 text-sm">Updated monthly</p>
              </CardFooter>
            </Card>
          </div>

          {/* Department Donut Chart */}
          <div className="w-full md:w-1/2">
            <Card className="h-100">
              <CardHeader>
                <CardTitle>Most Examined Departments</CardTitle>
                <CardDescription>Distribution of examinees by department</CardDescription>
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
                      innerRadius={40}
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                    cursor={false}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const deptName = payload[0].name;
                          const totalAbandoned = results.filter(
                            (r) => r.department === deptName && r.status === "ABANDONED"
                          ).length;
                          const totalCompleted = results.filter(
                            (r) => r.department === deptName && r.status === "COMPLETED"
                          ).length;

                          return (
                            <div className="rounded-xl bg-white/30 backdrop-blur-md border border-white/20 px-6 py-4 shadow-lg">
                              <p className="text-sm font-semibold text-gray-800 mb-3">{deptName}</p>
                              <div className="flex items-center gap-2">
                                <Check className="h-6 w-6 text-green-500" />
                                <p className="text-sm text-gray-600">Completed: {totalCompleted}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <X className="h-6 w-6 text-red-500" />
                                <p className="text-sm text-gray-600">Abandoned: {totalAbandoned}</p>
                              </div>
                              
                              
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter>
                <p className="text-gray-500 text-sm">Top departments based on test count</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
