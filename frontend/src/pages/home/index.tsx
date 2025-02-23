
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export default function HomePage(){
  const { currentUser } = useAuth();
	
	const balanceClient = useQuery({
		queryKey : ["balance"],
		queryFn :
	})

    return (
			<div className="w-screen mt-16 flex flex-col items-start justify-start my-4">
				<div className="px-12 py-4">
					<h1 className="text-2xl font-heading font-bold">
						Welcome, {currentUser?.displayName}{" "}
					</h1>
				</div>
			</div>
		);
}