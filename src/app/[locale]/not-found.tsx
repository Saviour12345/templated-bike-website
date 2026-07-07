import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-container flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-6xl font-extrabold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Pagina niet gevonden · Page not found</h1>
      <p className="mt-2 text-muted">De pagina bestaat niet (meer). · This page doesn’t exist.</p>
      <Link
        href="/nl"
        className="mt-6 inline-flex h-11 items-center rounded bg-primary px-6 font-semibold text-primary-fg"
      >
        Home
      </Link>
    </div>
  );
}
