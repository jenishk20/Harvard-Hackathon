import { useState, useEffect } from "react";
import { extractFromFile } from "../../../lib/extractFromFile";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ClaimsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    amount: "",
    file: null,
  });

  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const conversionRate = 0.1;

  useEffect(() => {}, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "amount" && value) {
      const amountInUSD = parseFloat(value);
      setConvertedAmount(amountInUSD * conversionRate);
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, file });
    }
  };

  const [fileError, setFileError] = useState<string | null>(null);

  const handleSubmit = (e: any) => {
    handleFileValidation(formData.file);
    e.preventDefault();
  };

  const handleClaimResponse = (response: any) => {
    console.log("Response is ", response);
    if (response?.isValidClaim?.isApproved) {
      toast.success("Claim Approved ✅", {
        description: "Your claim has been successfully processed.",
      });
    } else {
      toast.error("Claim Denied ❌", {
        description: "Please review and correct any errors in your claim.",
      });
    }

    setTimeout(() => {
      navigate("/home");
    }, 3000);
  };

  const handleFileValidation = async (file: File) => {
    const formDataToSend = new FormData();
    formDataToSend.append("reason", formData.reason);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("file", file);

    const response = await fetch("http://localhost:3000/file/extractData", {
      method: "POST",
      body: formDataToSend,
    });
    const data = await response.json();
    handleClaimResponse(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          File a Claim
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Why do you want to file a claim?
            </label>
            <textarea
              name="reason"
              className="w-full mt-2 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe your reason..."
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Incident
            </label>
            <input
              type="date"
              name="date"
              className="w-full mt-2 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount of Reimbursement ($)
            </label>
            <input
              type="number"
              name="amount"
              className="w-full mt-2 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              min="0"
              required
              onChange={handleChange}
            />
          </div>

          {convertedAmount !== null && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Amount in Hedera (HBAR): {convertedAmount.toFixed(2)}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Picture of the Incident
            </label>
            <input
              type="file"
              className="w-full mt-2 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition"
          >
            Validate Claim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimsPage;
