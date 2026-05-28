/* シンプルな汎用ページレイアウト */
export default function BasePage({ title, children }) {
  return (
    <main className="p-8 flex flex-col gap-8 items-center">
      <h1>{title}</h1>
      <article className="flex flex-col gap-8 w-full">{children}</article>
    </main>
  );
}
