import { Navbar } from "../../common/Navbar";

export const ProductView = () => {
  return (
    <>
      {/* 這裡的 Navbar 不再需要傳 currentPage，因為它現在靠路由判斷 */}
      <Navbar />
      <main className="p-8">
        <h1 className="text-3xl font-bold">產品大廳</h1>
        <p className="mt-4 text-gray-600">這是透過 CSR 渲染的產品頁面內容。</p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 border rounded shadow-sm">優質商品 A</div>
          <div className="p-4 border rounded shadow-sm">優質商品 B</div>
        </div>
      </main>
    </>
  );
};
