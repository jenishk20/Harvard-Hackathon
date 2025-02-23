import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { PLANS } from "@/insurance";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Loader2 } from "lucide-react";
import { cn, getTitleCase } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ContributionsData {
  cause: string;
  amount: number;
}

const ContributionChart = ({
  contributions,
}: {
  contributions: ContributionsData[] | undefined;
}) => {
  const labels = contributions
    ? contributions.map((contribution) => contribution.cause)
    : [];
  const dataValues = contributions
    ? contributions.map((contribution) => contribution.amount)
    : [];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Contributions by Cause",
        data: dataValues,
        borderColor: "#2563eb",
        backgroundColor: "#FFFFFF",
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} />;
};

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const fetchBalance = async (userId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user/getBalance?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching balance");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("An error occurred while fetching balance");
  }
};

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

const fetchContributions = async (userId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user/getContributions?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching contributions");
    }

    return await response.json();
  } catch (error) {
    throw new Error("An error occurred while fetching contributions");
  }
};

const fetchClaims = async (userId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user/getClaims?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching claims");
    }

    return await response.json();
  } catch (error) {
    throw new Error("An error occurred while fetching claims");
  }
};

const CLAIMS_COLORS: Record<string, string> = {
  approved: "bg-green-500 text-white",
  pending: "bg-yellow-500 text-white",
  rejected: "bg-red-500 text-white",
};

export default function HomePage() {
  const { currentUser } = useAuth();

  const balanceClient = useQuery({
    queryKey: ["balance", currentUser?.uid],
    queryFn: () => fetchBalance(currentUser?.uid || ""),
    enabled: !!currentUser,
  });

  const policiesClient = useQuery({
    queryKey: ["policies", currentUser?.uid],
    queryFn: () => fetchPolicies(currentUser?.uid || ""),
    enabled: !!currentUser,
  });

  const contributionsClient = useQuery({
    queryKey: ["contributions", currentUser?.uid],
    queryFn: () => fetchContributions(currentUser?.uid || ""),
    enabled: !!currentUser,
  });

  const claimsClient = useQuery({
    queryKey: ["claims", currentUser?.uid],
    queryFn: () => fetchClaims(currentUser?.uid || ""),
    enabled: !!currentUser,
  });

  return (
    <div className="w-screen h-[97vh] mt-16 flex flex-col items-start justify-start">
      <div className="px-12 py-6 space-y-4 bg-primary/10 w-full">
        <h1 className="text-2xl font-heading font-bold">
          Welcome, {currentUser?.displayName}{" "}
        </h1>
        <div className="flex gap-4 items-center">
          <div className="h-56 w-96 px-8 py-4 rounded-md text-white shadow-md border-black bg-primary border-2 border-primary-foreground space-y-4">
            <h2 className="text-lg font-bold text-muted/50">Your Balance</h2>
            <p className="text-7xl font-bold drop-shadow-lg">
              {balanceClient.isPending ? "XXXX" : balanceClient.data?.balance}{" "}
              <span className="-ml-4 text-lg">HBAR</span>
            </p>
          </div>
          <div className="h-56 w-96 px-8 py-4 rounded-md text-primary shadow-md border-black bg-white border-2 border-primary-foreground space-y-4">
            <h2 className="text-lg font-bold">Your Contributions</h2>
            <div className="h-40 flex w-full items-center justify-center">
              {contributionsClient.isPending ? (
                <Loader2 className="animate-spin h-9 w-9" />
              ) : (
                <ContributionChart
                  contributions={contributionsClient?.data?.contributions}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-12 py-6">
        <div>
          <h2 className="text-2xl font-heading font-bold mb-4">
            Your Policies & Claims
          </h2>
          {policiesClient.isPending && (
            <Loader2 className="animate-spin h-9 w-9" />
          )}

          {!policiesClient.isPending &&
            (!policiesClient.data?.policies ||
              policiesClient.data.policies.length === 0) && (
              <p className="text-gray-500">
                You have not purchased any policies yet.
              </p>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!policiesClient.isPending &&
              policiesClient.data?.policies?.map((policy: any) => {
                const planDetails = PLANS.find(
                  (plan) =>
                    plan.plan_name.toLowerCase() ===
                    policy.planName.toLowerCase()
                );

                return (
                  <div
                    key={policy.policyId}
                    className="p-6 border-2 border-primary-foreground rounded-xl w-full shadow-md bg-white flex gap-4"
                  >
                    <div className="flex flex-col space-y-4 w-full">
                      <h3 className="text-2xl font-semibold text-primary">
                        {policy.planName.toUpperCase()}
                      </h3>

                      {/* Coverage Section */}
                      <div className="bg-primary/10 p-3 rounded-lg border border-primary">
                        <p className="text-md font-medium text-primary">
                          {planDetails?.coverage}
                        </p>
                      </div>

                      {/* Invested Amount */}
                      <p className="text-lg font-bold">
                        Invested: {policy.amount}{" "}
                        <span className="text-sm">HBAR</span>
                      </p>

                      {/* Additional Features */}
                      {planDetails?.additional_features && (
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {planDetails.additional_features.map(
                            (feature, index) => (
                              <li key={index} className="text-sm">
                                {feature}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                    {claimsClient.isFetched && (
                      <div className="flex flex-col space-y-3 w-full border-l-2 px-4">
                        <h3 className="font-semibold">
                          {claimsClient?.data?.claims[0]?.reason}
                        </h3>
                        <p className="text-2xl font-bold">
                          {claimsClient?.data?.claims[0]?.amount} HBAR
                        </p>
                        <p
                          className={cn(
                            CLAIMS_COLORS[
                              claimsClient?.data?.claims[0]?.status
                            ],
                            "rounded-md py-2 px-4"
                          )}
                        >
                          {getTitleCase(claimsClient?.data?.claims[0]?.status)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
