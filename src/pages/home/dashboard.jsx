import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BsGraphDown } from "react-icons/bs";

export default function Dashboard() {
  const [scheduleProgresses, setScheduleProgresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgresses() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/scheduleProgresses/current`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setScheduleProgresses(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching schedule progresses:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProgresses();
  }, []);

  function getProgressColor(percent) {
    if (percent >= 100) return "bg-[#ee6055]";
    if (percent >= 50) return "bg-[#fec89a]";
    return "bg-[#a7e8bd]";
  }

  function getBadgeColor(type) {
    const colors = {
      daily: "bg-blue-100 text-blue-700",
      weekly: "bg-purple-100 text-purple-700",
      monthly: "bg-green-100 text-green-700",
      yearly: "bg-yellow-100 text-yellow-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-accent text-center">
        Spending Progress Overview
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : scheduleProgresses.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <BsGraphDown className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-center text-gray-500">No progress data available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {scheduleProgresses.map((progress) => {
            const percent = (progress.totalSpent / progress.targetAmount) * 100;
            const colorClass = getProgressColor(percent);
            const badgeClass = getBadgeColor(progress.type);

            return (
              <div
                key={progress._id}
                className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FaRegCalendarAlt className="text-accent" />
                    <span
                      className={`text-sm px-3 py-1 rounded-full font-semibold ${badgeClass}`}
                    >
                      {progress.type.charAt(0).toUpperCase() + progress.type.slice(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.min(percent, 100).toFixed(1)}%
                  </span>
                </div>

                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>

                <p className="mt-2 text-sm text-gray-700">
                  <span className="font-semibold text-accent">
                    LKR {progress.totalSpent.toFixed(2)}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-600">
                    LKR {progress.targetAmount.toFixed(2)}
                  </span>
                </p>

                {/* Category-Level Progress */}
                <div className="mt-4 space-y-3">
                  {progress.categories?.map((cat) => {
                    const spent = progress.categorySpent?.[cat.name] || 0;
                    const catPercent = (spent / cat.limit) * 100;
                    const catColor = getProgressColor(catPercent);

                    return (
                      <div key={cat._id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {cat.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.min(catPercent, 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${catColor} transition-all duration-500`}
                            style={{ width: `${Math.min(catPercent, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          LKR {spent.toFixed(2)} / {cat.limit.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
