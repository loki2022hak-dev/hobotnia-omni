import './globals.css';
export const metadata = { title: 'ХОБОТНЯ | Живи на швидкості' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="uk"><body className="antialiased bg-black">{children}</body></html>;
}
