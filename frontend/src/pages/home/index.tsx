
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const fetchBalance = async (userId : string) => {
	try {
		
		const response = await fetch(`${BASE_URL}/user/getBalance?userId=${userId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("An error occurred while fetching balance");
		}

		const data = await response.json();
		return data;

	} catch (error) {
		throw new Error("An error occurred while fetching balance");
	}
}


export default function HomePage(){
  const { currentUser } = useAuth();
	
	const balanceClient = useQuery({
		queryKey : ["balance", currentUser?.uid],
		queryFn : () => fetchBalance(currentUser?.uid || ""),
		enabled: !!currentUser,
	})

    return (
			<div className="w-screen mt-16 flex flex-col items-start justify-start my-4">
				<div className="px-12 py-6 space-y-4 bg-primary/10 w-full">
					<h1 className="text-2xl font-heading font-bold">
						Welcome, {currentUser?.displayName}{" "}
					</h1>
				<div className="h-56 w-96 px-8 py-4 rounded-md text-white shadow-md border-black bg-primary border-2 border-primary-foreground space-y-4">
					<h2 className="text-lg font-bold text-muted/50">Your Balance</h2>
					<p className="text-7xl font-bold drop-shadow-lg">{ balanceClient.isPending ? "XXXX"  : balanceClient.data?.balance} <span className="-ml-4 text-lg">HBAR</span></p>
				</div>
				</div>
				
			</div>
		);
}