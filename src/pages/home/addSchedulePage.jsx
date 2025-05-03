import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../components/spinner";
import toast from "react-hot-toast";

export default function AddSchedulePage({ edit = false }) {
  const [type, setType] = useState("monthly");
  const [targetAmount, setTargetAmount] = useState("");
  const [categories, setCategories] = useState([{ name: "", limit: "" }]);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const scheduleData = location.state;

  useEffect(() => {
    if (edit && scheduleData) {
      setType(scheduleData.type);
      setTargetAmount(scheduleData.targetAmount);
      setCategories(scheduleData.categories);
      setRemindersEnabled(scheduleData.remindersEnabled);
    }
  }, [edit, scheduleData]);

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categories];
    updated[index][field] = value;
    setCategories(updated);
  };

  const addCategory = () => {
    setCategories([...categories, { name: "", limit: "" }]);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const schedulePayload = {
        type,
        targetAmount: Number(targetAmount),
        categories: categories.map((c) => ({
          name: c.name,
          limit: Number(c.limit),
        })),
        remindersEnabled,
      };

      if (edit && scheduleData?._id) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/schedules/${scheduleData._id}`,
          schedulePayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Schedule updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/schedules`,
          schedulePayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Schedule added successfully!");
        setType("monthly");
        setTargetAmount("");
        setCategories([{ name: "", limit: "" }]);
        setRemindersEnabled(false);
      }

      setTimeout(() => navigate("/schedules"), 1200);
    } catch (error) {
      setMessage("Error saving schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold text-accent mb-4">
        {edit ? "Edit Schedule" : "Add New Schedule"}
      </h1>

      {message && <p className="mb-4 text-sm text-center text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Schedule Type */}
        <div>
          <label className="block font-medium mb-1">Schedule Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Target Amount */}
        <div>
          <label className="block font-medium mb-1">Target Amount (LKR)</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block font-medium mb-2">Categories</label>
          {categories.map((cat, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={cat.name}
                onChange={(e) => handleCategoryChange(index, "name", e.target.value)}
                className="flex-1 border rounded p-2"
                required
              >
                <option value="">Select category</option>
                <option value="Transport">Transport</option>
                <option value="Food">Food</option>
                <option value="Loan">Loan</option>
                <option value="Entertainment">Entertainment</option>
              </select>
              <input
                type="number"
                placeholder="Limit"
                value={cat.limit}
                onChange={(e) => handleCategoryChange(index, "limit", e.target.value)}
                className="w-24 border rounded p-2"
                required
              />
              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCategory(index)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCategory}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Category
          </button>
        </div>

        {/* Reminders */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={remindersEnabled}
            onChange={(e) => setRemindersEnabled(e.target.checked)}
            className="mr-2"
          />
          <label className="font-medium">Enable Reminders</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-2 px-4 rounded hover:bg-accent-second transition cursor-pointer"
        >
          {loading ? <Spinner /> : edit ? "Update Schedule" : "Create Schedule"}
        </button>
      </form>
    </div>
  );
}
