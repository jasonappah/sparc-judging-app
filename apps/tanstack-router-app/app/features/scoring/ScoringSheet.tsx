import {
	type Observable,
	type ObservablePrimitive,
	linked,
} from "@legendapp/state";
import { Reactive, observer, useObserve } from "@legendapp/state/react";
import { useObservable } from "@legendapp/state/react";
import {
	Badge,
	Button,
	Flex,
	Grid,
	Heading,
	RadioGroup,
	Text,
	TextField,
} from "@radix-ui/themes";
import isEqual from "lodash/isEqual";
import { Save, Trash2 } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useId } from "react";
import { useMemo } from "react";
import Tooltip from "../../components/Tooltip";
import type { DamageTier, ScoringSheetState } from "../../state/observables";
import { DualColorSlider } from "./DualColorSlider";
import { useBlocker } from "@tanstack/react-router";

// TODO: why HMR no worky...

export const ScoringSheet = observer(function ScoringSheet({
	savedState$,
}: { savedState$: Observable<ScoringSheetState> }) {
	const localState$: Observable<ScoringSheetState> = useObservable(
		structuredClone(savedState$.get()),
	);
	const engagementScoreArray$ = useObservable<number[]>(
		linked({
			get: () => [localState$.engagementScore.get()],
			set: ({ value }) => {
				localState$.engagementScore.set(value[0]);
			},
		}),
	);

	const unsaved$ = useObservable(() => {
		const localState = localState$.get();
		const savedState = savedState$.get();
		return !isEqual(localState, savedState);
	});

	const bot1Color = localState$.bot1Color.get();
	const bot2Color = localState$.bot2Color.get();
	const engagementScore = localState$.engagementScore.get();
	const bot1DamageTier = localState$.bot1DamageTier.get();
	const bot2DamageTier = localState$.bot2DamageTier.get();

	const bot2Badge = useMemo(
		() => <Badge color={bot2Color}>{localState$.bot2.get()}</Badge>,
		[bot2Color, localState$.bot2.get],
	);
	const bot1Badge = useMemo(
		() => <Badge color={bot1Color}>{localState$.bot1.get()}</Badge>,
		[bot1Color, localState$.bot1.get],
	);

	const engagementScoreSummary = useMemo(() => {
		if (engagementScore === -1) return null;
		const bot1EngagementScore = 5 + 1 - engagementScore;
		const bot2EngagementScore = 5 - bot1EngagementScore;
		const bot1IsUp = bot1EngagementScore > bot2EngagementScore;
		return {
			bot1EngagementScore,
			bot2EngagementScore,
			bot1IsUp,
		};
	}, [engagementScore]);

	const engagementExplanation = useMemo(() => {
		if (!engagementScoreSummary) {
			return null;
		}

		const {
			bot1EngagementScore: bot1Score,
			bot2EngagementScore: bot2Score,
			bot1IsUp,
		} = engagementScoreSummary;

		switch (bot1IsUp ? bot1Score : bot2Score) {
			case 5:
				return (
					<Text>
						{bot1IsUp ? bot1Badge : bot2Badge} spent most or all of the match
						dictating the flow of the fight.
					</Text>
				);
			case 4:
				return (
					<Text>
						{bot1IsUp ? bot1Badge : bot2Badge} spent a large portion of the
						match dictating the flow of the fight.{" "}
						{bot1IsUp ? bot1Badge : bot2Badge} consistently maintained a
						significant edge over {bot1IsUp ? bot2Badge : bot1Badge} on
						directing the flow of the match.
					</Text>
				);
			case 3:
				return (
					<Text>
						{bot1IsUp ? bot1Badge : bot2Badge} spent a slightly larger portion
						of the match dictating the flow of the fight.{" "}
						{bot1IsUp ? bot1Badge : bot2Badge} consistently maintained a slight
						edge over {bot1IsUp ? bot2Badge : bot1Badge} on directing the flow
						of the match.
					</Text>
				);
			default:
				return <Text>uhhhhh we shouldnt be here</Text>;
		}
	}, [engagementScoreSummary, bot1Badge, bot2Badge]);

	const damageSummary = useMemo(() => {
		if (bot1DamageTier === undefined || bot2DamageTier === undefined)
			return null;
		const [bot1DamageScore, bot2DamageScore] =
			damageTiersToScores[bot1DamageTier][bot2DamageTier];
		const bot1IsUp = bot1DamageScore > bot2DamageScore;
		return {
			bot1DamageScore,
			bot2DamageScore,
			bot1IsUp,
		};
	}, [bot1DamageTier, bot2DamageTier]);

	const scoreSummary = useMemo(() => {
		if (!damageSummary || !engagementScoreSummary) return null;
		const { bot1DamageScore, bot2DamageScore } = damageSummary;
		const { bot1EngagementScore, bot2EngagementScore } = engagementScoreSummary;
		const bot1Score = bot1DamageScore + bot1EngagementScore;
		const bot2Score = bot2DamageScore + bot2EngagementScore;
		const bot1IsUp = bot1Score > bot2Score;
		return {
			bot1Score,
			bot2Score,
			bot1IsUp,
		};
	}, [damageSummary, engagementScoreSummary]);

	const clearDamageTiers = useCallback(() => {
		localState$.bot1DamageTier.set(undefined);
		localState$.bot2DamageTier.set(undefined);
	}, [localState$.bot1DamageTier.set, localState$.bot2DamageTier.set]);

	const clearEngagementScore = useCallback(() => {
		localState$.engagementScore.set(-1);
	}, [localState$.engagementScore.set]);

	const clearAll = useCallback(() => {
		clearDamageTiers();
		clearEngagementScore();
	}, [clearDamageTiers, clearEngagementScore]);

	const onEngagementValueChange = useCallback(
		(v: [number]) => {
			engagementScoreArray$.set(v);
		},
		[engagementScoreArray$.set],
	);

	const save = useCallback(() => {
		savedState$.set(structuredClone(localState$.get()));
	}, [localState$.get, savedState$.set]);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key.toLowerCase()) {
					case "s":
						e.preventDefault();
						save();
						break;
				}
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [save]);
	
	useBlocker({
    shouldBlockFn: () => {
      if (!unsaved$.get()) return false

      const shouldLeave = confirm('Are you sure you want to leave? You have unsaved changes.')
      return !shouldLeave
    },
  })

	return (
		<form>
			<Flex gap="3" direction="column">
				<Flex gap="1" justify="center" align="center">
					<Button
						type="button"
						onClick={save}
						disabled={unsaved$.get() === false}
					>
						<Save size={16} />
						Save
					</Button>
				</Flex>
				<Flex
					gap="1"
					justify="between"
					align="center"
					style={{ width: "100%" }}
				>
					<TextField.Root
						placeholder="Robot 1"
						variant="soft"
						color={bot1Color}
						value={localState$.bot1.get()}
						onChange={(e) => localState$.bot1.set(e.target.value)}
					/>
					vs
					<TextField.Root
						placeholder="Robot 2"
						variant="soft"
						color={bot2Color}
						value={localState$.bot2.get()}
						onChange={(e) => localState$.bot2.set(e.target.value)}
					/>
				</Flex>
				<Button type="button" onClick={clearAll}>
					<Trash2 size={16} />
					Clear All Sections
				</Button>
				<Flex justify="between">
					<Heading size="4">Damage</Heading>
					{damageSummary && (
						<Text>
							{damageSummary.bot1DamageScore} - {damageSummary.bot2DamageScore}
						</Text>
					)}
				</Flex>
				<Button type="button" variant="outline" onClick={clearDamageTiers}>
					<Trash2 size={16} />
					Clear Damage Score
				</Button>
				<DamageScoring
					robotName={localState$.bot1.get()}
					damageTier={localState$.bot1DamageTier}
				/>
				<DamageScoring
					robotName={localState$.bot2.get()}
					damageTier={localState$.bot2DamageTier}
				/>
				<Flex justify="between">
					<Heading size="4">Engagement</Heading>
					{engagementScoreSummary && (
						<Text>
							{engagementScoreSummary.bot1EngagementScore} -{" "}
							{engagementScoreSummary.bot2EngagementScore}
						</Text>
					)}
				</Flex>
				<Button type="button" variant="outline" onClick={clearEngagementScore}>
					<Trash2 size={16} />
					Clear Engagement Score
				</Button>
				<Flex gap="1" justify="center" align="center">
					{bot1Badge}
					<DualColorSlider
						color1={bot2Color}
						color2={engagementScore === -1 ? undefined : bot1Color}
						size="3"
						min={1}
						max={6}
						value={engagementScoreArray$.get()}
						onValueChange={onEngagementValueChange}
					/>
					{bot2Badge}
				</Flex>
				{engagementExplanation}
				{scoreSummary && (
					<>
						<Heading size="4">Summary</Heading>
						{scoreSummary ? (
							<Text>
								{bot1Badge} {scoreSummary.bot1Score} - {scoreSummary.bot2Score}{" "}
								{bot2Badge}
							</Text>
						) : (
							<Text>&nbsp;</Text>
						)}
					</>
				)}
			</Flex>
		</form>
	);
});

type DamageScoringProps = {
	robotName: string;
	damageTier: ObservablePrimitive<DamageTier | undefined>;
};

function DamageScoring({ robotName, damageTier }: DamageScoringProps) {
	const onValueChange = useCallback(
		(e: string) => {
			damageTier.set(e as DamageTier);
		},
		[damageTier],
	);
	const id = useId();

	const damageTierExplanations: Record<DamageTier, ReactNode> = {
		A: (
			<Text>
				No damage, cosmetic damage, or minor damage to{" "}
				<Tooltip content={definitions["purely ablative armor"]}>
					purely ablative armor
				</Tooltip>
			</Text>
		),
		B: (
			<Text>
				Significant damage to{" "}
				<Tooltip content={definitions["purely ablative armor"]}>
					purely ablative armor
				</Tooltip>
				, minor damage to mobility systems that do not noticeably hinder
				movement, damage to structure or armor that does not significantly
				hinder function.
			</Text>
		),
		C: "Damage to the mobility system or weapon system(s) that moderately hinders function, or damage that significantly impairs the function of a robot's structure or armor.",
		D: (
			<Text>
				Significant impairment of drive{" "}
				<span style={{ fontWeight: "bold" }}>or</span> weapon systems
			</Text>
		),
		E: (
			<Text>
				Significant impairment of drive{" "}
				<span style={{ fontWeight: "bold" }}>and</span> weapon systems
			</Text>
		),
	};

	return (
		<>
			<Heading size="2">{robotName}</Heading>
			<RadioGroup.Root
				variant="soft"
				onValueChange={onValueChange}
				value={damageTier.get()}
			>
				<Grid gap="1" columns="3rem 1fr 3rem">
					{Object.entries(damageTierExplanations).map(([dt, explanation]) => {
						const k = `${id}-${dt}`;
						return (
							<label htmlFor={k} key={k} style={{ display: "contents" }}>
								<Text>{dt}</Text>
								{explanation}
								<RadioGroup.Item
									id={k}
									checked={dt === damageTier.get()}
									value={dt}
								/>
							</label>
						);
					})}
				</Grid>
			</RadioGroup.Root>
		</>
	);
}

type Scores = [number, number];

// Usage: `const [bot1Score, bot2Score] = damageTiersToScores[bot1DamageTier][bot2DamageTier]`
// Example: If bot1 got an A and bot 2 got a B, get their scores with ``damageTiersToScores['A']['B']
const damageTiersToScores: Record<DamageTier, Record<DamageTier, Scores>> = {
	A: {
		A: [2, 2],
		B: [2, 2],
		C: [3, 1],
		D: [4, 0],
		E: [4, 0],
	},
	B: {
		A: [2, 2],
		B: [2, 2],
		C: [2, 2],
		D: [3, 1],
		E: [4, 0],
	},
	C: {
		A: [1, 3],
		B: [2, 2],
		C: [2, 2],
		D: [2, 2],
		E: [3, 1],
	},
	D: {
		A: [0, 4],
		B: [1, 3],
		C: [2, 2],
		D: [2, 2],
		E: [2, 2],
	},
	E: {
		A: [0, 4],
		B: [0, 4],
		C: [1, 3],
		D: [2, 2],
		E: [2, 2],
	},
} as const;

const definitions = {
	"purely ablative armor":
		"To qualify as “purely ablative” armor an element must be clearly designed to serve the sole purpose of being damaged or destroyed to absorb damage to protect the main structure of the robot.",
};
