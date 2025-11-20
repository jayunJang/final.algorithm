const DATA_URL = "data/categories.json";

let cachedData = null;

export const loadCategories = async () => {
    if (cachedData) {
        return cachedData;
    }

    const response = await fetch(DATA_URL);
    if (!response.ok) {
        throw new Error(`Failed to load categories data: ${response.status}`);
    }

    const json = await response.json();
    cachedData = json.categories || [];
    return cachedData;
};

export const getCategoryByCode = async (code) => {
    const categories = await loadCategories();
    return categories.find((category) => category.code === code) || null;
};

export const getReelsForSubcategory = (category, subcategoryCode) => {
    if (!category) {
        return [];
    }

    const baseReels = category.reels || [];
    // Duplicate placeholder reels to fill the feed grid.
    const expanded = Array.from({ length: 24 }, (_, index) => {
        const reel = baseReels[index % baseReels.length];
        return {
            ...reel,
            id: `${category.code}-${subcategoryCode}-${index}`,
            category: category.name,
            subcategory: subcategoryCode,
        };
    });

    return expanded;
};

export const mapCategoriesToBubbles = (categories) => {
    return categories.map((category) => ({
        code: category.code,
        color: category.color,
        name: category.name,
        reelCount: (category.reels || []).length,
    }));
};


