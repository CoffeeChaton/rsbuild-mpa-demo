import * as React from "react";
import { Flex, Heading, Text } from "@radix-ui/themes";

export const AppHeader: React.FC = () => {
	return (
		<header
			style={{
				backgroundColor: "var(--slate-1)",
				borderBottom: "1px solid var(--slate-6)",
			}}
			className="px-6 py-4 sticky top-0 z-50 bg-opacity-80"
		>
			<Flex align="center" justify="between">
				<Flex align="baseline" gap="3">
					<Heading
						size={{ initial: "4", sm: "6" }}
						className="tracking-tight font-bold"
					>
						練度規劃表
					</Heading>

					<Text
						size="1"
						style={{
							color: "var(--slate-10)",
							letterSpacing: "0.15em",
						}}
						className="uppercase font-medium"
					>
						Arknights Planner
					</Text>
				</Flex>
			</Flex>
		</header>
	);
};
