import { createFileRoute } from "@tanstack/react-router";
import { ScoringSheet } from "../features/scoring/ScoringSheet";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<ScoringSheet
			bot1="Oblivion"
			bot2="Impulse"
			bot1Color="pink"
			bot2Color="indigo"
		/>
	);
}
