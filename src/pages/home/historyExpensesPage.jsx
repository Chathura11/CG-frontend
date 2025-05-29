import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HistoryExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const fetchExpenses = async () => {
    if (!month || !year) {
      setMessage("Please select both month and year");
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/expenses/by-month`,
        {
          month: Number(month),
          year: Number(year),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(res.data);

      const sum = res.data.reduce((acc, item) => acc + item.amount, 0);
      setTotal(sum);

      if (res.data.length === 0) setMessage("No expenses found for this period.");
    } catch (error) {
      console.error("Error fetching expenses:", error.response?.data?.message);
      setMessage("Error loading data.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    {
      label: `${months.find((m) => m.value === month)?.label || ""} ${year}`,
      total: total,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl mt-6 shadow">
      <h1 className="text-2xl font-bold mb-4 text-accent">Expense History</h1>

      {/* Month/Year Selectors */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex space-x-2">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded p-2 flex-1"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded p-2 flex-1"
          >
            <option value="">Select Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchExpenses}
          className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-second transition cursor-pointer"
        >
          View
        </button>
      </div>

      {/* Message */}
      {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}

      {/* Total + Chart */}
      {expenses.length > 0 && (
        <>
          <div className="text-right font-semibold text-lg text-accent mb-2">
            Total: LKR {total.toLocaleString()}
          </div>

          <div className="h-40 w-full mb-6 rounded-lg shadow-sm border p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `LKR${val}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={50}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  formatter={(value) => [`LKR${value}`, "Total"]}
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", fontSize: "12px" }}
                />
                <Bar
                  dataKey="total"
                  fill="#9ACBD0"
                  barSize={12}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Loading or Expense List */}
      {loading ? (
        <div className="text-center py-10">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((exp) => (
            <div
              key={exp._id}
              className="border rounded-lg p-2 flex justify-between items-center shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaCalendarAlt className="text-accent" />
                  <span className="font-medium text-gray-700">
                    {new Date(exp.date).toDateString()}
                  </span>
                </div>
                <div className="text-gray-900">{exp.category}</div>
                <div className="text-gray-500">{exp.description}</div>
              </div>
              <div className="text-right">
                <span className="text-accent font-bold text-lg">
                  LKR {exp.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
