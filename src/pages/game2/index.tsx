import { Navbar } from "../../common/Navbar";
import { ArsenalLayout } from "./layout/ArsenalLayout";

export const App: React.FC = () => {
	return (
		<>
			{/* Navbar is Top w-100vw && h-[100px] */}
			<Navbar />
			<ArsenalLayout />
		</>
	);
};
