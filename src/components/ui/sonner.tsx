import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useAppTheme } from "@/src/common/context/AppThemeContext";
import { cn } from "@/src/lib/utils";

const SONNER_ICONS = {
	success: <CircleCheckIcon className="size-4" />,
	info: <InfoIcon className="size-4" />,
	warning: <TriangleAlertIcon className="size-4" />,
	error: <OctagonXIcon className="size-4" />,
	loading: <Loader2Icon className="size-4 animate-spin" />,
};

const SONNER_TOAST_OPTIONS = {
	classNames: {
		toast: "cn-toast",
	},
};

export const Toaster = ({ className, ...props }: ToasterProps): React.JSX.Element => {
	const { resolvedAppearance } = useAppTheme();

	return (
		<Sonner
			theme={resolvedAppearance}
			className={cn(
				"toaster group [--normal-bg:var(--popover)] [--normal-text:var(--popover-foreground)] [--normal-border:var(--border)] [--border-radius:var(--radius)]",
				className,
			)}
			icons={SONNER_ICONS}
			toastOptions={SONNER_TOAST_OPTIONS}
			{...props}
		/>
	);
};
