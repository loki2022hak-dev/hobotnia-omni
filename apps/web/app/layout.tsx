import './globals.css';
import { IntroGate } from '../components/intro-gate';
import { Providers } from '../components/providers';

export const metadata = { title: 'Хоботня', description: 'Соціальна мережа для досвіду, змін і підтримки.' };
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body><Providers><IntroGate />{children}</Providers></body>
    </html>
  );
}
