import { createElement, shuffleArray } from "./utils.js";

export const renderCategories = (container, categories, handlers) => {
    container.innerHTML = "";
    categories.forEach((category) => {
        const card = createElement("button", {
            className: "category-card",
            dataset: {
                code: category.code,
                theme: category.code,
            },
            attributes: {
                type: "button",
                "aria-label": `Choose ${category.name}`,
            },
        });

        const icon = createElement("div", { className: "card-icon" });
        icon.textContent = "◎";
        const title = createElement("div", { className: "card-title", text: category.name });
        const description = createElement("p", {
            className: "card-description",
            text: category.description || "",
        });

        card.append(icon, title, description);
        card.addEventListener("click", () => handlers.onSelect(category));
        container.append(card);
    });
};

export const renderSubcategories = (container, category, handlers) => {
    container.innerHTML = "";
    const subcategories = category?.subcategories || [];

    subcategories.forEach((sub) => {
        const button = createElement("button", {
            className: "subcategory-button",
            dataset: {
                code: sub.code,
            },
            attributes: {
                type: "button",
            },
            text: sub.name,
        });

        button.addEventListener("click", () => {
            handlers.onSelect(sub);
            container.querySelectorAll(".subcategory-button").forEach((btn) => btn.classList.remove("is-selected"));
            button.classList.add("is-selected");
        });

        container.append(button);
    });
};

export const renderReelGrid = (container, reels) => {
    container.innerHTML = "";
    const shuffled = shuffleArray(reels);

    shuffled.forEach((reel) => {
        const card = createElement("div", {
            className: "reel-card",
            dataset: {
                category: reel.category,
                subcategory: reel.subcategory,
            },
        });

        const placeholder = createElement("div", {
            className: "reel-placeholder",
            html: "<span>Empty Reel</span>",
        });
        // Video placeholder comment
        placeholder.dataset.note = "Insert <video> element here later.";

        const caption = createElement("div", {
            className: "reel-caption",
            text: reel.caption,
        });

        card.append(placeholder, caption);
        container.append(card);
    });
};


