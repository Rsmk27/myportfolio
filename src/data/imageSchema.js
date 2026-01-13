// Image SEO - Structured Data for ImageObject Schema
export const imageStructuredData = {
  profileImage: {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": "https://rsmk.me/assets/srinivasa-manikanta-profile.jpg",
    "url": "https://rsmk.me/assets/srinivasa-manikanta-profile.jpg",
    "name": "Srinivasa Manikanta Professional Profile Photo",
    "description": "Professional photo of Srinivasa Manikanta, Electrical and Electronics Engineer specializing in embedded systems, IoT, and smart energy solutions",
    "author": {
      "@type": "Person",
      "name": "Srinivasa Manikanta"
    },
    "creator": {
      "@type": "Person",
      "name": "Srinivasa Manikanta"
    },
    "width": "400px",
    "height": "400px",
    "encodingFormat": "image/jpeg",
    "license": "https://rsmk.me/",
    "acquireLicensePage": "https://rsmk.me/contact.html"
  },
  
  budgetBuddyImage: {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": "https://rsmk.me/assets/budget-buddy-expense-tracker-app.png",
    "url": "https://rsmk.me/assets/budget-buddy-expense-tracker-app.png",
    "name": "Budget Buddy Expense Tracker Application",
    "description": "Budget Buddy expense tracking application interface showing real-time financial analytics, budget management dashboard with React and Firebase integration",
    "about": {
      "@type": "SoftwareApplication",
      "name": "Budget Buddy",
      "applicationCategory": "FinanceApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    "width": "2560px",
    "height": "1792px",
    "encodingFormat": "image/png"
  },
  
  colorOhmImage: {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": "https://rsmk.me/assets/color-ohm-resistor-calculator-tool.png",
    "url": "https://rsmk.me/assets/color-ohm-resistor-calculator-tool.png",
    "name": "ColorOhm Resistor Color Code Calculator Tool",
    "description": "ColorOhm resistor color code calculator tool interface for electrical engineers showing 4-band and 5-band resistance calculation with instant visual feedback",
    "about": {
      "@type": "SoftwareApplication",
      "name": "ColorOhm",
      "applicationCategory": "UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    "width": "2560px",
    "height": "1792px",
    "encodingFormat": "image/png"
  },
  
  smartExhaustImage: {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": "https://rsmk.me/assets/smart-exhaust-gas-detection-system.png",
    "url": "https://rsmk.me/assets/smart-exhaust-gas-detection-system.png",
    "name": "Smart Exhaust Gas Detection System",
    "description": "Smart exhaust fan system with MQ-2 gas sensor for automatic hazardous gas detection and ventilation control using Arduino microcontroller and IoT technology",
    "about": {
      "@type": "Product",
      "name": "Smart Exhaust System",
      "description": "Intelligent safety system for hazardous gas detection"
    },
    "width": "2560px",
    "height": "1792px",
    "encodingFormat": "image/png"
  },
  
  aiChatbotImage: {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": "https://rsmk.me/assets/ai-chatbot-interface-background.webp",
    "url": "https://rsmk.me/assets/ai-chatbot-interface-background.webp",
    "name": "AI Chatbot with GPT Integration",
    "description": "AI-powered chatbot interface with GPT integration showing conversational AI capabilities and real-time response system built with Next.js",
    "about": {
      "@type": "SoftwareApplication",
      "name": "AI Chatbot",
      "applicationCategory": "ChatApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    "width": "1600px",
    "height": "896px",
    "encodingFormat": "image/webp"
  }
};

// Function to generate JSON-LD script tag for a specific image
export const generateImageJsonLd = (imageKey) => {
  const data = imageStructuredData[imageKey];
  if (!data) return null;
  
  return {
    __html: JSON.stringify(data)
  };
};

// Generate all image structured data for the homepage
export const generateAllImagesJsonLd = () => {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": Object.values(imageStructuredData)
    })
  };
};
