import { useState, useEffect } from "react";
import { extractFromFile } from "../../../lib/extractFromFile";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { PLANS } from "@/insurance";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const fetchPolicies = async (userId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user/getPolicies?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching policies");
    }

    return await response.json();
  } catch (error) {
    throw new Error("An error occurred while fetching policies");
  }
};
const ClaimsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const policiesClient = useQuery({
    queryKey: ["policies", currentUser?.uid],
    queryFn: () => fetchPolicies(currentUser?.uid || ""),
    enabled: !!currentUser,
  });

  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    amount: "",
    file: null,
  });

  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [coveredAmount, setCoveredAmount] = useState<number | null>(null);

  const conversionRate = 4.52;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "amount" && value) {
      const amountInUSD = parseFloat(value);
      setConvertedAmount(amountInUSD * conversionRate);

      if (selectedPlan) {
        const coveragePercentage =
          parseInt(selectedPlan.coverage.split("%")[0]) / 100;
        setCoveredAmount(amountInUSD * coveragePercentage);
      }
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setFormData({ ...formData, file });
    }
  };

  const [fileError, setFileError] = useState<string | null>(null);
  const userPolicy = policiesClient?.data?.policies?.[0] || null;

  const selectedPlan = PLANS.find(
    (plan) =>
      plan.plan_name.toUpperCase() === userPolicy?.planName.toUpperCase()
  );

  const handleSubmit = (e: any) => {
    handleFileValidation(formData.file);
    e.preventDefault();
  };

  const handleClaimResponse = (response: any) => {
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
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-100 to-gray-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          File a Claim
        </h2>

        {userPolicy && selectedPlan ? (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
            <h3 className="text-xl font-semibold text-primary">
              {selectedPlan.plan_name} Plan
            </h3>
            <p className="text-gray-600">{selectedPlan.coverage}</p>
            <ul className="list-disc ml-6 text-sm text-gray-600">
              {selectedPlan.additional_features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-red-500 text-center mb-6">
            No active policy found. Please purchase a plan first.
          </p>
        )}

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

          {coveredAmount !== null && selectedPlan && (
            <div className="mt-2 text-sm text-gray-600 font-medium">
              <p>
                Covered Amount:{" "}
                <span className="text-green-600">
                  ${coveredAmount.toFixed(2)}
                </span>
              </p>
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
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition shadow-lg"
          >
            Validate Claim
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClaimsPage;
