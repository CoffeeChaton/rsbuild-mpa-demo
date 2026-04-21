import { useCallback, useState } from "react";
import type { TEditor } from "../type";

export type UseEditor = (initial?: Partial<TEditor>) => {
	editor: TEditor,
	setEditorOpen: (open: boolean, data?: Partial<TEditor>) => void,
	updateEditor: (data: Partial<TEditor>) => void,
};

export const useEditor: UseEditor = (initial) => {
	const [editor, setEditor] = useState({
		open: false,
		targetId: null,
		title: "",
		content: "",
		...initial,
	});

	// 統一開關方法
	const setEditorOpen = useCallback(
		(open: boolean, data?: Partial<TEditor>) => {
			setEditor(prev => ({
				...prev,
				...data,
				open,
			}));
		},
		[],
	);

	const updateEditor = useCallback((data: Partial<TEditor>) => {
		setEditor(prev => ({ ...prev, ...data }));
	}, []);

	return {
		editor,
		setEditorOpen,
		updateEditor,
	};
};
