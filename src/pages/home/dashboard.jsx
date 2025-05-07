import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BsGraphDown } from "react-icons/bs";

export default function Dashboard() {
  const [scheduleProgresses, setScheduleProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  const today = new Date();

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
        setTimeout(() => setAnimate(true), 100);
      } catch (error) {
        console.error("Error fetching schedule progresses:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProgresses();
  }, []);

  function getProgressColor(percent) {
    if (percent >= 100) return "bg-[#CB0404]";
    if (percent >= 50) return "bg-[#F4631E]";
    return "bg-[#5CB338]";
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

  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getCurrentDay(date) {
    return date.getDate();
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
          <p>No progress data available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {scheduleProgresses.map((progress) => {
            const percent = (progress.totalSpent / progress.targetAmount) * 100;
            const remaining =
              progress.totalSpent > progress.targetAmount
                ? 0
                : progress.targetAmount - progress.totalSpent;
            const colorClass = getProgressColor(percent);
            const badgeClass = getBadgeColor(progress.type);

            // Monthly-specific insights (total-based only)
            let monthlyInsights = null;
            if (progress.type === "monthly") {
              const daysInMonth = getDaysInMonth(today);
              const currentDay = getCurrentDay(today);
              const remainingDays = daysInMonth - currentDay;
              const avgDailySpent = progress.totalSpent / currentDay;
              const projectedTotal = avgDailySpent * daysInMonth;
              const allowedPerDay =
                remainingDays > 0 ? remaining / remainingDays : 0;

              monthlyInsights = (
                <div className="mt-4 text-sm text-gray-700 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p>
                    📅 <span className="font-medium">{remainingDays}</span> days remaining
                  </p>
                  <p>
                    📊 Avg spent/day:{" "}
                    <span className="font-medium">
                      LKR {avgDailySpent.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    📈 Projected total:{" "}
                    <span
                      className={`font-medium ${
                        projectedTotal > progress.targetAmount
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      LKR {projectedTotal.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    🧮 To stay on track:{" "}
                    <span className="font-medium">
                      LKR {allowedPerDay.toFixed(2)} / day
                    </span>
                  </p>
                </div>
              );
            }

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
                    className={`h-full ${colorClass} transition-all duration-700`}
                    style={{ width: animate ? `${Math.min(percent, 100)}%` : "0%" }}
                  ></div>
                </div>

                <div className="mt-2 text-sm text-gray-700 md:flex flex-wrap justify-between">
                  <p>
                    <span className="font-semibold text-accent">
                      LKR {progress.totalSpent.toFixed(2)}
                    </span>{" "}
                    of{" "}
                    <span className="text-gray-600">
                      LKR {progress.targetAmount.toFixed(2)}
                    </span>
                  </p>
                  <span
                    className={`text-xs font-medium ${
                      remaining <= 0 ? "text-red-600" : "text-accent"
                    }`}
                  >
                    Remaining: LKR {Math.abs(remaining).toFixed(2)}
                  </span>
                </div>

                {/* Monthly-only insights for total spending */}
                {monthlyInsights}

                {/* Category-Level Progress (unchanged) */}
                <div className="mt-4 space-y-3">
                  {progress.categories?.map((cat) => {
                    const spent = progress.categorySpent?.[cat.name] || 0;
                    const catPercent = (spent / cat.limit) * 100;
                    const catColor = getProgressColor(catPercent);
                    const catRemaining = spent > cat.limit ? 0 : cat.limit - spent;

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
                            className={`h-full ${catColor} transition-all duration-700`}
                            style={{
                              width: animate
                                ? `${Math.min(catPercent, 100)}%`
                                : "0%",
                            }}
                          ></div>
                        </div>
                        <div className="md:flex flex-wrap justify-between items-center mt-1 text-xs text-gray-500">
                          <p>
                            LKR {spent.toFixed(2)} / {cat.limit.toFixed(2)}
                          </p>
                          <span
                            className={`text-xs font-medium ${
                              catRemaining <= 0
                                ? "text-red-600"
                                : "text-accent"
                            }`}
                          >
                            Remaining: LKR {Math.abs(catRemaining).toFixed(2)}
                          </span>
                        </div>
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
