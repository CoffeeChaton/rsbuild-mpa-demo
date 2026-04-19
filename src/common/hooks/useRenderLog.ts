import { useEffect, useRef } from "react";

export const useRenderLog = (name: string): void => {
	const countRef = useRef(0);

	useEffect(() => {
		countRef.current += 1;
		// oxlint-disable-next-line no-console
		console.log(`🔄 ${name} render #${countRef.current}`);
	});
};
