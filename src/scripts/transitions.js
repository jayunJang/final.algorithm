const setActiveStage = (stageId) => {
    document.querySelectorAll(".stage-pane").forEach((pane) => {
        if (pane.id === stageId) {
            pane.classList.add("is-active");
        } else {
            pane.classList.remove("is-active");
        }
    });
};

export const activateCategoriesStage = () => {
    setActiveStage("categories-stage");
};

export const showSubcategoryPanel = () => {
    const panel = document.getElementById("subcategory-panel");
    if (!panel || panel.classList.contains("is-visible")) {
        return;
    }
    panel.classList.add("is-visible");
    gsap.fromTo(
        panel,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
};

export const transitionToFeedStage = ({ onComplete } = {}) => {
    setActiveStage("feed-stage");
    gsap.fromTo(
        "#feed-stage",
        { opacity: 0, scale: 0.98 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "power2.out",
            onComplete,
        }
    );
};

export const transitionToBubbleStage = ({ onComplete } = {}) => {
    setActiveStage("bubble-stage");
    gsap.fromTo(
        "#bubble-stage",
        { opacity: 0, scale: 0.96 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.55,
            ease: "power2.out",
            onComplete,
        }
    );
};

export const transitionToFieldStage = ({ onComplete } = {}) => {
    setActiveStage("field-stage");
    gsap.fromTo(
        "#field-stage",
        { opacity: 0, scale: 0.95 },
        {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            onComplete,
        }
    );
};

export const resetStageFlow = () => {
    const hintElements = document.querySelectorAll(".floating-hint, .floating-panel");
    hintElements.forEach((el) => {
        el.classList.remove("is-visible");
        el.style.opacity = "0";
    });
    const panel = document.getElementById("subcategory-panel");
    if (panel) {
        panel.classList.remove("is-visible");
        panel.style.opacity = "";
        panel.style.transform = "";
    }
    activateCategoriesStage();
};
