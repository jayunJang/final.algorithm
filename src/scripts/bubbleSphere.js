import { clamp } from "./utils.js";

class BubbleSphere {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        this.rotation = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastPosition = { x: 0, y: 0 };
        this.animationId = null;

        this.createLighting();
        this.createSphere();
        this.registerEvents();
        this.animate();
    }

    createLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambient);
        const point = new THREE.PointLight(0xffffff, 0.5);
        point.position.set(5, 5, 5);
        this.scene.add(point);
    }

    createSphere(texture) {
        const geometry = new THREE.SphereGeometry(8, 64, 64);
        geometry.scale(-1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            map: texture || null,
            color: texture ? 0xffffff : 0x9aa4ff,
            side: THREE.BackSide,
        });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
        this.camera.position.set(0, 0, 0.1);
    }

    updateTexture(canvasTexture) {
        const texture = new THREE.CanvasTexture(canvasTexture);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 1);
        this.sphere.material.map = texture;
        this.sphere.material.needsUpdate = true;
    }

    registerEvents() {
        this.canvas.addEventListener("pointerdown", this.onPointerDown);
        this.canvas.addEventListener("pointermove", this.onPointerMove);
        window.addEventListener("pointerup", this.onPointerUp);
        window.addEventListener("resize", this.onResize);
    }

    removeEvents() {
        this.canvas.removeEventListener("pointerdown", this.onPointerDown);
        this.canvas.removeEventListener("pointermove", this.onPointerMove);
        window.removeEventListener("pointerup", this.onPointerUp);
        window.removeEventListener("resize", this.onResize);
    }

    onPointerDown = (event) => {
        this.isDragging = true;
        this.lastPosition.x = event.clientX;
        this.lastPosition.y = event.clientY;
    };

    onPointerMove = (event) => {
        if (!this.isDragging) {
            return;
        }
        const deltaX = event.clientX - this.lastPosition.x;
        const deltaY = event.clientY - this.lastPosition.y;
        this.lastPosition.x = event.clientX;
        this.lastPosition.y = event.clientY;
        this.targetRotation.y += deltaX * 0.003;
        this.targetRotation.x += deltaY * 0.003;
        this.targetRotation.x = clamp(this.targetRotation.x, -Math.PI / 2.5, Math.PI / 2.5);
    };

    onPointerUp = () => {
        this.isDragging = false;
    };

    onResize = () => {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    };

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.08;
        this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.08;
        if (this.sphere) {
            this.sphere.rotation.x = this.rotation.x;
            this.sphere.rotation.y = this.rotation.y;
        }
        this.renderer.render(this.scene, this.camera);
    };

    dispose() {
        cancelAnimationFrame(this.animationId);
        this.removeEvents();
        if (this.sphere) {
            this.scene.remove(this.sphere);
            this.sphere.geometry.dispose();
            if (this.sphere.material.map) {
                this.sphere.material.map.dispose();
            }
            this.sphere.material.dispose();
        }
        this.renderer.dispose();
    }
}

export const initBubbleSphere = (canvas, textureCanvas) => {
    const bubble = new BubbleSphere(canvas);
    if (textureCanvas) {
        bubble.updateTexture(textureCanvas);
    }
    return bubble;
};


