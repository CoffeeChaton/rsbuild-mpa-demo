import { Progress as ProgressPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/src/lib/utils";

function Progress({
	className,
	value,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>): React.JSX.Element {
	const progressTransformStyle = React.useMemo(
		() => ({ transform: `translateX(-${100 - (value ?? 0)}%)` }),
		[value],
	);

	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				"relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="size-full flex-1 bg-primary transition-all"
				style={progressTransformStyle}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
