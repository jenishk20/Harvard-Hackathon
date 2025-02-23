import LoadingButton from "@/components/LoadingButton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import login from "../../assets/images/login.jpg"
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

type LoginData = {
  email: string;
  password: string;
}

export default function LoginPage(){
  const navigate = useNavigate();
	const [loginData, setLoginData] = useState<LoginData>({
		email: "",
		password: "",
	});

	const { isPending, mutate } = useMutation({
		mutationFn: ({ email, password }: LoginData) =>
			signInWithEmailAndPassword(auth, email, password),
		onSuccess: (data) => {
			toast.success(`Welcome back! 🎉 ${data.user.displayName}`);
      navigate("/home");
		},
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => setLoginData({ email: "", password: "" }),
	});

	const handleRegistration = async (e: React.FormEvent) => {
		e.preventDefault();
		await mutate(loginData);
	};

	return (
		<div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2">
			<div className="w-full h-full flex justify-center items-center bg-secondary">
				<Card className="w-full lg:max-w-2xl md:max-w-xl max-w-lg mx-8">
					<CardHeader>
						<h1 className="text-2xl font-bold font-heading">Login</h1>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleRegistration} className="space-y-3">
							<div className="space-y-2">
								<Label>Email</Label>
								<Input
									type="email"
									value={loginData.email}
									onChange={(e) =>
										setLoginData({ ...loginData, email: e.target.value })
									}
									placeholder="jane@mail.com"
								/>
							</div>
							<div className="space-y-2">
								<Label>Password</Label>
								<Input
									type="password"
									value={loginData.password}
									onChange={(e) =>
										setLoginData({
											...loginData,
											password: e.target.value,
										})
									}
									placeholder="Password"
								/>
							</div>
							<LoadingButton loading={isPending} type="submit">
                Login
							</LoadingButton>
						</form>
					</CardContent>
          <CardFooter>
						<p className="text-sm text-muted-foreground">
            New user? <Link to="/register" className="text-primary"> Register</Link>
						</p>
          </CardFooter>
				</Card>
			</div>
			<div className="w-full h-full hidden md:block">
				<img
					src={login}
					alt="login"
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
}