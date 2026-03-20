import { AppHeader } from "./components/app-header";
import { AppFooter } from "./components/app-footer";
import { OperatorTable } from "./components/operator-table";
import { ArsenalProvider } from "../game2/context/ArsenalContext";
import { LeftSidebar } from "./components/left-sidebar";
import { BottomDiagnosticPanel } from "./components/bottom-diagnostic-panel";

export const App: React.FC = () => {
	return (
		<div className="flex flex-col overflow-hidden" style={{ height: `calc(100vh - 50px)` }}>
			<AppHeader />
			<ArsenalProvider>
				<div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
					{/* Left Sidebar - Basic Info (Desktop: horizontal collapsible, Mobile: vertical) */}
					<LeftSidebar />

					{/* Main Content Area */}
					<div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
						{/* Operator Table */}
						<div className="flex-1 min-h-0 bg-card overflow-hidden">
							<OperatorTable />
						</div>

						{/* Bottom Diagnostic Panel */}
						<BottomDiagnosticPanel />
					</div>
				</div>
			</ArsenalProvider>

			<AppFooter />
		</div>
	);
};
