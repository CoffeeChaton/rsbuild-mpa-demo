// src/pages/game2/components/Head.tsx
import React, { memo } from "react";
import { Heading } from "@radix-ui/themes";

export const Head: React.FC = memo(() => {
	return (
		<Heading size={{ initial: "4", sm: "6" }} className="whitespace-nowrap">
			練度規劃表
		</Heading>
	);
});
