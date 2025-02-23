import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import register from "../../assets/images/register.jpg";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";
import { Link, useNavigate } from "react-router-dom";


type RegisterData = {
	email: string;
	password: string;
	name?: string;
};

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const createWallet = async (userId: string) => {
	const response = await fetch(`${BASE_URL}/user/createWallet`, {
		method: "POST",
		headers : {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ userId }),
	});
	return response.json();
};

export default function RegisterPage() {
	const navigate = useNavigate();
	const [registerData, setRegisterData] = useState<RegisterData>({
		email: "",
		password: "",
	});

	const createWalletMutation = useMutation<any, unknown, { userId: string }>({
		mutationFn: ({ userId }) => createWallet(userId),
		onError : () => {
			toast.error("Failed to create wallet");
		} 
	});

	const { isPending, mutate } = useMutation({
		mutationFn: ({ email, password }: RegisterData) =>
			createUserWithEmailAndPassword(auth, email, password),
		onSuccess: (data) => {
			toast.success("User registered successfully");
			updateProfile(data.user, { displayName : registerData.name });
			createWalletMutation.mutate({ userId: data.user.uid});
			navigate("/login");
		},
		onError: (error) => {
			toast.error(error.message);
		},
		onSettled: () => setRegisterData({ email: "", password: "" }),
	});

	const handleRegistration = async (e: React.FormEvent) => {
		e.preventDefault();
		await mutate(registerData);
	};

	return (
		<div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
			<div className="w-full h-full flex justify-center items-center bg-secondary">
				<Card className="w-full lg:max-w-2xl md:max-w-xl max-w-lg mx-8 ">
					<CardHeader>
						<h1 className="text-2xl font-bold font-heading">Register</h1>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleRegistration} className="space-y-3">
							<div className="space-y-2">
								<Label>Name</Label>
								<Input
									type="text"
									value={registerData.name}
									onChange={(e) =>
										setRegisterData({ ...registerData, name: e.target.value })
									}
									placeholder="Jane Doe"
								/>
							</div>
							<div className="space-y-2">
								<Label>Email</Label>
								<Input
									type="email"
									value={registerData.email}
									onChange={(e) =>
										setRegisterData({ ...registerData, email: e.target.value })
									}
									placeholder="jane@mail.com"
								/>
							</div>
							<div className="space-y-2">
								<Label>Password</Label>
								<Input
									type="password"
									value={registerData.password}
									onChange={(e) =>
										setRegisterData({
											...registerData,
											password: e.target.value,
										})
									}
									placeholder="Password"
								/>
							</div>
							<LoadingButton loading={isPending} type="submit">
								Register
							</LoadingButton>
						</form>
					</CardContent>
					<CardFooter>
						<p className="text-muted-foreground text-sm">
							Already have an account?{" "}
							<Link to="/login" className="text-primary">
								Login
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
			<div className="w-full h-full hidden md:block">
				<img
					src={register}
					alt="register"
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
}
