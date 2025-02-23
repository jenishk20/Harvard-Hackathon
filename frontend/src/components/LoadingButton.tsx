import { ReactNode } from "react";
import { Button, ButtonProps } from "./ui/button";
import {Loader2}  from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  children: ReactNode;
  loading : boolean;
}

export default function LoadingButton({ loading, children , ...props} : LoadingButtonProps){
  return <Button disabled={loading} {...props}>
    {loading && <Loader2 className="animate-spin h-3 2-3" /> }
    {children}
  </Button>
}