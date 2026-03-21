import { useEffect, useRef } from "react";

export const useRenderLog = (name: string): void => {
	const count = useRef(0);

	useEffect(() => {
		count.current += 1;
		console.log(`🔄 ${name} render #${count.current}`);
	});
};
