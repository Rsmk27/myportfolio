// Cached static mobile variants to avoid object recreation
const staticMobileVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
};

// Helper function to create mobile-aware animation variants
const createVariants = (desktopVariants, isMobile = false) => {
    if (isMobile) {
        // Return cached static variants with no animation for mobile
        return staticMobileVariants;
    }
    return desktopVariants;
};

// Desktop animation variants
const fadeInUpDesktop = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const fadeInLeftDesktop = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const fadeInRightDesktop = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const zoomInDesktop = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const blurInDesktop = {
    hidden: { opacity: 0, filter: "blur(20px)" },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const rotateInDesktop = {
    hidden: { opacity: 0, rotate: -5, scale: 0.95 },
    visible: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: { duration: 0.7, ease: "backOut" }
    }
};

const popInDesktop = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 25 }
    }
};

const staggerContainerDesktop = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const textContainerDesktop = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.2
        }
    }
};

const textVariantDesktop = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100
        }
    }
};

// Export functions that accept isMobile parameter
export const fadeInUp = (isMobile) => createVariants(fadeInUpDesktop, isMobile);
export const fadeInLeft = (isMobile) => createVariants(fadeInLeftDesktop, isMobile);
export const fadeInRight = (isMobile) => createVariants(fadeInRightDesktop, isMobile);
export const zoomIn = (isMobile) => createVariants(zoomInDesktop, isMobile);
export const blurIn = (isMobile) => createVariants(blurInDesktop, isMobile);
export const rotateIn = (isMobile) => createVariants(rotateInDesktop, isMobile);
export const popIn = (isMobile) => createVariants(popInDesktop, isMobile);
export const staggerContainer = (isMobile) => createVariants(staggerContainerDesktop, isMobile);
export const textContainer = (isMobile) => createVariants(textContainerDesktop, isMobile);
export const textVariant = (isMobile) => createVariants(textVariantDesktop, isMobile);
