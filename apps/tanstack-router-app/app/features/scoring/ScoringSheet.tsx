import {
	Badge,
	type BadgeProps,
	Button,
	Flex,
	Grid,
	Heading,
	RadioGroup,
	Text,
} from "@radix-ui/themes";
import { useCallback, useId } from "react";
import { useMemo, useState } from "react";
import { memo } from "react";
import { DualColorSlider } from "./DualColorSlider";

type ScoringSheetProps = {
	bot1: string;
	bot2: string;
	bot1Color: BadgeProps["color"];
	bot2Color: BadgeProps["color"];
};

type DamageTier = keyof typeof damageTiers;

export function ScoringSheet({
	bot1,
	bot2,
	bot1Color,
	bot2Color,
}: ScoringSheetProps) {
	const bot2Badge = useMemo(
		() => <Badge color={bot2Color}>{bot2}</Badge>,
		[bot2, bot2Color],
	);
	const bot1Badge = useMemo(
		() => <Badge color={bot1Color}>{bot1}</Badge>,
		[bot1, bot1Color],
	);

	const [engagementScoreArray, setEngagementScore] = useState<[number]>([-1]);
	const engagementScore = useMemo(
		() => engagementScoreArray[0],
		[engagementScoreArray],
	);
	const [bot1DamageTier, setBot1DamageTier] = useState<
		DamageTier | undefined
	>();
	const [bot2DamageTier, setBot2DamageTier] = useState<
		DamageTier | undefined
	>();

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
		setBot1DamageTier(undefined);
		setBot2DamageTier(undefined);
	}, []);

	const clearEngagementScore = useCallback(() => {
		setEngagementScore([-1]);
	}, []);

	const clearAll = useCallback(() => {
		clearDamageTiers();
		clearEngagementScore();
	}, [clearDamageTiers, clearEngagementScore]);

	const onEngagementValueChange = useCallback(
		(v: [number]) => setEngagementScore(v),
		[],
	);

	return (
		<form>
			<Flex gap="3" direction="column">
				<Heading size="7">
					{bot1} vs {bot2}
				</Heading>
				<Button onClick={clearAll}>Clear All Scores</Button>
				<Flex justify="between">
					<Heading size="4">Damage</Heading>
					{damageSummary && (
						<Text>
							{damageSummary.bot1DamageScore} - {damageSummary.bot2DamageScore}
						</Text>
					)}
				</Flex>
				<Button variant="outline" onClick={clearDamageTiers}>
					Clear Damage Tiers
				</Button>
				<DamageScoring
					robotName={bot1}
					damageTierValue={bot1DamageTier}
					setDamageTier={setBot1DamageTier}
				/>
				<DamageScoring
					robotName={bot2}
					damageTierValue={bot2DamageTier}
					setDamageTier={setBot2DamageTier}
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
				<Button variant="outline" onClick={clearEngagementScore}>
					Clear Engagement Score
				</Button>
				<Flex gap="1">
					{bot1Badge}
					<DualColorSlider
						color1={bot2Color}
						color2={engagementScore === -1 ? undefined : bot1Color}
						size="3"
						min={1}
						max={6}
						value={engagementScoreArray}
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
}

type DamageScoringProps = {
	robotName: string;
	damageTierValue: DamageTier | undefined;
	setDamageTier: (damageTier: DamageTier) => void;
};

const DamageScoring = memo(function DamageScoring({
	robotName,
	damageTierValue,
	setDamageTier,
}: DamageScoringProps) {
	const onValueChange = useCallback(
		(e: string) => {
			setDamageTier(e as DamageTier);
		},
		[setDamageTier],
	);

	const id = useId();

	return (
		<>
			<Heading size="2">{robotName}</Heading>
			<RadioGroup.Root
				variant="soft"
				onValueChange={onValueChange}
				value={damageTierValue}
			>
				{/* TODO: make this less ugly. maybe copy how the table was styled */}
				<Grid gap="1" columns="3">
					{Object.entries(damageTierExplanations).map(([dt, explanation]) => {
						const k = `${id}-${dt}`;
						return (
							<label htmlFor={k} key={k} style={{ display: "contents" }}>
								<Text>{dt}</Text>
								<Text>{explanation}</Text>
								<RadioGroup.Item
									id={k}
									checked={dt === damageTierValue}
									value={dt}
								/>
							</label>
						);
					})}
				</Grid>
			</RadioGroup.Root>
		</>
	);
});

const damageTiers = {
	A: 1,
	B: 2,
	C: 3,
	D: 4,
	E: 5,
} as const;

const damageTierExplanations: Record<DamageTier, string> = {
	A: "No damage, cosmetic damage, or minor damage to purely ablative armor",
	B: "Significant damage to purely ablative armor, minor damage to mobility systems that do not noticeably hinder movement, damage to structure or armor that does not significantly hinder function.",
	C: "Damage to the mobility system or weapon system(s) that moderately hinders function, or damage that significantly impairs the function of a robot's structure or armor.",
	D: "Significant impairment of drive or weapon systems",
	E: "Significant impairment of drive and weapon systems",
};

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
