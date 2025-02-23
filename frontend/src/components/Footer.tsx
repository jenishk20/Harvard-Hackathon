import { Link } from "react-router";

export default function Footer(){
  return (
		<div className="w-full h-20 border-l-2 border flex items-center justify-center">
			<p className="text-sm text-muted-foreground ">
				Made using{" "}
				<Link to={"https://hedera.com/"} className="text-primary font-semibold" target="_blank">
					Hedera
				</Link>{" "}
				and <Link to={"https://cloud.google.com/"} className="text-primary font-semibold" target="_blank"> Google Cloud</Link>.{" "}
			</p>
		</div>
	);
}