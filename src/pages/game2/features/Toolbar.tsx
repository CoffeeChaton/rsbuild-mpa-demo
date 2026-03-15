import React from "react";
import { Button, Flex, Heading } from "@radix-ui/themes";
import { ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";

interface IToolbarProps {
	onImport: () => void;
	onExport: () => void;
}

export const Toolbar: React.FC<IToolbarProps> = ({
	onImport,
	onExport,
}) => {
	return (
		<Flex justify="between" align="end" mb="4">
			<Heading size="7">Arsenal Calculator</Heading>

			<Flex gap="3">
				<Button variant="soft" onClick={onImport}>
					<DownloadIcon /> 從剪貼簿導入
				</Button>

				<Button variant="solid" color="green" onClick={onExport}>
					<ClipboardCopyIcon /> 導出 TSV
				</Button>
			</Flex>
		</Flex>
	);
};
