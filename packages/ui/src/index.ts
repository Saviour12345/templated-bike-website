/* ============================================================================
 * @max/ui — shared, theme-driven component library for the Max portfolio.
 * Consumed as TS source by the three Next apps (transpilePackages).
 * ========================================================================== */

/* Lib */
export { cn } from './lib/cn';
export type { ClassValue } from './lib/cn';
export type {
  Locale,
  NavLink,
  SocialLink,
  OpeningHours,
  Nap,
  ServiceItem,
  PricingTier,
  Testimonial,
  GalleryImage,
  FaqItem,
  TrustStat,
  InstagramPost,
  GoogleReview,
} from './lib/types';

/* Primitives */
export { Button } from './primitives/button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './primitives/button';
export * from './primitives/icons';

/* Layout */
export { Container } from './layout/container';
export type { ContainerProps } from './layout/container';
export { Section } from './layout/section';
export type { SectionProps } from './layout/section';
export { Grid } from './layout/grid';
export type { GridProps } from './layout/grid';

/* Navigation */
export { Header } from './nav/header';
export type { HeaderProps } from './nav/header';
export { Footer } from './nav/footer';
export type { FooterProps } from './nav/footer';
export { LanguageSwitcher } from './nav/language-switcher';
export type { LanguageSwitcherProps } from './nav/language-switcher';
export { Breadcrumbs } from './nav/breadcrumbs';
export type { Crumb } from './nav/breadcrumbs';

/* Content blocks */
export { Hero } from './blocks/hero';
export type { HeroProps } from './blocks/hero';
export { ServiceCard } from './blocks/service-card';
export type { ServiceCardProps } from './blocks/service-card';
export { ServicesGrid } from './blocks/services-grid';
export type { ServicesGridProps, ServicesGridItem } from './blocks/services-grid';
export { PricingCard, PricingTable } from './blocks/pricing';
export type { PricingTableProps } from './blocks/pricing';
export { TrustBar } from './blocks/trust-bar';
export type { TrustBarProps } from './blocks/trust-bar';
export { TestimonialBlock, TestimonialCard } from './blocks/testimonial';
export type { TestimonialBlockProps } from './blocks/testimonial';
export { Gallery } from './blocks/gallery';
export type { GalleryProps } from './blocks/gallery';
export { InstagramFeed } from './blocks/instagram-feed';
export type { InstagramFeedProps } from './blocks/instagram-feed';
export { ReviewsBlock, ReviewCard, reviewAggregate } from './blocks/reviews';
export type { ReviewsBlockProps, ReviewCardProps } from './blocks/reviews';
export { RatingSnippet } from './blocks/rating-snippet';
export type { RatingSnippetProps } from './blocks/rating-snippet';
export { BeforeAfter } from './blocks/before-after';
export type { BeforeAfterProps } from './blocks/before-after';
export { FAQ } from './blocks/faq';
export type { FAQProps } from './blocks/faq';
export { CTASection } from './blocks/cta-section';
export type { CTASectionProps } from './blocks/cta-section';

/* Local */
export { MapHours } from './local/map-hours';
export type { MapHoursProps } from './local/map-hours';

/* Conversion */
export { WhatsAppButton } from './conversion/whatsapp-button';
export type { WhatsAppButtonProps } from './conversion/whatsapp-button';
export { ClickToCall } from './conversion/click-to-call';
export type { ClickToCallProps } from './conversion/click-to-call';
export { ConsentBanner } from './conversion/consent-banner';
export type { ConsentBannerProps } from './conversion/consent-banner';

/* Forms */
export { LeadForm } from './forms/lead-form';
export type { LeadFormProps } from './forms/lead-form';
export { ContactForm } from './forms/contact-form';
export type { ContactFormProps, ContactFormLabels } from './forms/contact-form';
export { QuoteForm } from './forms/quote-form';
export type { QuoteFormProps, QuoteFormLabels } from './forms/quote-form';
export { BookingForm } from './forms/booking-form';
export type { BookingFormProps, BookingFormLabels } from './forms/booking-form';
export type { LeadKind, LeadContext, LeadPayload, FieldConfig, FieldType, WhatsAppIntakeOptions } from './forms/types';

/* Analytics */
export { track } from './analytics/track';
export type { TrackEvent, TrackParams } from './analytics/track';
export { AnalyticsListener } from './analytics/analytics-listener';
export {
  applyConsent,
  readStoredConsent,
  storeConsent,
  DEFAULT_CONSENT,
  CONSENT_STORAGE_KEY,
} from './analytics/consent';
export type { ConsentChoices, ConsentState } from './analytics/consent';

/* Motion / interactive (also available at @max/ui/motion) */
export {
  useReducedMotion,
  ExplodedScene,
  Hotspot,
  PartPopover,
  hoverLift,
  hoverZoomImage,
  hoverIconNudge,
  hoverScale,
  hoverUnderline,
} from './motion';
export type { ExplodedSceneProps, HotspotProps, PartPopoverProps, SceneManifest, ScenePart, PartTransform } from './motion';

/* SEO / schema (also available at @max/ui/seo) */
export {
  JsonLd,
  buildMetadata,
  localBusinessSchema,
  serviceSchema,
  offerCatalogSchema,
  breadcrumbSchema,
  faqSchema,
  organizationSchema,
  openingHoursSpecification,
} from './seo';
export type { SeoInput, LocalBusinessType } from './seo';
