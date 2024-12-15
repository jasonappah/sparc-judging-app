import { Slider, type SliderProps } from "@radix-ui/themes";
import { useId } from "react";

type DualSliderProps = Omit<SliderProps, "id" | "color"> & {
	color1: SliderProps["color"];
	color2: SliderProps["color"];
};

export function DualColorSlider(props: DualSliderProps) {
	const id = useId();
	const styleSheet = `#${CSS.escape(id)} > .rt-SliderTrack {background-color: var(--${props.color2}-9);}`;
	return (
		<>
      <style dangerouslySetInnerHTML={{ __html: styleSheet }} />
			<Slider
				{...{ ...props, color1: undefined, color2: undefined }}
				id={id}
				color={props.color1}
			/>
		</>
	);
}
