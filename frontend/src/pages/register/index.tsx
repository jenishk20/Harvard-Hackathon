import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import register from "../../assets/images/register.jpg"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";
import { Link, useNavigate } from "react-router-dom";

type RegisterData = {
	email: string;
	password: string;
}

export default function RegisterPage(){
	const navigate = useNavigate();
	const [registerData, setRegisterData] = useState<RegisterData>({email : "", password : ""});

	const {isPending , mutate} = useMutation({
		mutationFn: ({ email, password }: RegisterData) => createUserWithEmailAndPassword(auth, email, password),
		onSuccess : () => {
			toast.success("User registered successfully");
			navigate("/login");
		},
		onError : (error) => {
			toast.error(error.message);
		}, onSettled : () => setRegisterData({email : "", password : ""})

	})


	const handleRegistration = async (e : React.FormEvent) => {
		e.preventDefault();
		await mutate(registerData);
	}

  return (
		<div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
			<div className="w-full h-full flex justify-center items-center bg-secondary">
				<Card className="w-full lg:max-w-2xl md:max-w-xl max-w-lg mx-2">
					<CardHeader >
						<h1 className="text-2xl font-bold">Register</h1>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleRegistration} className="space-y-3">
							<div className="space-y-2">
								<Label>Email</Label>
								<Input type="email" value={registerData.email} onChange={(e) => setRegisterData({...registerData , email : e.target.value}) } placeholder="jane@mail.com"/>
							</div>
							<div className="space-y-2">
								<Label>Password</Label>
								<Input type="password" value={registerData.password} onChange={(e) => setRegisterData({...registerData , password : e.target.value}) } placeholder="Password"/>
							</div>
							<LoadingButton loading={isPending} type="submit">
								Register
							</LoadingButton>
						</form>
					</CardContent>
					<CardFooter>
						<p>Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
					</CardFooter>
				</Card>
			</div>
			<div className="w-full h-full hidden md:block">
				<img src={register} alt="register" className="w-full h-full object-cover"/>
			</div>
		</div>
	);

}