import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import Spinner from '../../components/spinner';

export default function AddExpensePage() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let receiptUrl='';
    if(receipt){
        receiptUrl = await mediaUpload(receipt);
    }

    const data ={
      category : category,
      amount : amount,
      date : date,
      receiptImageUrl : receiptUrl
    }
    

    try {
      const token = localStorage.getItem("token");
      console.log(data);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/expenses`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Expense added successfully!");
      navigate("/expenses");
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-xl font-bold text-accent mb-4">Add New Expense</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          >
            <option value="">Select category</option>
            <option value="Transport">Transport</option>
            <option value="Food">Food</option>
            <option value="Loan">Loan</option>
            <option value="Entertainment">Entertainment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (LKR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Attach Receipt (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files[0])}
            className="w-full mt-1 p-2 border rounded-lg"
          />
        </div>

        <button
          disabled={loading?true:false}
          type="submit"
          className="w-full bg-accent text-white py-2 rounded-lg cursor-pointer hover:bg-accent-second transition"
        >
          {loading ? <Spinner/> : "Add Expense"}
        </button>
      </form>
    </div>
  );
}
