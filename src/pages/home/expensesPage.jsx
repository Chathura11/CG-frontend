import axios from "axios";
import { useEffect, useState} from "react";
import { MdAdd, MdReceiptLong } from "react-icons/md";
import { BsCashCoin } from "react-icons/bs";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryColors = {
    transport: "bg-[#83A6CE] text-white",
    food: "bg-[#0A7075] text-white",
    loan: "bg-[#A34054] text-white",
    entertainment: "bg-red-500 text-white"
  };

  const navigate = useNavigate();

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/expenses/monthly`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setExpenses(res.data);
      } catch (error) {
        console.error("Error fetching expenses:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <div className="flex w-full h-full justify-center px-4 py-6 relative bg-gray-50">
      {loading ? (
        <div className="flex w-full h-full justify-center items-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between bg-accent text-white p-4 rounded-xl shadow">
            <div className="flex items-center space-x-3">
              <BsCashCoin className="text-4xl" />
              <h1 className="text-xl font-bold">This Month's Expenses</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-white">Total</p>
              <p className="text-lg font-semibold">LKR {total.toFixed(2)}</p>
            </div>
          </div>

          {expenses.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <MdReceiptLong className="mx-auto text-6xl text-gray-300 mb-4" />
              <p>No expenses found for this month.</p>
            </div>
          ) : (
            expenses.map((expense) => {
              const colorClass =
                categoryColors[expense.category.toLowerCase()] || "bg-gray-700 text-gray-100";

              return (
                <div
                  key={expense._id}
                  className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition border"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full ${colorClass} bg-opacity-20 flex items-center justify-center`}>
                      <MdReceiptLong className="text-xl text-white" />
                    </div>
                    <div>
                      <span className="px-2 py-1 rounded text-sm text-gray-800">
                        {expense.category}
                      </span>
                      <p className="text-xs text-gray-500">
                        {format(new Date(expense.date), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-md font-semibold text-accent">
                      LKR {expense.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <button onClick={()=>navigate('/add-expense')} className="absolute right-6 bottom-6 shadow-lg">
        <MdAdd className="bg-accent rounded-full text-white text-6xl p-2 cursor-pointer hover:bg-accent-second transition" />
      </button>
    </div>
  );
}
