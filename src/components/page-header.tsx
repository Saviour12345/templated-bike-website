import { Breadcrumbs, Container, type Crumb } from '@max/ui';

export function PageHeader({
  crumbs,
  title,
  intro,
  eyebrow,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  eyebrow?: string;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <Container>
        <div className="py-12 sm:py-16">
          <Breadcrumbs items={crumbs} className="mb-4" />
          {eyebrow && (
            <span className="mb-3 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-dark">
              {eyebrow}
            </span>
          )}
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          {intro && <p className="mt-4 max-w-prose text-lg text-muted">{intro}</p>}
        </div>
      </Container>
    </section>
  );
}
