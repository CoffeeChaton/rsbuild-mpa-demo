import { useCallback, useState } from "react";
import type { TEditor } from "../type";

export function useEditor(initial?: Partial<TEditor>) {
  const [editor, setEditor] = useState<TEditor>({
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
    // setEditor,
    setEditorOpen,
    updateEditor,
  };
}
