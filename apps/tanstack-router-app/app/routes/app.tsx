import { For, observer } from "@legendapp/state/react";
import {
	Button,
	Code,
	Flex,
	Grid,
	Heading,
	Table,
	Text,
} from "@radix-ui/themes";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import TimeAgo from "react-timeago";
import { decodeTime } from "ulidx";
import { scoringSheets$ } from "../state/observables";

// TODO: mobile responsiveness (hide the first column on mobile + render a button to open/close it)

const RouteComponent = observer(function RouteComponent() {
	return (
		<Grid columns="3" gap="5">
			<Flex direction="column" gap="3" style={{ borderRadius: "0.5rem" }}>
				{/* TODO: could be cool to have a randomly selected image from (user-submitted?) matches */}
				<Flex
					height="25vh"
					style={{
						// TODO: upload the real image and not a screenshot of it lmao
						backgroundImage:
							"linear-gradient(to bottom, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.6) 100%), url('https://ucarecdn.com/d568aa5f-7b21-48e4-9126-e4e1ed458ae5/CleanShot_20241219_at_1425522x.png')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						padding: "1rem",
						flexDirection: "column",
						justifyContent: "flex-end",
						gap: "0.3rem",
					}}
				>
					<Heading size="7" style={{ color: "white" }}>
						SPARC Judging App
					</Heading>
					<Text size="1" style={{ color: "white", fontStyle: "italic" }}>
						Photo: Comet Robotics, Whopper v. High Rise at Comet Clash 2024
					</Text>
				</Flex>

				<Flex justify={"between"}>
					<Heading size="4">Saved Scoring Sheets</Heading>
					<Button onClick={scoringSheets$.createSheet}>
						<PlusIcon /> Create
					</Button>
				</Flex>

				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeaderCell>Match</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Last Updated</Table.ColumnHeaderCell>
							<Table.ColumnHeaderCell>Action</Table.ColumnHeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<For each={scoringSheets$.sheets} optimized>
							{(sheet) => {
								const updatedAtTs = sheet.updatedAt.get();
								const createdAtTs = decodeTime(sheet.id.get());
								const updatedAt = updatedAtTs ? new Date(updatedAtTs) : null;
								const createdAt = new Date(createdAtTs);
								return (
									<Table.Row key={sheet.id.get()}>
										<Table.Cell>
											{sheet.state.bot1.get()} v {sheet.state.bot2.get()}
										</Table.Cell>
										<Table.Cell>
											<TimeAgo date={createdAt} />
										</Table.Cell>
										<Table.Cell>
											{updatedAt ? <TimeAgo date={updatedAt} /> : "Never"}
										</Table.Cell>
										<Table.Cell>
											<Link to={"/app/local-sheet/$sheetId"} params={{ sheetId: sheet.id.get() }} activeOptions={{includeSearch: false}}>
                        {({ isActive }) => <Button disabled={isActive}>Open</Button>}
											</Link>
										</Table.Cell>
									</Table.Row>
								);
							}}
						</For>
					</Table.Body>
				</Table.Root>
				{scoringSheets$.sheets.get().length === 0 && (
					<Text>To get started, create a scoring sheet!</Text>
				)}

				<Button disabled>Create Live Scoring Session</Button>

				<Text>
					Built by <a href="https://jasonaa.me">Jason Antwi-Appah</a>. Source
					code available on{" "}
					<a href="https://github.com/jasonappah/sparc-judging-app">GitHub</a> -
					v1 still a work in progress :)
				</Text>

				{process.env.VITE_VERCEL && (
					<Text>
						Running{" "}
						<a
							href={`https://github.com/jasonappah/sparc-judging-app/commit/${process.env.VITE_VERCEL_GIT_COMMIT_SHA}`}
						>
							<Code variant="outline">
								{process.env.VITE_VERCEL_GIT_COMMIT_SHA || "N/A"}
							</Code>
						</a>{" "}
						({process.env.VITE_VERCEL_GIT_COMMIT_MESSAGE || "N/A"}).
					</Text>
				)}
			</Flex>
			<Outlet />
		</Grid>
	);
});

export const Route = createFileRoute("/app")({
  component: RouteComponent,
  ssr: false
})
