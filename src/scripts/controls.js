export const showHint = (selector) => {
    const el = document.querySelector(selector);
    if (!el) {
        return;
    }
    el.classList.add("is-visible");
    gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
};

export const hideHint = (selector) => {
    const el = document.querySelector(selector);
    if (!el) {
        return;
    }
    gsap.to(el, { opacity: 0, y: 10, duration: 0.3, ease: "power1.in", onComplete: () => el.classList.remove("is-visible") });
};

export const wireResetButton = (callback) => {
    const resetBtn = document.getElementById("reset-btn");
    if (!resetBtn) {
        return;
    }
    resetBtn.addEventListener("click", callback);
};


