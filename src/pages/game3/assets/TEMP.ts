/**
 * 解析 Arknights 道具 HTML 結構並回傳 TSV 字串
 * @param {string} htmlString - 傳入的 HTML 字串內容
 * @returns {string} - 格式為 "名稱\t數量" 的 TSV 結果
 */
export function parseArknightsItemsToTSV(htmlString: string): string {
	// 建立一個暫時的容器來解析 DOM (適用於 Browser 環境)
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");

	// 選取所有包含道具圖示或數據的容器 (inline-block 且含有相對定位)
	const containers = doc.querySelectorAll('div[style*="position:relative"]');
	const results: string[] = [];

	containers.forEach(container => {
		// 1. 提取名稱：尋找 <a> 標籤的 title
		const anchor = container.querySelector("a[title]");
		const name = anchor ? anchor.getAttribute("title")!.trim() : null;

		// 2. 提取數量：尋找包含數量文字的 span
		// 特徵是它的 style 包含 position:absolute 和 font-weight:bold
		const amountSpan = container.querySelector('span[style*="font-weight:bold"]');
		const amount = amountSpan ? amountSpan.textContent.trim() : "";

		// 如果有名稱，就將其記錄下來 (即使沒有數量，如時裝，則數量為空)
		if (name) {
			// 處理數量中的特殊單位 (例如 '9万' 轉為 90000，視需求而定)
			// 這裡保持原始文字以符合 TSV 輸出需求
			results.push(`${name}\t${amount.replace("万", "0000")}`);
		}
	});

	// 過濾掉重複的名稱（有時一個道具會由多個 div 組成 AST）
	// 並用換行符連接
	return [...new Set(results)].join("\n");
}

// 測試執行
// const tsvOutput = parseArknightsItemsToTSV(yourHtmlString);
// console.log(tsvOutput);

export function TEMP(): void {
	const yourHtmlString = ``;
	const tsvOutput = parseArknightsItemsToTSV(yourHtmlString);
	console.log(tsvOutput);
}
