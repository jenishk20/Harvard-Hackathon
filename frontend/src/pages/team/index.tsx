import { Github } from "lucide-react";
import { Link } from "react-router-dom";

const TEAM = [
	{
		name: "Mehul Parekh",
		photo: "https://avatars.githubusercontent.com/u/72097117?v=4",
		github: "https://github.com/Mehulparekh144",
		role: "Frontend Developer",
		description:
			"Mehul is passionate about creating intuitive and responsive user interfaces. He leads the frontend development efforts at Insure.",
	},
	{
		name: "Jenish Kothari",
		photo: "https://avatars.githubusercontent.com/u/60069162?v=4",
		github: "https://github.com/jenishk20",
		role: "Backend Developer",
		description:
			"Jenish specializes in building robust and scalable backend systems. He ensures that Insure's infrastructure is reliable and efficient.",
	},
	{
		name: "Yash Phalle",
		photo: "https://avatars.githubusercontent.com/u/82230267?v=4",
		github: "https://github.com/yashphalle",
		role: "Full Stack Developer",
		description:
			"Yash bridges the gap between frontend and backend development. He contributes to both areas, ensuring seamless integration.",
	},
];

export default function TeamPage() {
	return (
		<div className="w-screen min-h-screen bg-gray-100">
			<div className="space-y-6 px-16 py-8 flex flex-col items-center justify-center">
				<h1 className="text-5xl font-heading font-bold text-center">
					About Us
				</h1>
				<p className="text-xl text-gray-600 text-center">
					Meet the team behind{" "}
					<span className="text-primary font-semibold">Insure</span>
				</p>

				<div className="bg-white w-full max-w-4xl shadow-lg rounded-lg p-6 space-y-6">
					{TEAM.map((member, index) => (
						<div
							key={index}
							className="flex items-center space-x-6 p-4 border-b border-gray-200"
						>
							<img
								src={member.photo}
								alt={member.name}
								className="h-24 w-24 rounded-full object-cover"
							/>
							<div className="flex-1">
								<h2 className="text-2xl font-semibold">{member.name}</h2>
								<p className="text-gray-600">{member.role}</p>
								<p className="text-gray-800 mt-2">{member.description}</p>
								<Link
									to={member.github}
									className="mt-4 inline-flex items-center text-white bg-zinc-800 hover:bg-zinc-700 rounded-full px-4 py-2"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="h-4 w-4 mr-2" />
									GitHub
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
