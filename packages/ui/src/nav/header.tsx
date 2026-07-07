'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { NavLink } from '../lib/types';
import { Button } from '../primitives/button';
import { ClickToCall } from '../conversion/click-to-call';
import { ChevronDownIcon, CloseIcon, MenuIcon } from '../primitives/icons';

export interface HeaderProps {
  brandHref: string;
  logo: ReactNode;
  nav: NavLink[];
  cta?: { label: string; href: string; track?: string };
  phone?: { e164: string; display: string };
  /** Pre-built <LanguageSwitcher/>. */
  localeSwitcher?: ReactNode;
  /** Pre-built trust badge (e.g. <RatingSnippet/>) shown in a thin top bar. */
  rating?: ReactNode;
}

/** Sticky site header: optional top rating bar, logo, desktop nav, inline call, CTA, mobile drawer. */
export function Header({ brandHref, logo, nav, cta, phone, localeSwitcher, rating }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
      {rating && (
        <div className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-container items-center justify-center px-4 py-1.5 sm:justify-end sm:px-6 lg:px-8">
            {rating}
          </div>
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-container items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={brandHref} className="flex shrink-0 items-center gap-2 font-display text-lg font-bold">
          {logo}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.children?.length ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded px-3 py-2 text-sm font-medium text-fg hover:bg-surface"
                >
                  {item.label}
                  <ChevronDownIcon className="h-4 w-4 text-muted transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full min-w-56 rounded-lg border border-border bg-bg p-2 opacity-0 shadow-lg transition-opacity duration-fast group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded px-3 py-2 text-sm text-fg hover:bg-surface"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded px-3 py-2 text-sm font-medium text-fg hover:bg-surface"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {phone && <ClickToCall e164={phone.e164} display={phone.display} className="text-sm text-muted" />}
          {localeSwitcher}
          {cta && (
            <Button href={cta.href} size="sm" track={cta.track ?? 'cta_click'} trackData={{ channel: 'header' }}>
              {cta.label}
            </Button>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div id="mobile-menu" className="border-t border-border bg-bg lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-container flex-col gap-1 px-4 py-4 sm:px-6">
            {nav.map((item) => (
              <div key={item.label} className="flex flex-col">
                <Link
                  href={item.href}
                  className="rounded px-3 py-3 text-base font-medium text-fg hover:bg-surface"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children?.length ? (
                  <div className="ml-3 flex flex-col border-l border-border pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="rounded px-3 py-2 text-sm text-muted hover:bg-surface hover:text-fg"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t border-border pt-4">
              {phone && <ClickToCall e164={phone.e164} display={phone.display} />}
              {localeSwitcher}
              {cta && (
                <Button href={cta.href} track={cta.track ?? 'cta_click'} trackData={{ channel: 'mobile_header' }}>
                  {cta.label}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
