// Enhanced 3D Portfolio Script
class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = null;
        this.mouse = null;
        this.objects = [];
        this.projectObjects = [];
        this.currentSection = 'about';
        this.isLoading = true;
        
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        try {
            console.log('🚀 Initializing 3D Portfolio...');
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupControls();
            this.setupRaycaster();
            this.setupLights();
            this.createWorld();
            this.setupEventListeners();
            this.animate();
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error initializing 3D Portfolio:', error);
            this.hideLoadingScreen();
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Add fog for atmosphere
        this.scene.fog = new THREE.Fog(0x0a0a0a, 20, 100);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        const container = document.getElementById('canvas-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
    }

    setupRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(20, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff6b6b, 0.8, 50);
        pointLight2.position.set(-10, 10, -10);
        this.scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0x4ecdc4, 0.6, 50);
        pointLight3.position.set(0, 20, 0);
        this.scene.add(pointLight3);
    }

    createWorld() {
        this.createGround();
        this.createWelcomeArea();
        this.createSkillsArea();
        this.createProjectsArea();
        this.createJourneyArea();
        this.createContactArea();
        this.createFloatingElements();
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    createWelcomeArea() {
        // Main welcome cube
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00d4ff,
            shininess: 100
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 2, 0);
        cube.castShadow = true;
        cube.userData = { 
            type: 'welcome',
            title: 'Welcome',
            description: 'Hi! I\'m Mohammed Saqhib, a passionate Data Scientist and AI Engineer with expertise in Machine Learning, Deep Learning, and Full Stack Development.'
        };
        this.scene.add(cube);
        this.objects.push(cube);

        // Floating text elements
        this.createFloatingText('Mohammed Saqhib', 0, 6, 0, 0x00d4ff);
        this.createFloatingText('Data Scientist & AI Engineer', 0, 5, 0, 0xffffff);
    }

    createSkillsArea() {
        const skills = [
            { name: 'Python', color: 0x3776ab, pos: [-8, 2, -5] },
            { name: 'Machine Learning', color: 0xff6b6b, pos: [-5, 2, -8] },
            { name: 'Deep Learning', color: 0x4ecdc4, pos: [-8, 2, -2] },
            { name: 'SQL', color: 0x336791, pos: [-5, 2, -5] },
            { name: 'Power BI', color: 0xf2c811, pos: [-8, 2, 1] },
            { name: 'Azure', color: 0x0078d4, pos: [-5, 2, -2] },
            { name: 'AWS', color: 0xff9900, pos: [-8, 2, 4] },
            { name: 'React', color: 0x61dafb, pos: [-5, 2, 1] }
        ];

        skills.forEach(skill => {
            const geometry = new THREE.SphereGeometry(0.8, 16, 16);
            const material = new THREE.MeshPhongMaterial({ 
                color: skill.color,
                shininess: 100
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(...skill.pos);
            sphere.castShadow = true;
            sphere.userData = { 
                type: 'skill',
                title: skill.name,
                description: `Skilled in ${skill.name} with hands-on experience in multiple projects.`
            };
            this.scene.add(sphere);
            this.objects.push(sphere);
        });
    }

    createProjectsArea() {
        const projects = [
            {
                name: 'US Visa Approval Prediction',
                description: 'ML model predicting visa approval using advanced algorithms',
                color: 0x667eea,
                pos: [8, 2, -5]
            },
            {
                name: 'Fraud Detection System',
                description: 'Real-time fraud detection using ensemble methods',
                color: 0x764ba2,
                pos: [5, 2, -8]
            },
            {
                name: 'Advanced Stock Analysis',
                description: 'Dashboard for comprehensive stock market analysis',
                color: 0xf093fb,
                pos: [8, 2, -2]
            },
            {
                name: 'Facial Recognition System',
                description: 'AI-powered attendance management system',
                color: 0x4facfe,
                pos: [5, 2, -5]
            },
            {
                name: 'Formula1 DataHub',
                description: 'Interactive F1 data visualization platform',
                color: 0x43e97b,
                pos: [8, 2, 1]
            },
            {
                name: 'Netflix Analytics',
                description: 'Household verification and analytics system',
                color: 0x38f9d7,
                pos: [5, 2, -2]
            }
        ];

        projects.forEach(project => {
            const geometry = new THREE.CylinderGeometry(1, 1, 2, 8);
            const material = new THREE.MeshPhongMaterial({ 
                color: project.color,
                shininess: 100
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(...project.pos);
            cylinder.castShadow = true;
            cylinder.userData = { 
                type: 'project',
                title: project.name,
                description: project.description
            };
            this.scene.add(cylinder);
            this.objects.push(cylinder);
            this.projectObjects.push(cylinder);
        });
    }

    createJourneyArea() {
        // Journey timeline
        const timelinePoints = [
            { year: '2020', event: 'Started Programming', pos: [0, 2, -15] },
            { year: '2021', event: 'First ML Project', pos: [3, 2, -15] },
            { year: '2022', event: 'Deep Learning Journey', pos: [6, 2, -15] },
            { year: '2023', event: 'Professional Projects', pos: [9, 2, -15] },
            { year: '2024', event: 'AI Specialization', pos: [12, 2, -15] }
        ];

        timelinePoints.forEach(point => {
            const geometry = new THREE.ConeGeometry(0.5, 2, 6);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0xffd700,
                shininess: 100
            });
            const cone = new THREE.Mesh(geometry, material);
            cone.position.set(...point.pos);
            cone.castShadow = true;
            cone.userData = { 
                type: 'journey',
                title: point.year,
                description: point.event
            };
            this.scene.add(cone);
            this.objects.push(cone);
        });
    }

    createContactArea() {
        const contactGeometry = new THREE.OctahedronGeometry(1.5);
        const contactMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b6b,
            shininess: 100
        });
        const contact = new THREE.Mesh(contactGeometry, contactMaterial);
        contact.position.set(0, 2, 15);
        contact.castShadow = true;
        contact.userData = { 
            type: 'contact',
            title: 'Get In Touch',
            description: 'Ready to collaborate on exciting projects! Let\'s connect and build something amazing together.'
        };
        this.scene.add(contact);
        this.objects.push(contact);
    }

    createFloatingElements() {
        // Add floating particles
        for (let i = 0; i < 100; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: Math.random() * 0xffffff,
                transparent: true,
                opacity: 0.6
            });
            const particle = new THREE.Mesh(geometry, material);
            particle.position.set(
                (Math.random() - 0.5) * 100,
                Math.random() * 30 + 5,
                (Math.random() - 0.5) * 100
            );
            this.scene.add(particle);
            this.objects.push(particle);
        }
    }

    createFloatingText(text, x, y, z, color) {
        // Create text using basic geometry (since we don't have text loader)
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.8
        });
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.set(x, y, z);
        this.scene.add(textMesh);
    }

    setupEventListeners() {
        // Mouse events
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Keyboard controls
        document.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    onMouseClick(event) {
        event.preventDefault();
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.showInfoPanel(object.userData);
            
            // Animate the clicked object
            gsap.to(object.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    onKeyDown(event) {
        switch (event.code) {
            case 'KeyW':
                this.camera.position.z -= 1;
                break;
            case 'KeyS':
                this.camera.position.z += 1;
                break;
            case 'KeyA':
                this.camera.position.x -= 1;
                break;
            case 'KeyD':
                this.camera.position.x += 1;
                break;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    showInfoPanel(data) {
        const panel = document.getElementById('info-panel');
        if (panel && data) {
            panel.innerHTML = `
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                <div class="skills">
                    <span class="skill-tag">${data.type}</span>
                </div>
            `;
            panel.classList.add('active');
        }
    }

    focusOnSection(section) {
        this.currentSection = section;
        
        let targetPosition = { x: 0, y: 10, z: 20 };
        
        switch (section) {
            case 'about':
                targetPosition = { x: 0, y: 10, z: 20 };
                break;
            case 'skills':
                targetPosition = { x: -8, y: 8, z: 0 };
                break;
            case 'projects':
                targetPosition = { x: 8, y: 8, z: 0 };
                break;
            case 'journey':
                targetPosition = { x: 6, y: 8, z: -15 };
                break;
            case 'contact':
                targetPosition = { x: 0, y: 8, z: 15 };
                break;
        }
        
        gsap.to(this.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: "power2.inOut"
        });
    }

    closeProjectCard() {
        const card = document.getElementById('project-card');
        if (card) {
            card.classList.remove('active');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
                console.log('✅ 3D Portfolio loaded successfully!');
            }, 500);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Animate objects
        this.objects.forEach((obj, index) => {
            if (obj.userData.type === 'skill') {
                obj.rotation.y += 0.01;
                obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            } else if (obj.userData.type === 'project') {
                obj.rotation.y += 0.02;
                obj.position.y += Math.cos(Date.now() * 0.001 + index) * 0.01;
            } else if (obj.userData.type === 'journey') {
                obj.rotation.y += 0.015;
            }
        });

        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Global functions for navigation
function focusOnSection(section) {
    if (window.portfolio3D) {
        window.portfolio3D.focusOnSection(section);
    }
}

function closeProjectCard() {
    if (window.portfolio3D) {
        window.portfolio3D.closeProjectCard();
    }
}

// Initialize the portfolio
window.portfolio3D = new Portfolio3D();
