import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaBullseye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { BsTable } from "react-icons/bs";
import toast from "react-hot-toast";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSchedules = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/schedules`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchedules(res.data);
    } catch (error) {
      console.error("Error fetching schedules:", error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this schedule?");
    if (!confirm) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/schedules/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Schedule deleted successfully");
      setSchedules(schedules.filter((s) => s._id !== id)); // remove from UI
    } catch (err) {
      toast.error("Failed to delete schedule");
    }
  };

  const handleEdit = (schedule) => {
    console.log(schedule);
    navigate("/edit-schedule", { state: schedule });
  };

  return (
    <div className="w-full h-full p-4 flex flex-col items-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-accent">My Schedules</h1>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          <BsTable className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">No schedules found.</p>
        </div>
      ) : (
        <div className="w-full max-w-3xl space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule._id}
              className="bg-white shadow-sm hover:shadow-md transition p-4 rounded-xl border relative"
            >
              {/* Edit/Delete buttons */}
              <div className="absolute top-3 right-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(schedule)}
                  className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                  title="Edit"
                >
                  <MdEdit className="text-gray-600 text-lg" />
                </button>
                <button
                  onClick={() => handleDelete(schedule._id)}
                  className="p-2 rounded-full hover:bg-red-100 transition cursor-pointer"
                  title="Delete"
                >
                  <MdDelete className="text-red-500 text-lg " />
                </button>
              </div>

              <div className="flex flex-col mb-2">
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-accent" />
                  <h2 className="text-lg font-semibold capitalize">
                    {schedule.type} Schedule
                  </h2>
                </div>
                <span
                  className={`text-sm w-fit px-3 py-1 rounded-full ${
                    schedule.isEnabled ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {schedule.isEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              <div className="mb-2">
                <FaBullseye className="inline text-accent mr-1" />
                <span className="font-medium">Target:</span>{" "}
                <span className="text-accent font-semibold">
                  LKR {schedule.targetAmount.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {schedule.categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="bg-accent/10 text-accent rounded-lg px-3 py-2 flex justify-between items-center"
                  >
                    <span className="font-medium">{cat.name}</span>
                    <span className="font-semibold">LKR {cat.limit}</span>
                  </div>
                ))}
              </div>

              {schedule.remindersEnabled && (
                <p className="text-sm text-blue-600 mt-3 font-medium">
                  🔔 Reminders Enabled
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <MdAdd
        onClick={() => navigate("/add-schedule")}
        className="bg-accent rounded-full fixed right-6 bottom-6 text-white text-6xl p-2 cursor-pointer hover:bg-accent-second transition"
      />
    </div>
  );
}
