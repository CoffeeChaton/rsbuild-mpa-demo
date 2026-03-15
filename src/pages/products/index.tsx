import type React from "react";
import { Navbar } from "../../common/Navbar";
import { ProductView } from "./ProductView";

export const App: React.FC = () => {
	return (
		<>
			<Navbar />
			<ProductView />
		</>
	);
};
