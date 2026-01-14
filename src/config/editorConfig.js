export const EDITOR_LAYOUT = {
    // US Letter Dimensions
    PAGE_WIDTH: '8.5in',
    PAGE_HEIGHT: '11in',
    PAGE_HEIGHT_PX: 1056, // 11in * 96dpi

    // Spacing & Margins
    PAGE_PADDING: '1in',
    MARGIN_PX: 96, // 1in * 96dpi

    // UI Positioning
    TOOLBAR_TOP_OFFSET: '2rem', // top-8
    SIDEBAR_LEFT_OFFSET: '3rem', // left-12
    OUTLINE_LEFT_OFFSET: '7rem', // left-28
    OUTLINE_WIDTH: '16rem', // w-64

    // Focus Mode Transitions
    FOCUS_MARGIN_TOP: '5rem', // mt-20
    NORMAL_MARGIN_TOP: '11rem', // mt-44
};

export const ANIMATION_CONFIG = {
    ENTRANCE: {
        duration: 1,
        y: 20,
        delay: 0.2,
        ease: 'power3.out'
    },
    FOCUS_MODE: {
        duration: 0.5,
        y_offset: 20, // Used for slide up/down
        stagger: 0.1,
        ease_in: 'power2.in',
        ease_out: 'power2.out'
    },
    HOVER: {
        scale_enter: 1.1,
        scale_click: 0.95,
        duration: 0.2
    }
};
