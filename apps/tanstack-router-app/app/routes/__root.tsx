import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { Theme } from "@radix-ui/themes";
import css from "@radix-ui/themes/styles.css?url";
import {
	Outlet,
	ScrollRestoration,
	createRootRoute,
} from "@tanstack/react-router";
import { Meta, Scripts } from "@tanstack/start";
import type { ReactNode } from "react";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "SPARC Judging App",
			},
		],
	}),
	component: RootComponent
});

function RootComponent() {
	return (
		<RootDocument>
			<Theme accentColor="gold">
				<TooltipProvider delayDuration={100}>
					<Outlet />
				</TooltipProvider>
			</Theme>
		</RootDocument>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<Meta />
				<link rel="stylesheet" href={css} />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}
