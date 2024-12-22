import { observable } from "@legendapp/state";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { syncObservable } from "@legendapp/state/sync";
import type { BadgeProps } from "@radix-ui/themes";
import { ulid } from "ulid";

export const damageTiers = {
	A: 1,
	B: 2,
	C: 3,
	D: 4,
	E: 5,
} as const;

export type DamageTier = keyof typeof damageTiers;

export type ScoringSheetState = {
	bot1: string;
	bot2: string;
	bot1Color: BadgeProps["color"];
	bot2Color: BadgeProps["color"];
	engagementScore: number;
	bot1DamageTier: DamageTier | undefined;
	bot2DamageTier: DamageTier | undefined;
};

export const scoringSheets$ = observable({
	sheets: [] as {
		id: string;
		state: ScoringSheetState;
		updatedAt: number | null;
	}[],
	createSheet: () => {
		const id = ulid();
		scoringSheets$.sheets.push({
			id,
			state: {
				bot1: "Robot A",
				bot2: "Robot B",
				bot1Color: "ruby",
				bot2Color: "indigo",
				engagementScore: -1,
				bot1DamageTier: undefined,
				bot2DamageTier: undefined,
			},
			updatedAt: null,
		});
		return id;
	},
});

syncObservable(scoringSheets$, {
	persist: {
		name: "persistKey",
		plugin: ObservablePersistLocalStorage,
	}
});
