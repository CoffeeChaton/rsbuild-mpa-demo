// src/pages/game2/components/Toolbar.tsx
import React from "react";
import { Button, Flex } from "@radix-ui/themes";
import { ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";
import { useArsenalActions } from "../context/ArsenalContext";

export const Toolbar: React.FC = () => {
	const { handleImport, handleExport } = useArsenalActions();

	return (
		<Flex gap="3" ml="auto">
			<Button variant="soft" onClick={handleImport}>
				<DownloadIcon /> 從剪貼簿導入
			</Button>

			<Button variant="solid" color="green" onClick={handleExport}>
				<ClipboardCopyIcon /> 導出 TSV
			</Button>
		</Flex>
	);
};
