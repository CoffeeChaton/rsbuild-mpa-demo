import { Navbar } from "../../common/Navbar";
import { HomeView } from "./HomeView";

export const App: React.FC = () => {
	return (
		<>
			<Navbar />
			<HomeView />
		</>
	);
};
