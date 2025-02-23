import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useParams, useLocation } from "react-router";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PLANS } from "@/insurance";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
interface PurchaseDataType {
  date: string;
  duration: number;
}

export default function PurchaseInsurancePage() {
  const navigate = useNavigate();
  const { plan } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [step, setStep] = useState<number>(
    parseInt(queryParams.get("step") || "1")
  );

  const user = getAuth().currentUser;

  const [purchaseData, setPurchaseData] = useState<PurchaseDataType>({
    date: "",
    duration: 0,
  });

  const basePrice =
    PLANS.find((p) => p.plan_name.toLowerCase() === plan?.toLowerCase())
      ?.price || 0;

  const platformFee = 15;

  const calculateInsurance = (dob: string, duration: number) => {
    const ageDifMs = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const ageFactor = 1 + (age - 21) * 0.04; // Age factor for insurance calculation
    return basePrice * ageFactor * duration;
  };

  const insuranceCost = calculateInsurance(
    purchaseData.date,
    purchaseData.duration
  );
  const total = insuranceCost + platformFee;

  const getTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (!plan) {
    navigate("/insurances/micro-insurance");
    return null;
  }

  const isValid = () => {
    if (!purchaseData.date || purchaseData.duration <= 0) return false;
    const dob = new Date(purchaseData.date);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs); // milliseconds from epoch
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 18;
  };

  const executeTransaction = async () => {
    try {
      const data = {
        uid: user?.uid,
        policyId: plan,
        amount: total,
        duration: purchaseData.duration,
      };

      const response = await fetch(`${BASE_URL}/user/investInPolicy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transaction failed");
      }

      toast.success("Policy Purchased ✅", {
        description: "Your policy purchase has been successfully processed.",
      });
      navigate("/insurances/micro-insurance");
    } catch (error) {
      toast.error("Transaction Failed ❌", {
        description: error.message,
      });
    }
  };

  return (
    <div className="w-screen min-h-screen mt-16 flex flex-col">
      <div className="px-12 py-6 space-y-5 w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/insurances/micro-insurance/${plan}?step=1`}
              >
                Add Details
              </BreadcrumbLink>
            </BreadcrumbItem>
            {step == 2 && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/insurances/micro-insurance/${plan}?step=2`}
                  >
                    Checkout
                  </BreadcrumbLink>
                  <BreadcrumbPage></BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-semibold font-heading">Purchase plan</h1>

        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                placeholder="Enter your age"
                value={purchaseData.date}
                onChange={(e) =>
                  setPurchaseData({ ...purchaseData, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                type="number"
                placeholder="Enter duration in months"
                min={1}
                value={purchaseData.duration}
                onChange={(e) =>
                  setPurchaseData({
                    ...purchaseData,
                    duration: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </>
        )}

        {step === 2 && (
          <Card className="space-y-4">
            <CardHeader>
              <CardTitle>Breakdown of {getTitleCase(plan)} plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>Base Price</div>
                <div>
                  {basePrice.toFixed(2)} HBAR X {purchaseData.duration} months
                </div>

                <div>Platform Fee</div>
                <div>{platformFee.toFixed(2)} HBAR</div>

                <div>Premium</div>
                <div>
                  {insuranceCost.toFixed(2) -
                    basePrice.toFixed(2) * purchaseData.duration}{" "}
                  HBAR
                </div>

                <div className="col-span-2 border-t pt-2 font-semibold">
                  Total
                  <span className="float-right">{total.toFixed(2)} HBAR</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex py-4 justify-center items-center gap-2">
          <Button
            variant={"secondary"}
            onClick={() => setStep((prev) => prev - 1)}
            disabled={step == 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft />
            Previous
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={
              step === 2
                ? executeTransaction
                : () => setStep((prev) => prev + 1)
            }
            disabled={step == 3 || !isValid()}
          >
            <ArrowRight />
            {step == 2 ? "Execute Transaction" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
