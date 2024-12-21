import * as RTooltip from "@radix-ui/react-tooltip";
import { Text } from "@radix-ui/themes";
import type { ReactNode } from "react";

const Tooltip = (props: {
	content: ReactNode;
	children: string;
}) => {
	const { children, content } = props;
	return (
		<RTooltip.Root>
			<RTooltip.Trigger asChild>
				<button
					type="button"
					style={{
						all: "unset",
						textDecoration: "underline",
						textDecorationStyle: "dotted",
					}}
				>
					{children}
				</button>
			</RTooltip.Trigger>
			<RTooltip.Portal>
				<RTooltip.Content
					style={{
						borderRadius: "4px",
						padding: "10px 15px",
						lineHeight: 1,
						backgroundColor: "white",
						boxShadow:
							"hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
						userSelect: "none",
						willChange: "transform, opacity",
						maxWidth: "10rem",
					}}
					sideOffset={5}
				>
					<Text style={{ fontFamily: "sans-serif" }}>{content}</Text>
					<RTooltip.Arrow style={{ fill: "white" }} />
				</RTooltip.Content>
			</RTooltip.Portal>
		</RTooltip.Root>
	);
};

export default Tooltip;
