import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function ExpenseSummeryPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/expenses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const grouped = res.data.reduce((acc, expense) => {
          const date = new Date(expense.date);
          const key = format(date, "MMM yyyy");
          acc[key] = (acc[key] || 0) + expense.amount;
          return acc;
        }, {});

        const chartData = Object.entries(grouped)
          .map(([month, total]) => ({ month, total }))
          .sort((a, b) => new Date(a.month) - new Date(b.month));

        setExpenses(chartData);
      } catch (error) {
        console.error("Error fetching expenses:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl mt-6 shadow">
      <h2 className="text-2xl font-bold mb-4 text-accent">
        Monthly Expense Summary
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="w-full h-[500px] overflow-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis
                type="number"
                stroke="#8884d8"
                tick={{ fill: "#8884d8" ,fontSize:12}}
                tickFormatter={(val) => `LKR${val}`}
              />
              <YAxis
                dataKey="month"
                type="category"
                width={30}
                stroke="#8884d8"
                tick={{ fill: "#8884d8",fontSize:12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #ccc",fontSize: "12px" }}
                labelStyle={{ color: "#333" }}
                itemStyle={{ color: "#333" }}
                formatter={(value) => [`LKR${value}`, "Total"]}
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
      )}
    </div>
  );
}
