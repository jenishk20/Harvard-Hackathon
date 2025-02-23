
import { useAuth } from "@/context/AuthContext";
import { Banknote, Component, ShieldPlus } from "lucide-react";



const FEATURES = [
	{
		title: "Become a Partner Insurer",
		description:
			"Join us in empowering gig workers and low-income individuals by contributing to a fund that makes insurance accessible to all. Your contribution ensures that everyone, regardless of income, can protect their future.",
		icon: Component,
	},
	{
		title: "Flexible Micro-Insurance",
		description:
			"Get the coverage you need without breaking the bank. We offer affordable, bite-sized insurance plans designed specifically for gig workers and low-wage earners. Protect yourself today with plans that fit your budget",
		icon: ShieldPlus
	},
	{
		title: "Quick Claims Assistance",
		description:
			"Get the coverage you need without breaking the bank. MicroShield offers affordable, bite-sized insurance plans designed specifically for gig workers and low-wage earners. Protect yourself today with plans that fit your budget",
        icon : Banknote
	},
];

export default function HomePage(){
  const { currentUser } = useAuth();
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