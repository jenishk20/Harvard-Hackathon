import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PartnerData {
  amount: number;
  cause: string;
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const fetchBalance = async (userId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/user/getBalance?userId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred while fetching balance");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("An error occurred while fetching balance");
  }
};

const contributeToFund = async (data: PartnerData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/contribute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("An error occurred while contributing to fund");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("An error occurred while contributing to fund");
  }
};

export default function PartnerPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const balanceClient = useQuery({
    queryKey: ["balance", currentUser?.uid],
    queryFn: () => fetchBalance(currentUser?.uid || ""),
    enabled: !!currentUser,
  });

  const contributeMutation = useMutation({
    mutationFn: (data: PartnerData & { userId: string }) =>
      contributeToFund(data),
    onSuccess: () => {
      toast.success("Thank you for your contribution");
      navigate("/home");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const [partnerData, setPartnerData] = useState<PartnerData>({
    amount: 0,
    cause: "",
  });

  const hbarToUsd = (hbar: number) => {
    return hbar * 0.2;
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerData.amount > balanceClient.data?.balance) {
      toast.error("Insufficient balance");
      return;
    }
    contributeMutation.mutate({
      ...partnerData,
      userId: currentUser?.uid || "",
    });
  };

  return (
    <div className="w-screen h-screen bg-primary/10 mt-16">
      <div className="px-12 py-6 space-y-2 w-full">
        <h1 className="text-3xl text-primary font-semibold font-heading">
          Become a partner: A chance to help others
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Join our insurance partnership program and make a difference while
          earning rewards. By contributing to our fund, you help provide
          insurance to those in need and earn a share of the profits generated.
          It&apos;s a simple way to grow your money while creating a positive
          impact. Start today by filling out the form below!
        </p>

        <form onSubmit={handlePartnerSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div>
              <Input
                type="number"
                min={0}
                value={partnerData.amount}
                onChange={(e) =>
                  setPartnerData({
                    ...partnerData,
                    amount: parseInt(e.target.value),
                  })
                }
                placeholder="Enter amount in HBAR"
              />
              <p className="text-muted-foreground text-xs mt-1.5">
                {`Estimated USD: $${hbarToUsd(partnerData.amount)}`}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cause</Label>
            <Textarea
              value={partnerData.cause}
              onChange={(e) =>
                setPartnerData({ ...partnerData, cause: e.target.value })
              }
              rows={4}
              placeholder="Explain to what cause this must go"
            />
          </div>
          <LoadingButton loading={contributeMutation.isPending}>
            Submit
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
