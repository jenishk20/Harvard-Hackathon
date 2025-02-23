
export interface Plan {
	plan_name: "Bronze" | "Silver" | "Gold";
	price: number;
	coverage_percentage: string;
	additional_features: string[];
}

export const PLANS: Plan[] = [
	{
		plan_name: "Bronze",
		price: 500,
		coverage_percentage: "60%",
		additional_features: [
			"Basic medical coverage",
			"Limited prescription drug coverage",
			"Access to telemedicine services",
		],
	},
	{
		plan_name: "Silver",
		price: 750,
		coverage_percentage: "80%",
		additional_features: [
			"Basic medical coverage",
			"Limited prescription drug coverage",
			"Access to telemedicine services",
			"Comprehensive medical coverage",
			"Prescription drug coverage",
			"Access to mental health services",
		],
	},
	{
		plan_name: "Gold",
		price: 1000,
		coverage_percentage: "100%",
		additional_features: [
			"Basic medical coverage",
			"Limited prescription drug coverage",
			"Access to telemedicine services",
			"Comprehensive medical coverage",
			"Prescription drug coverage",
			"Access to mental health services",
			"Dental and vision coverage",
		],
	},
];


