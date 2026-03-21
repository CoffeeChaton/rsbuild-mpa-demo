import { type FC, memo, useCallback } from "react";
import { Cross1Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import type { IAccountProfile, TAccountId } from "../types";

const ProfileRow: FC<{
	profile: IAccountProfile,
	index: number,
	canDelete: boolean,
	onUpdate: (id: TAccountId, name: string, server: string) => void,
	onDelete: (id: TAccountId) => void,
}> = memo(({ profile, index, canDelete, onUpdate, onDelete }) => {
	const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onUpdate(profile.id, e.target.value, profile.server || "CN");
	}, [onUpdate, profile.id, profile.server]);

	const handleDelete = useCallback(() => {
		onDelete(profile.id);
	}, [onDelete, profile.id]);

	return (
		<div className="group flex items-center gap-4 p-4 bg-slate-50/50 hover:bg-white hover:shadow-md border border-slate-100 hover:border-blue-100 rounded-2xl transition-all duration-200">
			<div className="shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-300 group-hover:text-blue-500 group-hover:border-blue-500 transition-colors">
				{index + 1}
			</div>

			<div className="flex-1 flex flex-col gap-1">
				<input
					value={profile.accountName}
					onChange={handleNameChange}
					className="bg-transparent text-sm font-bold text-slate-700 outline-none focus:text-blue-600 placeholder:text-slate-300"
					placeholder="帳號名稱..."
				/>
				<div className="flex items-center gap-2">
					<span className="text-[9px] font-black text-slate-400 uppercase">Server</span>
					<div className="flex items-center p-1 bg-slate-100 rounded-lg">
						{["CN", "TW", "US"].map((srv) => (
							<ServerButton
								key={srv}
								server={srv}
								active={profile.server === srv}
								onClick={onUpdate}
								profileId={profile.id}
								profileName={profile.accountName}
							/>
						))}
					</div>
				</div>
			</div>

			<button
				onClick={handleDelete}
				disabled={!canDelete}
				className="text-slate-200 hover:text-rose-500 disabled:opacity-0 transition-all p-2 hover:bg-rose-50 rounded-xl"
				title="刪除帳號"
			>
				<TrashIcon className="w-4 h-4" />
			</button>
		</div>
	);
});

ProfileRow.displayName = "ProfileRow";

const ServerButton: FC<{
	server: string,
	active: boolean,
	onClick: (id: TAccountId, name: string, server: string) => void,
	profileId: TAccountId,
	profileName: string,
}> = memo(({ server, active, onClick, profileId, profileName }) => {
	const handleClick = useCallback(() => {
		onClick(profileId, profileName, server);
	}, [onClick, profileId, profileName, server]);

	return (
		<button
			onClick={handleClick}
			className={`px-2 py-1 text-[9px] font-black rounded-md transition-all ${
				active
					? "bg-white text-blue-600 shadow-sm"
					: "text-slate-400 hover:text-slate-600"
			}`}
		>
			{server}
		</button>
	);
});

ServerButton.displayName = "ServerButton";

export const AccountManagerModal: FC<{
	profiles: IAccountProfile[],
	onClose: () => void,
	onAdd: (name: string) => void,
	onDelete: (id: TAccountId) => void,
	onUpdate: (id: TAccountId, name: string, server: string) => void,
}> = ({ profiles, onClose, onAdd, onDelete, onUpdate }) => {
	const handleAdd = useCallback(() => {
		onAdd("新帳號");
	}, [onAdd]);

	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
			{/* 遮罩層：強化毛玻璃效果 */}
			<div
				className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
				onClick={onClose}
			/>

			{/* 彈窗主體：大圓角與柔和陰影 */}
			<div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
				{/* Header：清爽簡約 */}
				<div className="flex justify-between items-center px-8 py-6 border-b border-slate-50">
					<div>
						<h2 className="text-lg font-black text-slate-800 tracking-tight">帳號管理</h2>
						<p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Account Profiles</p>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all active:scale-90"
					>
						<Cross1Icon className="w-5 h-5" />
					</button>
				</div>

				{/* 帳號列表：卡片式佈局 */}
				<div className="max-h-112.5 overflow-y-auto p-6 space-y-3 custom-scrollbar">
					{profiles.map((p, index) => (
						<ProfileRow
							key={p.id}
							profile={p}
							index={index}
							canDelete={profiles.length > 1}
							onUpdate={onUpdate}
							onDelete={onDelete}
						/>
					))}

					{profiles.length === 0 && (
						<div className="text-center py-10 text-slate-400 text-xs italic">
							目前沒有帳號數據
						</div>
					)}
				</div>

				{/* Footer：高對比的操作按鈕 */}
				<div className="p-6 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center">
					<p className="text-[10px] font-medium text-slate-400">
						共 {profiles.length} 個配置存檔
					</p>
					<button
						onClick={handleAdd}
						className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-200"
					>
						<PlusIcon className="w-4 h-4" /> 添加新帳號
					</button>
				</div>
			</div>
		</div>
	);
};
