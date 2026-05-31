import type { NextPageContext } from 'next';
import Link from 'next/link';

type ErrorProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#080a0f', color: '#edf2f7', padding: 24 }}>
      <section style={{ maxWidth: 420, textAlign: 'center' }}>
        <h1>{statusCode ?? 500}</h1>
        <p>Не вдалося відкрити сторінку.</p>
        <Link href="/">До стрічки</Link>
      </section>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;
