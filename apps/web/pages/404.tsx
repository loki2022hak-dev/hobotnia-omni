import Link from 'next/link';

export default function Custom404() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#080a0f', color: '#edf2f7', padding: 24 }}>
      <section style={{ maxWidth: 420, textAlign: 'center' }}>
        <h1>Сторінку не знайдено</h1>
        <p>Цей розділ Хоботні не існує або був переміщений.</p>
        <Link href="/">До стрічки</Link>
      </section>
    </main>
  );
}
