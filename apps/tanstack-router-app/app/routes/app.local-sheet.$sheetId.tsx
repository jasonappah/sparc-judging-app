import { useObserve } from "@legendapp/state/react";
import { Button, Flex } from "@radix-ui/themes";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import isEqual from "lodash/isEqual";
import { X } from "lucide-react";
import { ScoringSheet } from "../features/scoring/ScoringSheet";
import { scoringSheets$ } from "../state/observables";

export const Route = createFileRoute("/app/local-sheet/$sheetId")({
	component: RouteComponent,
	ssr: false
});


function RouteComponent() {
  // TODO: idk what the best way to do this is, but we basically need to watch the sheetId param and get a new sheet$ when it changes
	const data = Route.useParams();
	const sheetId = data.sheetId;
	const sheet$ = scoringSheets$.sheets.find(
		(sheet) => sheet.id.get() === sheetId,
	);
	useObserve(sheet$, (e) => {
		if (!sheet$) return;
		if (e.previous && e.value) {
			const changed = isEqual(e.previous.state, e.value.state);
			if (changed) sheet$.updatedAt.set(Date.now());
		}
	});

	if (!sheet$) {
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
			<ScoringSheet savedState$={sheet$.state} />
		</Flex>
	);
}
