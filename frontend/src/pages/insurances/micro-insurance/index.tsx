import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideCheckCircle } from "lucide-react";
import { PLANS } from "@/insurance";
import { Link } from "react-router-dom";

const COLOR_MAP: Record<"Bronze" | "Silver" | "Gold", string> = {
  Bronze: "bg-bronze/10",
  Silver: "bg-silver/10",
  Gold: "bg-gold/10",
};

const BORDER_MAP: Record<"Bronze" | "Silver" | "Gold", string> = {
  Bronze: "border-bronze",
  Silver: "border-silver ",
  Gold: "border-gold",
};

export default function MicroInsurancePage() {
  return (
    <div className="w-screen min-h-screen mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 flex flex-col items-center justify-start py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-heading font-bold text-primary">
          Micro Insurance Plans
        </h1>
        <p className="text-base text-muted-foreground">
          Choose the plan that best fits your needs
        </p>
        <p className="text-xs text-muted-foreground">
          Note that the prices are subjected to change based on your previous
          insurance history{" "}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {PLANS.map((plan) => {
          const allFeatures = [
            ...new Set([...PLANS.flatMap((p) => p.additional_features)]),
          ];

          return (
            <Card
              key={plan.plan_name}
              className={cn(
                "w-80 p-2 rounded-lg shadow-lg border",
                COLOR_MAP[plan.plan_name],
                BORDER_MAP[plan.plan_name]
              )}
            >
              <CardHeader className="text-center">
                <div className={cn("mb-4 px-4 py-2 rounded-full font-black")}>
                  {plan.plan_name}
                </div>
                <CardTitle className="text-3xl font-heading mt-2">
                  {plan.price} <span className="text-sm">HBAR/month</span>
                </CardTitle>
                <p className="text-lg font-semibold text-gray-700">
                  {plan.coverage} Coverage
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {allFeatures.map((feature, index) => {
                    const isStrikethrough =
                      !plan.additional_features.includes(feature);
                    return (
                      <li key={index} className="flex items-center space-x-2">
                        <LucideCheckCircle
                          size={20}
                          className="text-green-500"
                        />
                        <span
                          className={
                            isStrikethrough ? "line-through text-gray-400" : ""
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
              <CardFooter className="text-center">
                <Button asChild className={"w-full mt-auto py-3 font-semibold"}>
                  <Link
                    to={`/insurances/micro-insurance/${plan.plan_name.toLowerCase()}`}
                  >
                    Purchase Now
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
