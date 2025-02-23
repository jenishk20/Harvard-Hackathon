import Aurora from "@/components/Aurora/Aurora";
import { BentoGrid, BentoGridItem } from "@/components/bento-grid";
import { HoverBorderGradient } from "@/components/hover-border-effect";
import { Blocks, Clock, DollarSign, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "Decentralized and Transparent",
    description:
      "Experience the future of insurance with blockchain technology ensuring transparency and security. Our decentralized platform provides a secure and open environment where every transaction is recorded and verifiable, giving you peace of mind and trust in the system.",
    icon: Blocks,
  },
  {
    title: "Community-Driven",
    description:
      "Anyone can contribute or purchase policies, fostering a collaborative insurance ecosystem. By involving the community, we create a more inclusive and resilient insurance model where everyone benefits from shared contributions and risks.",
    icon: Users,
  },
  {
    title: "Affordable Premiums",
    description:
      "Enjoy lower premiums for short-term coverage, making insurance accessible to everyone. Our micro-insurance policies are designed to be affordable and flexible, ensuring that you get the coverage you need without breaking the bank.",
    icon: DollarSign,
  },
  {
    title: "Quick Claims Processing",
    description:
      "Get your claims settled faster with our streamlined, efficient process. We understand the importance of quick resolution, so we've optimized our claims system to ensure you receive your benefits promptly and hassle-free.",
    icon: Clock,
  },
  {
    title: "Global Accessibility",
    description:
      "Use your own currency to purchase or contribute to policies, making our platform accessible worldwide. Our system supports multiple currencies, allowing users from different regions to participate and benefit from our innovative insurance solutions.",
    icon: Globe,
  },
];

export default function LandingPage() {
  return (
    <>
      <div className="w-screen bg-dot-primary min-h-screen flex flex-col items-center justify-start">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.2}
        />
        <div className="space-y-4 px-16 flex items-start justify-center flex-col">
          <h1 className="text-5xl font-heading font-semibold">
            <span className="font-black text-primary ">InsureMe</span> -
            Revolutionizing Insurance with Decentralized Micro Policies
          </h1>
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className=" bg-zinc-100 shadow-md font-medium text-black  flex items-center space-x-2"
          >
            <Link to={"/home"}>Get Started</Link>
          </HoverBorderGradient>
          <BentoGrid>
            {FEATURES.map((feature, i) => (
              <BentoGridItem
                key={i}
                title={feature.title}
                description={feature.description}
                icon={<feature.icon size={28} />}
                className="bg-primary/2.5 shadow-sm"
              />
            ))}
          </BentoGrid>
        </div>
      </div>
    </>
  );
}
