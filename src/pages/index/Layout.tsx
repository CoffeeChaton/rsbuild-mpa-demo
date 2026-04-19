import { useLocation } from "react-router";
import { getPageInfoByPathname } from "../../common/config/pages.runtime";
import { type ReactNode, useEffect } from "react";
// oxlint-disable-next-line import/no-unassigned-import
import "@radix-ui/themes/styles.css";
import { Navbar } from "../../common/Navbar";
import { Toaster } from "../../components/ui/sonner";

const MetaUpdater: React.FC = () => {
	const location = useLocation();

	useEffect(() => {
		const pageInfo = getPageInfoByPathname(location.pathname);

		document.title = pageInfo.title;

		const metaDesc = document.querySelector('meta[name="description"]');
		if (metaDesc instanceof HTMLMetaElement) {
			metaDesc.content = pageInfo.description;
		}

		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle instanceof HTMLMetaElement) {
			ogTitle.content = pageInfo.title;
		}
	}, [location]);

	return null;
};

export interface ILayoutProps {
	children: ReactNode;
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => (
	<div className="bg-(--gray-1) min-h-screen">
		<MetaUpdater />
		<Navbar />
		{children}
		<Toaster />
	</div>
);
