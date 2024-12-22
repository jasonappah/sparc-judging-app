import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	// TODO: I'm 90 percent sure there is a way to do this statically
	loader() {
		throw redirect({
			to: "/app",
		});
	},
});
