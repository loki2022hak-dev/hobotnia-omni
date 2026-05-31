import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-slate-100">
      <section className="card max-w-md p-6 text-center">
        <h1 className="text-2xl font-black">Сторінку не знайдено</h1>
        <p className="mt-2 text-sm text-slate-400">Цей розділ Хоботні не існує або був переміщений.</p>
        <Link className="mt-5 inline-flex bg-brand px-4 py-2 text-sm font-semibold text-ink" href="/">
          До стрічки
        </Link>
      </section>
    </main>
  );
}
