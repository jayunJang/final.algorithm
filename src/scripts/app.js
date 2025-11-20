import { loadCategories, getReelsForSubcategory, mapCategoriesToBubbles } from "./dataLoader.js";
import { renderCategories, renderSubcategories } from "./uiRenderer.js";
import { populateFeed, captureFeedTexture } from "./reelGrid.js";
import {
    activateCategoriesStage,
    showSubcategoryPanel,
    transitionToFeedStage,
    transitionToBubbleStage,
    transitionToFieldStage,
    resetStageFlow,
} from "./transitions.js";
import { initBubbleSphere } from "./bubbleSphere.js";
import { initBubbleField } from "./bubbleField.js";
import { showHint, hideHint, wireResetButton } from "./controls.js";
import { setTheme } from "./utils.js";

const state = {
    categories: [],
    selectedCategory: null,
    selectedSubcategory: null,
    reels: [],
    bubbleSphere: null,
    bubbleField: null,
};

const elements = {
    categoryRail: document.getElementById("category-rail"),
    subcategoryGrid: document.getElementById("subcategory-grid"),
    subcategoryPanel: document.getElementById("subcategory-panel"),
    selectedCategoryLabel: document.getElementById("selected-category-label"),
    feedGrid: document.getElementById("feed-grid"),
    feedHint: document.getElementById("feed-hint"),
    bubbleCanvas: document.getElementById("bubble-canvas"),
    bubbleOverlay: document.getElementById("bubble-overlay"),
    escapeButton: document.getElementById("escape-btn"),
    fieldCanvas: document.getElementById("field-canvas"),
    fieldHint: document.getElementById("field-hint"),
};

const loadInitialData = async () => {
    state.categories = await loadCategories();
    renderCategories(elements.categoryRail, state.categories, {
        onSelect: handleCategorySelect,
    });
};

const cleanupScenes = () => {
    if (state.bubbleSphere) {
        state.bubbleSphere.dispose();
        state.bubbleSphere = null;
    }
    if (state.bubbleField) {
        state.bubbleField.dispose();
        state.bubbleField = null;
    }
};

const handleCategorySelect = (category) => {
    state.selectedCategory = category;
    state.selectedSubcategory = null;
    setTheme(category.code);

    elements.categoryRail.querySelectorAll(".category-card").forEach((card) => {
        card.classList.toggle("is-active", card.dataset.code === category.code);
    });

    if (elements.selectedCategoryLabel) {
        elements.selectedCategoryLabel.textContent = category.name;
    }

    renderSubcategories(elements.subcategoryGrid, category, {
        onSelect: handleSubcategorySelect,
    });

    showSubcategoryPanel();
};

const handleSubcategorySelect = (subcategory) => {
    state.selectedSubcategory = subcategory;
    if (!state.selectedCategory) {
        return;
    }
    state.reels = getReelsForSubcategory(state.selectedCategory, subcategory.code);
    populateFeed(elements.feedGrid, state.reels);
    transitionToFeedStage({
        onComplete: () => {
            showHint("#feed-hint");
        },
    });
};

const enterBubbleInterior = async () => {
    hideHint("#feed-hint");
    const textureCanvas = await captureFeedTexture(elements.feedGrid);
    transitionToBubbleStage({
        onComplete: () => {
            cleanupScenes();
            state.bubbleSphere = initBubbleSphere(elements.bubbleCanvas, textureCanvas);
            showHint("#bubble-overlay");
        },
    });
};

const enterBubbleField = async () => {
    hideHint("#bubble-overlay");
    transitionToFieldStage({
        onComplete: () => {
            cleanupScenes();
            const baseBubbles = mapCategoriesToBubbles(state.categories);
            if (!baseBubbles.length) {
                return;
            }
            const bubbles = Array.from({ length: 36 }, (_, index) => ({
                ...baseBubbles[index % baseBubbles.length],
                jitter: Math.random(),
            }));
            state.bubbleField = initBubbleField(elements.fieldCanvas, bubbles);
            showHint("#field-hint");
        },
    });
};

const handleFeedInteraction = () => {
    if (!state.selectedSubcategory || state.bubbleSphere) {
        return;
    }
    enterBubbleInterior();
};

const handleReset = () => {
    cleanupScenes();
    state.selectedCategory = null;
    state.selectedSubcategory = null;
    state.reels = [];
    setTheme(null);
    elements.subcategoryGrid.innerHTML = "";
    elements.feedGrid.innerHTML = "";
    renderCategories(elements.categoryRail, state.categories, {
        onSelect: handleCategorySelect,
    });
    resetStageFlow();
};

const bindEvents = () => {
    elements.feedGrid.addEventListener("pointerdown", handleFeedInteraction);
    elements.escapeButton.addEventListener("click", enterBubbleField);
    wireResetButton(handleReset);
};

const init = async () => {
    await loadInitialData();
    activateCategoriesStage();
    bindEvents();
};

init().catch((error) => {
    console.error("Failed to initialize Algorithmic Bubbles", error);
});
