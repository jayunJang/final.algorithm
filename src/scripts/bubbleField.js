import { shuffleArray } from "./utils.js";

class BubbleField {
    constructor(canvas, bubbles) {
        this.canvas = canvas;
        this.bubbles = bubbles;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

        this.clock = new THREE.Clock();
        this.spheres = [];
        this.popParticles = [];
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();
        this.animationId = null;

        this.initScene();
        this.registerEvents();
        this.animate();
    }

    initScene() {
        this.camera.position.set(0, 0, 28);
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);
        const directional = new THREE.DirectionalLight(0xffffff, 0.65);
        directional.position.set(10, 12, 8);
        this.scene.add(directional);

        const fogColor = new THREE.Color(0x0b0d1d);
        this.scene.fog = new THREE.FogExp2(fogColor, 0.02);
        this.scene.background = fogColor;

        this.createBubbles();
    }

    createBubbles() {
        const bubbleData = shuffleArray(this.bubbles);
        const geometry = new THREE.SphereGeometry(2.1, 32, 32);

        bubbleData.forEach((data, index) => {
            const material = new THREE.MeshStandardMaterial({
                color: data.color || 0xffffff,
                emissive: 0x111122,
                metalness: 0.3,
                roughness: 0.25,
                transparent: true,
                opacity: 0.9,
            });
            const sphere = new THREE.Mesh(geometry.clone(), material);
            sphere.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 26,
                (Math.random() - 0.5) * 40
            );
            sphere.userData = {
                bubble: data,
                seed: Math.random() * Math.PI * 2 + index,
            };
            this.scene.add(sphere);
            this.spheres.push(sphere);
        });
    }

    registerEvents() {
        this.canvas.addEventListener("pointermove", this.onPointerMove);
        this.canvas.addEventListener("click", this.onPointerClick);
        window.addEventListener("resize", this.onResize);
    }

    removeEvents() {
        this.canvas.removeEventListener("pointermove", this.onPointerMove);
        this.canvas.removeEventListener("click", this.onPointerClick);
        window.removeEventListener("resize", this.onResize);
    }

    onPointerMove = (event) => {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    onPointerClick = () => {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const intersects = this.raycaster.intersectObjects(this.spheres);
        if (intersects.length > 0) {
            const sphere = intersects[0].object;
            this.popBubble(sphere);
        }
    };

    popBubble(sphere) {
        const particleGeometry = new THREE.BufferGeometry();
        const count = 60;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i += 1) {
            positions[i * 3] = (Math.random() - 0.5) * 0.3;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        }
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: sphere.material.color,
            size: 0.12,
            transparent: true,
            opacity: 0.9,
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.position.copy(sphere.position);
        particles.userData.birth = this.clock.getElapsedTime();
        this.scene.add(particles);
        this.popParticles.push(particles);

        this.scene.remove(sphere);
        this.spheres = this.spheres.filter((item) => item !== sphere);
        sphere.geometry.dispose();
        sphere.material.dispose();
    }

    updateParticles(delta, elapsed) {
        this.popParticles = this.popParticles.filter((particles) => {
            const age = elapsed - particles.userData.birth;
            particles.material.opacity = Math.max(0, 0.9 - age * 1.4);
            particles.position.y += delta * 1.2;
            particles.scale.addScalar(delta * 1.5);
            if (age > 1.2) {
                this.scene.remove(particles);
                particles.geometry.dispose();
                particles.material.dispose();
                return false;
            }
            return true;
        });
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        const elapsed = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        this.spheres.forEach((sphere) => {
            const { seed } = sphere.userData;
            sphere.position.y += Math.sin(elapsed + seed) * 0.002;
            sphere.position.x += Math.cos(elapsed * 0.5 + seed) * 0.002;
            sphere.rotation.y += delta * 0.2;
            sphere.rotation.x += delta * 0.1;
        });

        this.updateParticles(delta, elapsed);
        this.renderer.render(this.scene, this.camera);
    };

    onResize = () => {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    };

    dispose() {
        cancelAnimationFrame(this.animationId);
        this.removeEvents();
        this.spheres.forEach((sphere) => {
            sphere.geometry.dispose();
            sphere.material.dispose();
        });
        this.popParticles.forEach((particles) => {
            particles.geometry.dispose();
            particles.material.dispose();
        });
        this.renderer.dispose();
    }
}

export const initBubbleField = (canvas, bubbles) => new BubbleField(canvas, bubbles);




