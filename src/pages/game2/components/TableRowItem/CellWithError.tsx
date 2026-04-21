import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Box, Flex, HoverCard, Text } from "@radix-ui/themes";
import { TableCell } from "@/src/components/ui/table";
import { cn } from "@/src/lib/utils";

export interface CellWithErrorProps {
	errorMessages: (string | undefined)[];
	children: React.ReactNode;
}

export const CellWithError: React.FC<CellWithErrorProps> = ({ errorMessages, children }) => {
	const activeError = errorMessages.filter(msg => !!msg);
	const hasError = activeError.length > 0;

	return (
		<TableCell className="relative group p-2">
			<Flex gap="2" className={cn(hasError && "pr-6")}>
				{children}
			</Flex>
			{hasError && (
				<Box className="absolute right-2 top-1/2 -translate-y-1/2">
					<HoverCard.Root openDelay={0} closeDelay={0}>
						<HoverCard.Trigger>
							<div className="cursor-help p-1 hover:scale-110 transition-transform">
								<ExclamationTriangleIcon color="red" className="animate-pulse" />
							</div>
						</HoverCard.Trigger>
						<HoverCard.Content size="1" side="top" align="end" className="z-[100] bg-red-50 border-red-200 p-2 shadow-2xl">
							<Flex gap="2">
								<ExclamationTriangleIcon className="text-red-600 shrink-0" />
								<Text size="1" weight="bold" className="text-red-700 whitespace-nowrap">
									{activeError.join("\n,")}
								</Text>
							</Flex>
						</HoverCard.Content>
					</HoverCard.Root>
				</Box>
			)}
		</TableCell>
	);
};
