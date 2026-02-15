import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT_INFO, SOCIAL_LINKS } from '@/lib/constants';

export function SEOJsonLd() {
  const socialUrls = Array.isArray(SOCIAL_LINKS)
    ? SOCIAL_LINKS.map((link) => link.url)
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'Web',
    sameAs: socialUrls,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      addressRegion: CONTACT_INFO.address.region,
      postalCode: CONTACT_INFO.address.postalCode,
      addressCountry: CONTACT_INFO.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_INFO.phone,
      email: CONTACT_INFO.email,
      contactType: 'customer support',
      availableLanguage: 'English',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: '0',
      highPrice: '19.99',
      priceCurrency: 'USD',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
