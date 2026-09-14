// scripts/prerender.js
// Post-build SSG prerendering for rsmk.tech
// Generates static HTML entry points for /gallery and /automation
// with dedicated route metadata, structured data, and rich noscript fallbacks.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Helper to replace <head> meta in baseHtml
function injectRouteMetadata(html, {
  title,
  description,
  url,
  image,
  imageType = 'image/webp',
  schema,
  noscriptContent
}) {
  let output = html;

  // Replace Title
  output = output.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // Replace Description
  output = output.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  // Replace Canonical
  output = output.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
    `<link rel="canonical" href="${url}" />`
  );

  // Replace OG URL
  output = output.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:url" content="${url}" />`
  );

  // Replace OG Title
  output = output.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`
  );

  // Replace OG Description
  output = output.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  // Replace OG Image
  output = output.replace(
    /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image" content="${image}" />`
  );
  output = output.replace(
    /<meta\s+property="og:image:url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image:url" content="${image}" />`
  );
  output = output.replace(
    /<meta\s+property="og:image:secure_url"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image:secure_url" content="${image}" />`
  );
  output = output.replace(
    /<meta\s+property="og:image:type"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta property="og:image:type" content="${imageType}" />`
  );

  // Replace Twitter Title
  output = output.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`
  );

  // Replace Twitter Description
  output = output.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`
  );

  // Replace Twitter Image
  output = output.replace(
    /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${image}" />`
  );

  // Replace JSON-LD schema
  if (schema) {
    const jsonLdString = typeof schema === 'string' ? schema : JSON.stringify(schema, null, 2);
    output = output.replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n${jsonLdString}\n  </script>`
    );
  }

  // Replace Noscript Fallback
  if (noscriptContent) {
    output = output.replace(
      /<noscript>[\s\S]*?<\/noscript>/i,
      `<noscript>\n${noscriptContent}\n  </noscript>`
    );
  }

  return output;
}

// 1. Gallery Route Config
const galleryRoute = {
  title: 'Photo Gallery | Srinivasa Manikanta Rajapantula — Engineering Projects, Industrial Automation &amp; IoT',
  description: "Explore Srinivasa Manikanta Rajapantula's engineering gallery: ALIET college projects, 2nd place A-Hacks Hardware Hackathon build, Industrial Automation & PLC simulations, Coromandel industrial internship, EV battery management systems, and 3D printing workshops.",
  url: 'https://rsmk.tech/gallery',
  image: 'https://rsmk.tech/assets/gallery/ahacks/prize-ceremony.jpg',
  imageType: 'image/jpeg',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://rsmk.tech/gallery#page',
        url: 'https://rsmk.tech/gallery',
        name: 'Engineering Photo & Media Gallery — Srinivasa Manikanta Rajapantula',
        description: "Visual documentation of engineering prototypes, hardware hackathons, and industrial automation work by Srinivasa Manikanta Rajapantula.",
        isPartOf: { '@type': 'WebSite', '@id': 'https://rsmk.tech/#website', url: 'https://rsmk.tech' },
        author: { '@type': 'Person', '@id': 'https://rsmk.tech/#person', name: 'Srinivasa Manikanta Rajapantula' }
      },
      {
        '@type': 'ImageGallery',
        name: 'Hardware & Engineering Prototype Photo Gallery',
        url: 'https://rsmk.tech/gallery'
      },
      {
        '@type': 'VideoObject',
        name: 'Industrial Automation Learning on CODESYS — Srinivasa Manikanta Rajapantula',
        description: 'PLC ladder logic and 3D plant simulation walkthrough using CODESYS, Factory I/O, and Modbus TCP by Srinivasa Manikanta Rajapantula.',
        thumbnailUrl: 'https://rsmk.tech/assets/gallery/ahacks/prize-ceremony.jpg',
        uploadDate: '2026-01-15T00:00:00+05:30',
        embedUrl: 'https://www.youtube.com/embed/2pnFLqmh6X4',
        author: { '@type': 'Person', name: 'Srinivasa Manikanta Rajapantula' }
      },
      {
        '@type': 'VideoObject',
        name: '1-Way Traffic Light Control using CCW and Optix Studio — Srinivasa Manikanta Rajapantula',
        description: '1-Way Traffic Light PLC control logic simulation built with Connected Components Workbench (CCW) and FactoryTalk Optix Studio HMI by Srinivasa Manikanta Rajapantula.',
        thumbnailUrl: 'https://rsmk.tech/assets/gallery/ahacks/demo-presentation.jpg',
        uploadDate: '2026-02-10T00:00:00+05:30',
        embedUrl: 'https://www.youtube.com/embed/qIJbTBcBfjE',
        author: { '@type': 'Person', name: 'Srinivasa Manikanta Rajapantula' }
      }
    ]
  },
  noscriptContent: `
    <div class="noscript-fallback" role="main">
      <header>
        <p><a href="/">← Return to Main Dashboard</a> | <a href="/automation">Watch Automation Videos →</a></p>
        <h1>Engineering Photo & Media Gallery</h1>
        <p><strong>Srinivasa Manikanta Rajapantula (RSMK)</strong> — Electrical &amp; Electronics Engineer at ALIET</p>
      </header>
      <section>
        <h2>Featured Hardware &amp; Hackathon Highlights</h2>
        <ul>
          <li><strong>A-Hacks 2026 National Hackathon:</strong> 2nd Place in Hardware Innovation for the Sustainable Firefighter Monitoring Device (SFMD).</li>
          <li><strong>Industrial Automation:</strong> CODESYS V3.5 3D virtual commissioning with Factory I/O over Modbus TCP protocol.</li>
          <li><strong>Coromandel International Ltd:</strong> Electrical Engineering Internship analyzing 11kV/440V plant distribution networks, SLDs, and induction motor testing.</li>
          <li><strong>Electric Vehicle Technologies:</strong> Custom Battery Management System (BMS) with over-temperature protection and 250W BLDC motor speed controllers.</li>
          <li><strong>3D Additive Manufacturing:</strong> Rapid prototyping CAD enclosures for IoT devices at ALIET labs.</li>
        </ul>
      </section>
      <section>
        <h2>Featured Gallery Images</h2>
        <img src="/assets/gallery/ahacks/prize-ceremony.jpg" alt="A-Hacks 24hr Hackathon Hardware Category 2nd Place Award Ceremony" width="500" height="300" loading="lazy" />
        <p>A-Hacks 2026 Hackathon Hardware Category 2nd Place Award Ceremony honoring Srinivasa Manikanta.</p>

        <img src="/assets/gallery/ahacks/demo-presentation.jpg" alt="Live Hardware Demonstration of SFMD IoT Wearable" width="500" height="300" loading="lazy" />
        <p>Demonstrating the SFMD wearable sensor array and ESP32 telemetry to judges.</p>

        <img src="/assets/experience/coromandel/single-line-diagram.jpg" alt="Coromandel International Industrial Single Line Diagram" width="500" height="300" loading="lazy" />
        <p>11kV/440V substation distribution network SLD analyzed during internship.</p>
      </section>
    </div>
  `
};

// 2. Automation Route Config
const automationRoute = {
  title: 'Industrial Automation & PLC Videos | Srinivasa Manikanta Rajapantula — CODESYS & HMI Walkthroughs',
  description: 'Watch industrial automation, PLC ladder logic, and control system video demonstrations by Srinivasa Manikanta: CODESYS V3.5 3D virtual commissioning with Factory I/O over Modbus TCP, CCW traffic light control with Optix Studio HMI, and embedded hardware safety systems.',
  url: 'https://rsmk.tech/automation',
  image: 'https://img.youtube.com/vi/2pnFLqmh6X4/maxresdefault.jpg',
  imageType: 'image/jpeg',
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://rsmk.tech/automation#page',
        url: 'https://rsmk.tech/automation',
        name: 'Industrial Automation & Control Systems Video Showcase — Srinivasa Manikanta Rajapantula',
        description: 'Hands-on video demonstrations of PLC programming in CODESYS, Factory I/O 3D simulation, Modbus TCP communication, Connected Components Workbench, and Optix Studio HMI.',
        isPartOf: { '@type': 'WebSite', '@id': 'https://rsmk.tech/#website', url: 'https://rsmk.tech' },
        author: { '@type': 'Person', '@id': 'https://rsmk.tech/#person', name: 'Srinivasa Manikanta Rajapantula' }
      },
      {
        '@type': 'VideoObject',
        name: 'Industrial Automation Learning on CODESYS — Srinivasa Manikanta Rajapantula',
        description: 'PLC ladder logic and 3D plant simulation walkthrough using CODESYS, Factory I/O, and Modbus TCP by Srinivasa Manikanta Rajapantula.',
        thumbnailUrl: 'https://img.youtube.com/vi/2pnFLqmh6X4/maxresdefault.jpg',
        uploadDate: '2026-01-15T00:00:00+05:30',
        embedUrl: 'https://www.youtube.com/embed/2pnFLqmh6X4',
        author: { '@type': 'Person', name: 'Srinivasa Manikanta Rajapantula' }
      },
      {
        '@type': 'VideoObject',
        name: '1-Way Traffic Light Control using CCW and Optix Studio — Srinivasa Manikanta Rajapantula',
        description: '1-Way Traffic Light PLC control logic simulation built with Connected Components Workbench (CCW) and FactoryTalk Optix Studio HMI by Srinivasa Manikanta Rajapantula.',
        thumbnailUrl: 'https://img.youtube.com/vi/qIJbTBcBfjE/maxresdefault.jpg',
        uploadDate: '2026-02-10T00:00:00+05:30',
        embedUrl: 'https://www.youtube.com/embed/qIJbTBcBfjE',
        author: { '@type': 'Person', name: 'Srinivasa Manikanta Rajapantula' }
      },
      {
        '@type': 'VideoObject',
        name: 'Pick and Place Automation using PLC — Srinivasa Manikanta',
        description: 'Industrial pick-and-place robotic gantry automation and sequence simulation with PLC ladder logic by Srinivasa Manikanta.',
        thumbnailUrl: 'https://img.youtube.com/vi/dYKsfDnsj9A/maxresdefault.jpg',
        uploadDate: '2026-03-01T00:00:00+05:30',
        embedUrl: 'https://www.youtube.com/embed/dYKsfDnsj9A',
        author: { '@type': 'Person', name: 'Srinivasa Manikanta Rajapantula' }
      },
      {
        '@type': 'VideoObject',
        name: 'Sorting Boxes Automation using PLC — Srinivasa Manikanta',
        description: 'Conveyor box classification and pneumatic diverter sorting simulation controlled by PLC ladder logic by Srinivasa Manikanta.',
        thumbnailUrl: 'https://img.youtube.com/vi/pPgJaU0IWfU/maxresdefault.jpg',
        uploadDate: '2026-03-01T00:00:00+05:30',
        embedUrl: 'https://www.youtube.com/embed/pPgJaU0IWfU',
        author: { '@type': 'Person', name: 'Srinivasa Manikanta Rajapantula' }
      },
      {
        '@type': 'VideoObject',
        name: 'Automatic Exhaust Fan Prototype Video',
        description: 'Demonstration video showing gas detection trigger and automatic ventilation fan activation using Arduino and MQ-2 sensor by Srinivasa Manikanta Rajapantula.',
        thumbnailUrl: 'https://rsmk.tech/assets/auto-exhaust-fan/image-1.jpg',
        uploadDate: '2026-01-01T00:00:00+05:30',
        contentUrl: 'https://rsmk.tech/assets/auto-exhaust-fan/demo-video.mp4',
        author: { '@type': 'Person', name: 'Srinivasa Manikanta Rajapantula' }
      }
    ]
  },
  noscriptContent: `
    <div class="noscript-fallback" role="main">
      <header>
        <p><a href="/">← Return to Main Dashboard</a> | <a href="/gallery">View Photo Gallery →</a></p>
        <h1>Industrial Automation &amp; PLC Video Showcase</h1>
        <p><strong>Srinivasa Manikanta Rajapantula (RSMK)</strong> — Industrial Automation &amp; Control Systems</p>
      </header>
      <section>
        <h2>Featured Video Demonstrations</h2>

        <h3>1. CODESYS &amp; Factory I/O 3D Industrial Sorting Simulation</h3>
        <p>Walkthrough of PLC ladder logic, Modbus TCP tag mapping, and real-time 3D simulation controlling diverters and sensor classification in Factory I/O.</p>
        <p><a href="https://www.youtube.com/watch?v=2pnFLqmh6X4" target="_blank" rel="noopener">Watch on YouTube →</a></p>

        <h3>2. 1-Way Traffic Light Control using CCW and Optix Studio</h3>
        <p>Rockwell Automation Connected Components Workbench (CCW) PLC logic paired with FactoryTalk Optix Studio modern HMI screen simulation.</p>
        <p><a href="https://www.youtube.com/watch?v=qIJbTBcBfjE" target="_blank" rel="noopener">Watch on YouTube →</a></p>

        <h3>3. Pick and Place Automation using PLC</h3>
        <p>Gantry pneumatic robot pick-and-place sequence control logic simulation.</p>
        <p><a href="https://www.youtube.com/watch?v=dYKsfDnsj9A" target="_blank" rel="noopener">Watch on YouTube →</a></p>

        <h3>4. Sorting Boxes Automation using PLC</h3>
        <p>Conveyor sorting cell with optical height sensors and pneumatic sorters.</p>
        <p><a href="https://www.youtube.com/watch?v=pPgJaU0IWfU" target="_blank" rel="noopener">Watch on YouTube →</a></p>

        <h3>5. Automatic Exhaust Fan Hardware Prototype</h3>
        <p>Arduino UNO and MQ-2 gas sensor automatic safety ventilation system in operation.</p>
      </section>
    </div>
  `
};

// Generate pages
const routes = [
  { dir: 'gallery', config: galleryRoute },
  { dir: 'automation', config: automationRoute },
  { dir: 'videos', config: { ...automationRoute, url: 'https://rsmk.tech/videos' } }
];

routes.forEach(({ dir, config }) => {
  const targetDir = path.join(distDir, dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const prerenderedHtml = injectRouteMetadata(baseHtml, config);
  const targetIndexPath = path.join(targetDir, 'index.html');
  const targetHtmlPath = path.join(distDir, `${dir}.html`);

  fs.writeFileSync(targetIndexPath, prerenderedHtml, 'utf8');
  fs.writeFileSync(targetHtmlPath, prerenderedHtml, 'utf8');

  console.log(`[SSG Prerender] Generated: ${dir}/index.html and ${dir}.html`);
});

console.log('[SSG Prerender] Completed static site prerendering successfully.');
