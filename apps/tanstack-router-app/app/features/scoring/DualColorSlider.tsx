import { Slider, type SliderProps } from "@radix-ui/themes";
import { memo, useId } from "react";

type DualSliderProps = Omit<SliderProps, "id" | "color"> & {
	color1: SliderProps["color"];
	color2?: SliderProps["color"];
};

export const DualColorSlider = memo(function DualColorSlider(
	props: DualSliderProps,
) {
	const { color1, color2 } = props;
	// This technically works but i'm not happy with the implementation.
	// It should be possible to make this work similarly without needing to generate an id,
	// by adding the secondary color as a data attribute to the slider element, then
	// having a CSS file with a class that goes on the slider element and sets the track color based on the data attribute.
	const id = useId();
	const styleSheet = color2
		? `#${CSS.escape(id)} > .rt-SliderTrack {background-color: var(--${props.color2}-9);}`
		: null;
	return (
		<>
			{/* biome-ignore lint/security/noDangerouslySetInnerHtml: interpolated values in HTML are hardcoded in source code or programmatically generated so should be safe */}
			{styleSheet && <style dangerouslySetInnerHTML={{ __html: styleSheet }} />}
			<Slider
				{...{ ...props, color1: undefined, color2: undefined }}
				id={id}
				color={color1}
			/>
		</>
	);
});
