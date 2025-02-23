import { signOut, User } from "firebase/auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { ArrowRight, LogOut } from "lucide-react";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    title: "Become a Partner Insurer",
    description:
      "Join us in empowering gig workers and low-income individuals by contributing to a fund that makes insurance accessible to all. Your contribution ensures that everyone, regardless of income, can protect their future.",
    group: "Insurances",
    href: "/insurances/partner",
  },
  {
    title: "Flexible Micro-Insurance",
    description:
      "Get the coverage you need without breaking the bank. We offer affordable, bite-sized insurance plans designed specifically for gig workers and low-wage earners. Protect yourself today with plans that fit your budget",
    group: "Insurances",
    href: "/insurances/micro-insurance",
  },
  {
    title: "Quick Claims Assistance",
    description:
      "Get the coverage you need without breaking the bank. MicroShield offers affordable, bite-sized insurance plans designed specifically for gig workers and low-wage earners. Protect yourself today with plans that fit your budget",
    group: "Claims",
    href: "/claims/assistance",
  },
];

export default function Navbar({ currentUser }: { currentUser: User }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/home");
  };
  return (
    <nav className="h-16 w-full fixed top-0 bg-white z-10 text-neutral-800 border-b-2 shadow-sm flex justify-between items-center px-4">
      <div className="flex items-center gap-3">
        <h1
          className="font-extrabold font-heading text-xl cursor-pointer"
          onClick={handleClick}
        >
          InsureMe
        </h1>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Insurances</NavigationMenuTrigger>
              <NavigationMenuContent>
                {FEATURES.filter(
                  (feature) => feature.group === "Insurances"
                ).map((feature, index) => (
                  <>
                    <NavigationMenuLink href={feature.href} key={index}>
                      <div className="w-full h-full md:w-[400px] lg:w-[500px] px-4 py-2 space-y-2">
                        <h1 className="font-semibold flex items-center">
                          {feature.title}{" "}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </h1>
                        <p className="text-muted-foreground text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </NavigationMenuLink>
                    <Separator />
                  </>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Claims</NavigationMenuTrigger>
              <NavigationMenuContent>
                {FEATURES.filter((feature) => feature.group === "Claims").map(
                  (feature, index) => (
                    <>
                      <NavigationMenuLink href={feature.href} key={index}>
                        <div className="w-full h-full md:w-[400px] lg:w-[500px] px-4 py-2 space-y-2">
                          <h1 className="font-semibold flex items-center">
                            {feature.title}{" "}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </h1>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                      <Separator />
                    </>
                  )
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About Us</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="border-2 border-primary">
            <AvatarFallback className="bg-neutral-100 text-primary font-semibold">
              {currentUser.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Button
              variant={"ghost"}
              onClick={() => signOut(auth)}
              className="w-full flex items-center gap-2"
            >
              Log out <LogOut />
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
