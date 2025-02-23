import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { PLANS } from "@/insurance";

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

  return (
    <div className="w-screen h-[97vh] mt-16 flex flex-col items-start justify-start">
      <div className="px-12 py-6 space-y-4 bg-primary/10 w-full">
        <h1 className="text-2xl font-heading font-bold">
          Welcome, {currentUser?.displayName}{" "}
        </h1>
        <div className="h-56 w-96 px-8 py-4 rounded-md text-white shadow-md border-black bg-primary border-2 border-primary-foreground space-y-4">
          <h2 className="text-lg font-bold text-muted/50">Your Balance</h2>
          <p className="text-7xl font-bold drop-shadow-lg">
            {balanceClient.isPending ? "XXXX" : balanceClient.data?.balance}{" "}
            <span className="-ml-4 text-lg">HBAR</span>
          </p>
        </div>
      </div>
      <div className="w-full px-12 py-6">
        <h2 className="text-2xl font-heading font-bold mb-4">Your Policies</h2>

        {policiesClient.isPending && (
          <p className="text-gray-500">Loading policies...</p>
        )}

        {!policiesClient.isPending &&
          (!policiesClient.data?.policies ||
            policiesClient.data.policies.length === 0) && (
            <p className="text-gray-500">
              You have not purchased any policies yet.
            </p>
          )}

        <div className="grid grid-cols-1 md:grid-cols-2	 lg:grid-cols-3 gap-6">
          {!policiesClient.isPending &&
            policiesClient.data?.policies?.map((policy: any) => {
              const planDetails = PLANS.find(
                (plan) =>
                  plan.plan_name.toLowerCase() === policy.planName.toLowerCase()
              );

              return (
                <div
                  key={policy.policyId}
                  className="p-6 border-2 border-primary-foreground rounded-xl shadow-md bg-white flex flex-col space-y-4"
                >
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
                      {planDetails.additional_features.map((feature, index) => (
                        <li key={index} className="text-sm">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
