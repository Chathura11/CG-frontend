import { useState } from "react";
import axios from "axios";
import Spinner from "../../components/spinner";

export default function AddSchedulePage() {
  const [type, setType] = useState("monthly");
  const [targetAmount, setTargetAmount] = useState("");
  const [categories, setCategories] = useState([{ name: "", limit: "" }]);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/schedules`,
        {
          type,
          targetAmount: Number(targetAmount),
          categories: categories.map((c) => ({
            name: c.name,
            limit: Number(c.limit),
          })),
          remindersEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Schedule added successfully!");
      setType("monthly");
      setTargetAmount("");
      setCategories([{ name: "", limit: "" }]);
      setRemindersEnabled(false);
    } catch (error) {
      setMessage("Error adding schedule.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold text-accent mb-4">Add New Schedule</h1>

      {message && <p className="mb-4 text-sm text-center text-blue-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full bg-accent text-white py-2 px-4 rounded hover:bg-accent-second transition"
        >
          {loading ? <Spinner/> : "Create Schedule"}
        </button>
      </form>
    </div>
  );
}
