// src/pages/game2/components/Toolbar.tsx
import React from "react";
import { Button, Flex } from "@radix-ui/themes";
import { CheckIcon, ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";
import { useArsenalActions } from "../context/ArsenalContext";

export const Toolbar: React.FC = () => {
	const { handleImport, handleExport, isCopied } = useArsenalActions();

	return (
		<Flex gap="3" ml="auto">
			<Button variant="soft" size={{ initial: "1", sm: "2" }} onClick={handleImport}>
				<DownloadIcon /> 從剪貼簿導入
			</Button>

			<Button
				variant={isCopied ? "solid" : "solid"}
				color={isCopied ? "green" : "green"}
				size={{ initial: "1", sm: "2" }}
				onClick={handleExport}
			>
				{isCopied ? <CheckIcon /> : <ClipboardCopyIcon />}
				{isCopied ? "已複製" : "導出 TSV"}
			</Button>
		</Flex>
	);
};
