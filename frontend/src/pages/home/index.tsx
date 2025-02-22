import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function HomePage(){
  const { currentUser } = useAuth();
    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome {currentUser?.uid} - {currentUser?.email}</p>
            <Button onClick={() => signOut(auth)} >Signout</Button>
        </div>
    )
}