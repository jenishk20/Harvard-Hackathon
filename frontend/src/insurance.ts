
export interface Plan {
	plan_name: "Bronze" | "Silver" | "Gold";
	price: number;
	coverage: string;
	additional_features: string[];
}

export const PLANS: Plan[] = [
	{
		plan_name: "Bronze",
		price: 10,
		coverage: "60% coverage up to 1000 HBARs",
		additional_features: [
			"Basic medical coverage",
			"Limited prescription drug coverage",
			"Access to telemedicine services",
		],
	},
	{
		plan_name: "Silver",
		price: 20,
		coverage: "80% coverage up to 2000 HBARs",
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
		price: 30,
		coverage: "100% coverage up to 5000 HBARs",
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
