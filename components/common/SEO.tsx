import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PROFILE } from '../../constants';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'profile' | 'article';
  author?: string;
  noindex?: boolean;
  schema?: object | object[];
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = PROFILE.name,
  noindex = false,
  schema,
}) => {
  const siteTitle = "Srinivasa Manikanta Rajapantula | EEE Student – Embedded Systems, Industrial Automation & IoT";
  const defaultDescription = "Portfolio of Srinivasa Manikanta Rajapantula — Electrical & Electronics Engineering Student specializing in Embedded Systems, Industrial Automation (PLC, CODESYS, Factory I/O, Modbus TCP), IoT, and Smart Energy in Vijayawada, India.";
  const defaultKeywords = "Srinivasa Manikanta Rajapantula, RSMK, Electrical and Electronics Engineering, EEE student, Embedded Systems, Industrial Automation, PLC programming, CODESYS, Factory IO, Modbus TCP, Smart Energy, ESP32 IoT projects, SFMD firefighter monitoring device, ColorOhm resistor calculator, solar panel tracker, AgriRover ESP32, Vijayawada Andhra Pradesh";
  const defaultImage = "https://rsmk.me/assets/srinivasa-manikanta-profile.webp";
  const siteUrl = "https://rsmk.me";

  const fullTitle = title ? (title.includes(PROFILE.name) ? title : `${title} | ${PROFILE.name}`) : siteTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalImage = image || defaultImage;
  const finalUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`) : siteUrl;

  return (
    <Helmet>
      {/* Title */}
      <title>{fullTitle}</title>

      {/* Primary Meta Tags */}
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={`${PROFILE.name} (RSMK) — Portfolio`} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`Portrait of ${PROFILE.name}, Electrical & Electronics Engineer`} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@SrinivasManik20" />
      <meta name="twitter:creator" content="@SrinivasManik20" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={`Portrait of ${PROFILE.name}, EEE Engineer`} />

      {/* JSON-LD Structured Data Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
