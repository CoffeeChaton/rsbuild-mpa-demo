import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import React from "react";

export interface IImportErrorDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	errorMessage: string;
}

export const ImportErrorDialog: React.FC<IImportErrorDialogProps> = ({ open, onOpenChange, errorMessage }) => {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Content className="max-w-100 rounded-3xl border border-red-3">
				<Flex direction="column" align="center" gap="4" p="2">
					<Flex
						align="center"
						justify="center"
						className="w-12 h-12 rounded-full bg-red-2 text-red-9"
					>
						<ExclamationTriangleIcon width="24" height="24" />
					</Flex>

					<Flex direction="column" align="center" gap="2">
						<Dialog.Title size="4" weight="bold" m="0">導入失敗</Dialog.Title>
						<Text size="2" color="gray" align="center">
							{errorMessage || "JSON 格式非法，請確保剪貼簿內容為有效的 JSON 格式物件"}
						</Text>
					</Flex>

					<Flex direction="column" className="w-full bg-gray-2 p-4 rounded-2xl" gap="2">
						<Text size="1" weight="bold" color="gray">建議操作：</Text>
						<ul className="list-disc list-inside text-[10px] text-gray-10 space-y-1">
							<li>確認剪貼簿中是否包含 JSON 格式的數據</li>
							<li>數據應為物件格式，例如 {'{ "30011": 5 }'}</li>
							<li>請勿包含額外的文字、引號或空行</li>
							<li>嘗試先複製結果到記事本檢查，再重新複製</li>
						</ul>
					</Flex>

					<Dialog.Close>
						<Button color="red" variant="soft" className="w-full cursor-pointer">
							我知道了
						</Button>
					</Dialog.Close>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
};
