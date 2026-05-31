import Link from 'next/link';

export default function Custom500() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#080a0f', color: '#edf2f7', padding: 24 }}>
      <section style={{ maxWidth: 420, textAlign: 'center' }}>
        <h1>Помилка сервера</h1>
        <p>Спробуй оновити сторінку або повернись до стрічки.</p>
        <Link href="/">До стрічки</Link>
      </section>
    </main>
  );
}
