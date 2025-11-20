export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

export const createElement = (tag, options = {}) => {
    const el = document.createElement(tag);
    if (options.className) {
        el.className = options.className;
    }
    if (options.dataset) {
        Object.entries(options.dataset).forEach(([key, value]) => {
            el.dataset[key] = value;
        });
    }
    if (options.text) {
        el.textContent = options.text;
    }
    if (options.html) {
        el.innerHTML = options.html;
    }
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
    }
    return el;
};

export const shuffleArray = (source) => {
    const array = [...source];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const lerp = (start, end, alpha) => start + (end - start) * alpha;

export const setTheme = (code) => {
    if (code) {
        document.body.dataset.theme = code;
    } else {
        delete document.body.dataset.theme;
    }
};

export const focusRing = (element) => {
    element.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            document.body.classList.add("show-focus-outline");
        }
    });

    element.addEventListener("mousedown", () => {
        document.body.classList.remove("show-focus-outline");
    });
};

export const createGradientCanvas = (width, height, color) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.18)");
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    return canvas;
};

export const throttle = (func, limit = 100) => {
    let inThrottle;
    return function throttled(...args) {
        if (inThrottle) {
            return;
        }
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => {
            inThrottle = false;
        }, limit);
    };
};


