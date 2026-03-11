// ResourceManager.tsx
import { useState, useEffect, useMemo } from "react";
import { useAccountManager } from "./AccountLogic";
import { DashboardHeader } from "./components/DashboardHeader";
import { GroupRow } from "./components/GroupRow";
import { SummarySection } from "./components/SummarySection";
import { JsonConfigModal } from "./components/JsonConfigModal";
import { parseArknightsItemsToTSV } from "./TEMP";
import { Navbar } from "../../common/Navbar";

const html_Str = `
<td><div style="display: inline-block; position: relative; width: 48px; height: 48px;"><div><span typeof="mw:File"><a href="/w/%E4%B8%AA%E4%BA%BA%E5%90%8D%E7%89%87%E5%A4%B4%E5%83%8F%E4%B8%80%E8%A7%88#模拟完成！" title="个人名片头像一览"><img src="https://media.prts.wiki/thumb/0/0b/Avatar%E6%A1%86.png/48px-Avatar%E6%A1%86.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/0/0b/Avatar%E6%A1%86.png/72px-Avatar%E6%A1%86.png 1.5x, https://media.prts.wiki/thumb/0/0b/Avatar%E6%A1%86.png/96px-Avatar%E6%A1%86.png 2x"></a></span></div><div style="position: absolute; top: 9px; left: 9px;"><span typeof="mw:File"><a href="/w/%E4%B8%AA%E4%BA%BA%E5%90%8D%E7%89%87%E5%A4%B4%E5%83%8F%E4%B8%80%E8%A7%88#模拟完成！" title="个人名片头像一览"><img src="https://media.prts.wiki/thumb/4/45/Avatar_activity_AC_1.png/31px-Avatar_activity_AC_1.png" decoding="async" loading="lazy" width="31" height="31" class="mw-file-element" srcset="https://media.prts.wiki/thumb/4/45/Avatar_activity_AC_1.png/47px-Avatar_activity_AC_1.png 1.5x, https://media.prts.wiki/thumb/4/45/Avatar_activity_AC_1.png/62px-Avatar_activity_AC_1.png 2x"></a></span></div></div><div style="display: inline-block; position: relative; width: 48px; height: 48px;"><div><span typeof="mw:File"><a href="/w/%E4%BC%91%E8%B0%9F%E6%96%AF" title="休谟斯"><img src="https://media.prts.wiki/thumb/0/05/Skin%E6%A1%86.png/48px-Skin%E6%A1%86.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/0/05/Skin%E6%A1%86.png/72px-Skin%E6%A1%86.png 1.5x, https://media.prts.wiki/thumb/0/05/Skin%E6%A1%86.png/96px-Skin%E6%A1%86.png 2x"></a></span></div><div style="position: absolute; top: 8px; left: 10px;"><span typeof="mw:File"><a href="/w/%E4%BC%91%E8%B0%9F%E6%96%AF" title="休谟斯"><img src="https://media.prts.wiki/thumb/e/ed/%E5%A4%B4%E5%83%8F_%E4%BC%91%E8%B0%9F%E6%96%AF_skin1.png/27px-%E5%A4%B4%E5%83%8F_%E4%BC%91%E8%B0%9F%E6%96%AF_skin1.png" decoding="async" loading="lazy" width="27" height="27" class="mw-file-element" srcset="https://media.prts.wiki/thumb/e/ed/%E5%A4%B4%E5%83%8F_%E4%BC%91%E8%B0%9F%E6%96%AF_skin1.png/41px-%E5%A4%B4%E5%83%8F_%E4%BC%91%E8%B0%9F%E6%96%AF_skin1.png 1.5x, https://media.prts.wiki/thumb/e/ed/%E5%A4%B4%E5%83%8F_%E4%BC%91%E8%B0%9F%E6%96%AF_skin1.png/54px-%E5%A4%B4%E5%83%8F_%E4%BC%91%E8%B0%9F%E6%96%AF_skin1.png 2x"></a></span></div></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E9%BE%99%E9%97%A8%E5%B8%81" title="龙门币"><img src="https://media.prts.wiki/thumb/6/6a/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%BE%99%E9%97%A8%E5%B8%81.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%BE%99%E9%97%A8%E5%B8%81.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/6/6a/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%BE%99%E9%97%A8%E5%B8%81.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%BE%99%E9%97%A8%E5%B8%81.png 1.5x, https://media.prts.wiki/thumb/6/6a/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%BE%99%E9%97%A8%E5%B8%81.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%BE%99%E9%97%A8%E5%B8%81.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">10万</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95" title="高级作战记录"><img src="https://media.prts.wiki/thumb/6/66/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/6/66/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png 1.5x, https://media.prts.wiki/thumb/6/66/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E9%AB%98%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">32</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E4%B8%AD%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95" title="中级作战记录"><img src="https://media.prts.wiki/thumb/4/41/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E4%B8%AD%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E4%B8%AD%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/4/41/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E4%B8%AD%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E4%B8%AD%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png 1.5x, https://media.prts.wiki/thumb/4/41/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E4%B8%AD%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E4%B8%AD%E7%BA%A7%E4%BD%9C%E6%88%98%E8%AE%B0%E5%BD%95.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">75</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B73" title="技巧概要·卷3"><img src="https://media.prts.wiki/thumb/0/0e/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B73.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B73.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/0/0e/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B73.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B73.png 1.5x, https://media.prts.wiki/thumb/0/0e/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B73.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B73.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">20</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B72" title="技巧概要·卷2"><img src="https://media.prts.wiki/thumb/8/88/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B72.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B72.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/8/88/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B72.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B72.png 1.5x, https://media.prts.wiki/thumb/8/88/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B72.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%8A%80%E5%B7%A7%E6%A6%82%E8%A6%81%C2%B7%E5%8D%B72.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">50</span></div><br><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E6%A8%A1%E7%BB%84%E6%95%B0%E6%8D%AE%E5%9D%97" title="模组数据块"><img src="https://media.prts.wiki/thumb/b/b6/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%A8%A1%E7%BB%84%E6%95%B0%E6%8D%AE%E5%9D%97.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%A8%A1%E7%BB%84%E6%95%B0%E6%8D%AE%E5%9D%97.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/b/b6/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%A8%A1%E7%BB%84%E6%95%B0%E6%8D%AE%E5%9D%97.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%A8%A1%E7%BB%84%E6%95%B0%E6%8D%AE%E5%9D%97.png 1.5x, https://media.prts.wiki/thumb/b/b6/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%A8%A1%E7%BB%84%E6%95%B0%E6%8D%AE%E5%9D%97.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%A8%A1%E7%BB%84%E6%95%B0%E6%8D%AE%E5%9D%97.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">1</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E8%81%9A%E5%90%88%E5%89%82" title="聚合剂"><img src="https://media.prts.wiki/thumb/9/98/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%81%9A%E5%90%88%E5%89%82.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%81%9A%E5%90%88%E5%89%82.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/9/98/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%81%9A%E5%90%88%E5%89%82.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%81%9A%E5%90%88%E5%89%82.png 1.5x, https://media.prts.wiki/thumb/9/98/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%81%9A%E5%90%88%E5%89%82.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%81%9A%E5%90%88%E5%89%82.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">2</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E5%9B%BA%E5%8C%96%E7%BA%A4%E7%BB%B4%E6%9D%BF" title="固化纤维板"><img src="https://media.prts.wiki/thumb/1/1d/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E5%8C%96%E7%BA%A4%E7%BB%B4%E6%9D%BF.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E5%8C%96%E7%BA%A4%E7%BB%B4%E6%9D%BF.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/1/1d/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E5%8C%96%E7%BA%A4%E7%BB%B4%E6%9D%BF.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E5%8C%96%E7%BA%A4%E7%BB%B4%E6%9D%BF.png 1.5x, https://media.prts.wiki/thumb/1/1d/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E5%8C%96%E7%BA%A4%E7%BB%B4%E6%9D%BF.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E5%8C%96%E7%BA%A4%E7%BB%B4%E6%9D%BF.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">3</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E8%A4%90%E7%B4%A0%E7%BA%A4%E7%BB%B4" title="褐素纤维"><img src="https://media.prts.wiki/thumb/a/ad/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%A4%90%E7%B4%A0%E7%BA%A4%E7%BB%B4.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%A4%90%E7%B4%A0%E7%BA%A4%E7%BB%B4.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/a/ad/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%A4%90%E7%B4%A0%E7%BA%A4%E7%BB%B4.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%A4%90%E7%B4%A0%E7%BA%A4%E7%BB%B4.png 1.5x, https://media.prts.wiki/thumb/a/ad/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%A4%90%E7%B4%A0%E7%BA%A4%E7%BB%B4.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E8%A4%90%E7%B4%A0%E7%BA%A4%E7%BB%B4.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">12</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E5%88%87%E5%89%8A%E5%8E%9F%E6%B6%B2" title="切削原液"><img src="https://media.prts.wiki/thumb/6/6f/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%88%87%E5%89%8A%E5%8E%9F%E6%B6%B2.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%88%87%E5%89%8A%E5%8E%9F%E6%B6%B2.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/6/6f/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%88%87%E5%89%8A%E5%8E%9F%E6%B6%B2.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%88%87%E5%89%8A%E5%8E%9F%E6%B6%B2.png 1.5x, https://media.prts.wiki/thumb/6/6f/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%88%87%E5%89%8A%E5%8E%9F%E6%B6%B2.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%88%87%E5%89%8A%E5%8E%9F%E6%B6%B2.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">3</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E6%99%B6%E4%BD%93%E5%85%83%E4%BB%B6" title="晶体元件"><img src="https://media.prts.wiki/thumb/2/2b/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%99%B6%E4%BD%93%E5%85%83%E4%BB%B6.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%99%B6%E4%BD%93%E5%85%83%E4%BB%B6.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/2/2b/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%99%B6%E4%BD%93%E5%85%83%E4%BB%B6.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%99%B6%E4%BD%93%E5%85%83%E4%BB%B6.png 1.5x, https://media.prts.wiki/thumb/2/2b/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%99%B6%E4%BD%93%E5%85%83%E4%BB%B6.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E6%99%B6%E4%BD%93%E5%85%83%E4%BB%B6.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">12</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E5%9B%BA%E6%BA%90%E5%B2%A9%E7%BB%84" title="固源岩组"><img src="https://media.prts.wiki/thumb/2/2e/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E6%BA%90%E5%B2%A9%E7%BB%84.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E6%BA%90%E5%B2%A9%E7%BB%84.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/2/2e/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E6%BA%90%E5%B2%A9%E7%BB%84.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E6%BA%90%E5%B2%A9%E7%BB%84.png 1.5x, https://media.prts.wiki/thumb/2/2e/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E6%BA%90%E5%B2%A9%E7%BB%84.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%9B%BA%E6%BA%90%E5%B2%A9%E7%BB%84.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">12</span></div><div style="display:inline-block;position:relative"><span typeof="mw:File"><a href="/w/%E5%BC%82%E9%93%81%E5%9D%97" title="异铁块"><img src="https://media.prts.wiki/thumb/7/70/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%BC%82%E9%93%81%E5%9D%97.png/48px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%BC%82%E9%93%81%E5%9D%97.png" decoding="async" loading="lazy" width="48" height="48" class="mw-file-element" srcset="https://media.prts.wiki/thumb/7/70/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%BC%82%E9%93%81%E5%9D%97.png/72px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%BC%82%E9%93%81%E5%9D%97.png 1.5x, https://media.prts.wiki/thumb/7/70/%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%BC%82%E9%93%81%E5%9D%97.png/96px-%E9%81%93%E5%85%B7_%E5%B8%A6%E6%A1%86_%E5%BC%82%E9%93%81%E5%9D%97.png 2x"></a></span><span style="position:absolute;bottom:-3px;right:2px;white-space:nowrap;color:black!important;font-weight:bold;font-size:10pt;text-shadow: -1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF,-2px -2px 4px #FFFFFF, 2px -2px 4px #FFFFFF, -2px 2px 4px #FFFFFF, 2px 2px 4px #FFFFFF;">3</span></div>
</td>`
 const tsvOutput = parseArknightsItemsToTSV(html_Str);
 console.log(tsvOutput);

export function ResourceManager() {
  const account = useAccountManager();
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [materialMap, setMaterialMap] = useState<Record<string, string>>({});

  useEffect(() => {
    import("./material.json")
      .then((json) => setMaterialMap(json.default))
    // fetch(process.env.ASSET_PREFIX + '/locales/tw/material.json')
    //   .then(res => res.json())
    //   .then(data => setMaterialMap(data as Record<string, string>))
    //   .catch(() => console.error("Failed to load material map"));
  }, []);

  const safeConfigs = useMemo(() => account.currentAccount.configs || [], [account.currentAccount]);

  const summary = useMemo(() => {
    const sum: Record<string, number> = {};
    safeConfigs.filter(g => g.isEnabled).forEach(group => {
      group.materials.forEach(m => {
        if (m.name) sum[m.name] = (sum[m.name] || 0) + (Number(m.amount) || 0);
      });
    });
    return sum;
  }, [safeConfigs]);

  const handleAddProject = () => {
    account.updateConfigs([...safeConfigs, {
      id: crypto.randomUUID(), isEnabled: true, isCollapsed: false,
      listName: '新組項目', description: '', materials: []
    }]);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
        <div className="max-w-5xl mx-auto space-y-10">
          <DashboardHeader
            profiles={account.profiles}
            activeId={account.activeId}
            currentAccount={account.currentAccount}
            onSelect={account.setActiveId}
            onAddAccount={account.addAccount}
            onDeleteAccount={account.deleteAccount}
            onUpdateAccount={account.updateAccountInfo}
            onCopy={() => setIsEditorOpen(true)} // 點擊複製改成開啟編輯器
            onImport={() => setIsEditorOpen(true)} // 點擊填充也開啟編輯器
          />

          {/* 內容區塊 */}
          <main className="space-y-6 min-h-[40vh]" key={account.activeId}>
            {safeConfigs.map(group => (
              <GroupRow
                key={group.id}
                group={group}
                materialMap={materialMap}
                onUpdate={(updated) => account.updateConfigs(safeConfigs.map(g => g.id === group.id ? updated : g))}
                onDelete={() => account.updateConfigs(safeConfigs.filter(g => g.id !== group.id))}
              />
            ))}

            {safeConfigs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white/50 text-slate-400">
                <div className="p-4 bg-slate-100 rounded-full mb-4">📂</div>
                <p className="text-sm font-bold tracking-tight">當前帳號尚無計畫</p>
                <p className="text-[10px] uppercase font-black opacity-50 mt-1">Ready to create your first project?</p>
              </div>
            )}

            {/* 這裡是重點：按鈕挪到小節上方 */}
            <div className="pt-4 space-y-10">
              <button
                onClick={handleAddProject}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-4xl text-slate-400 font-bold hover:bg-white hover:border-blue-400 hover:text-blue-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span className="text-lg">+ ADD GROUP</span>
              </button>

              {/* 小節始終顯示，且在按鈕下方 */}
              <SummarySection summary={summary} materialMap={materialMap} />
            </div>
          </main>

          {/* 渲染 Modal */}
          {isEditorOpen && (
            <JsonConfigModal
              initialValue={safeConfigs} // 這裡傳入的是當前 HTML 畫面最新的 state
              materialMap={materialMap}
              onClose={() => setIsEditorOpen(false)}
              onApply={(newData) => account.updateConfigs(newData)}
            />
          )}
        </div>
      </div>
    </>
  );
}
