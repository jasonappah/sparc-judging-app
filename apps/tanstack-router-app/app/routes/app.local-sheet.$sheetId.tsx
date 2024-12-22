import { Button, Flex } from "@radix-ui/themes";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { X } from "lucide-react";
import { ScoringSheet } from "../features/scoring/ScoringSheet";
import { scoringSheets$ } from "../state/observables";

export const Route = createFileRoute("/app/local-sheet/$sheetId")({
	component: RouteComponent,
});

// TODO: i only want to run this on the client. stop trying to ssr stuff

function RouteComponent() {
	const data = Route.useParams();
	const sheetId = data.sheetId;
	const sheet = scoringSheets$.sheets.find(
		(sheet) => sheet.id.get() === sheetId,
	);
	if (!sheet) {
		return <div>Sheet not found</div>;
	}
	return (
		<Flex direction={"column"} gap="4" align="center">
			<Link to="/app">
				<Button>
					<X />
					Close
				</Button>
			</Link>
			<ScoringSheet savedState$={sheet.state} />
		</Flex>
	);
}
