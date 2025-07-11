import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class PortfolioExperience {
    constructor() {
        this.portfolioData = {
            about: {
                title: "About Mohammed Saqhib",
                content: `<p>I am an aspiring Data Science and Analytics Professional with a strong foundation in statistical analysis, machine learning, and data visualization. Based in Bengaluru, India, I combine technical expertise with analytical thinking to solve complex problems through data-driven solutions.</p>`
            },
            skills: {
                title: "Technical Skills & Expertise",
                content: `<p>My technical toolkit spans across various domains of data science and analytics:</p><ul><li>Programming: Python, R, SQL, JavaScript</li><li>Data Viz: Power BI, Tableau, Matplotlib, Seaborn</li><li>ML/AI: Scikit-learn, TensorFlow, Keras, PyTorch</li><li>Cloud & Tools: AWS, Azure, Git, Docker</li></ul>`
            },
            projects: {
                title: "Featured Projects",
                content: `<p>Here are some of my key projects:</p><ul><li><strong>Advanced Stock Prediction Dashboard:</strong> ML-powered stock analysis platform.</li><li><strong>Fraud Detection System:</strong> Real-time fraud detection using ML.</li><li><strong>Formula 1 Data Hub:</strong> Comprehensive F1 data analysis and visualization platform.</li></ul>`
            },
            contact: {
                title: "Let's Connect & Collaborate",
                content: `<p>Ready to discuss opportunities or collaborate on exciting projects? I'd love to hear from you! Find me on LinkedIn or check out my GitHub.</p>`
            }
        };

        this.init();
    }

    init() {
        this.setupDOM();
        this.setupLoadingManager();
        this.setupScene();
        this.setupPhysics();
        this.setupWorld();
        this.setupVehicle();
        this.setupEventListeners();
        this.animate();
    }

    setupDOM() {
        this.canvas = document.querySelector('.webgl');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.loadingBar = document.querySelector('.loading-bar');
        this.popup = document.querySelector('.popup');
        this.sectionPanel = document.querySelector('.section-panel');
        this.panelTitle = document.getElementById('panelTitle');
        this.panelContent = document.getElementById('panelContent');
        this.closeButton = document.querySelector('.close-button');
    }

    setupLoadingManager() {
        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            this.loadingBar.style.width = `${(itemsLoaded / itemsTotal) * 100}%`;
        };
        this.loadingManager.onLoad = () => {
            setTimeout(() => {
                this.loadingScreen.classList.add('fade-out');
            }, 500);
        };
        this.fontLoader = new FontLoader(this.loadingManager);
        this.gltfLoader = new GLTFLoader(this.loadingManager);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);
        this.scene.fog = new THREE.Fog(this.scene.background, 100, 300);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 20);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.clock = new THREE.Clock();
    }

    setupPhysics() {
        this.physicsWorld = new CANNON.World();
        this.physicsWorld.gravity.set(0, -9.82, 0);
        this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
        this.physicsWorld.solver.iterations = 10;
        this.physicsObjects = [];
    }

    setupWorld() {
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.set(2048, 2048);
        this.scene.add(directionalLight);

        // Ground
        const groundMaterial = new CANNON.Material('ground');
        const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
        groundBody.addShape(new CANNON.Plane());
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(groundBody);

        const groundMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500),
            new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 })
        );
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);

        // Interaction Zones
        this.interactionZones = [];
        const zonePositions = {
            about: new CANNON.Vec3(0, 1, -50),
            skills: new CANNON.Vec3(50, 1, 0),
            projects: new CANNON.Vec3(-50, 1, 0),
            contact: new CANNON.Vec3(0, 1, 50)
        };

        this.fontLoader.load('https://unpkg.com/three@0.158.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            for (const key in zonePositions) {
                const zone = {
                    id: key,
                    position: zonePositions[key],
                    radius: 15
                };
                this.interactionZones.push(zone);

                const textGeo = new TextGeometry(this.portfolioData[key].title, {
                    font: font, size: 5, height: 0.5,
                });
                textGeo.center();
                const textMat = new THREE.MeshStandardMaterial({ color: 0xff8c00 });
                const textMesh = new THREE.Mesh(textGeo, textMat);
                textMesh.position.copy(zone.position);
                textMesh.position.y += 10;
                this.scene.add(textMesh);
            }
        });
    }

    setupVehicle() {
        const chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.4, 2));
        const chassisBody = new CANNON.Body({ mass: 150 });
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 4, 0);

        // Load car model
        this.gltfLoader.load('https://bruno-simon.com/models/car-body.glb', (gltf) => {
            const carModel = gltf.scene;
            carModel.scale.set(0.5, 0.5, 0.5);
            this.physicsObjects.push({ mesh: carModel, body: chassisBody });
            this.scene.add(carModel);
        });


        this.vehicle = new CANNON.RaycastVehicle({ chassisBody });

        const wheelOptions = {
            radius: 0.4,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 30,
            suspensionRestLength: 0.3,
            frictionSlip: 1.4,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(0, 0, 1),
            chassisConnectionPointLocal: new CANNON.Vec3(),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true,
        };

        const wheelPositions = [
            new CANNON.Vec3(-1, 0, 1.5), new CANNON.Vec3(1, 0, 1.5),
            new CANNON.Vec3(-1, 0, -1.5), new CANNON.Vec3(1, 0, -1.5)
        ];

        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

        wheelPositions.forEach((pos) => {
            wheelOptions.chassisConnectionPointLocal.copy(pos);
            this.vehicle.addWheel(wheelOptions);
            const wheelMesh = new THREE.Mesh(wheelGeo, wheelMat);
            wheelMesh.rotation.z = Math.PI / 2;
            wheelMesh.castShadow = true;
            this.physicsObjects.push({ mesh: wheelMesh, body: this.vehicle.wheelInfos[this.vehicle.wheelInfos.length - 1] });
            this.scene.add(wheelMesh);
        });

        this.vehicle.addToWorld(this.physicsWorld);
    }

    setupEventListeners() {
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        this.closeButton.addEventListener('click', () => {
            this.sectionPanel.classList.remove('visible');
        });
    }

    updateVehicle() {
        const maxSteerVal = 0.5;
        const maxForce = 1000;

        let force = 0;
        if (this.keys['w']) force = -maxForce;
        if (this.keys['s']) force = maxForce / 2;

        let steer = 0;
        if (this.keys['a']) steer = maxSteerVal;
        if (this.keys['d']) steer = -maxSteerVal;

        this.vehicle.setSteeringValue(steer, 0);
        this.vehicle.setSteeringValue(steer, 1);

        this.vehicle.applyEngineForce(force, 2);
        this.vehicle.applyEngineForce(force, 3);

        const isDrifting = this.keys['shift'];
        this.vehicle.wheelInfos[2].frictionSlip = this.vehicle.wheelInfos[3].frictionSlip = isDrifting ? 0.5 : 1.4;
        
        if(this.keys['r']) {
            this.vehicle.chassisBody.position.set(0, 4, 0);
            this.vehicle.chassisBody.quaternion.set(0, 0, 0, 1);
        }
    }

    updateCamera() {
        const chassisPos = this.vehicle.chassisBody.position;
        const idealOffset = new THREE.Vector3(0, 5, 10);
        idealOffset.applyQuaternion(this.vehicle.chassisBody.quaternion);
        idealOffset.add(chassisPos);
        this.camera.position.lerp(idealOffset, 0.1);
        this.camera.lookAt(chassisPos);
    }

    checkInteractions() {
        const carPos = this.vehicle.chassisBody.position;
        this.activeZone = null;

        for (const zone of this.interactionZones) {
            if (carPos.distanceTo(zone.position) < zone.radius) {
                this.activeZone = zone;
                break;
            }
        }

        if (this.activeZone) {
            this.popup.classList.add('visible');
            if (this.keys['e']) {
                const data = this.portfolioData[this.activeZone.id];
                this.panelTitle.textContent = data.title;
                this.panelContent.innerHTML = data.content;
                this.sectionPanel.classList.add('visible');
            }
        } else {
            this.popup.classList.remove('visible');
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const dt = this.clock.getDelta();
        this.physicsWorld.step(1 / 60, dt);

        this.updateVehicle();
        this.checkInteractions();

        for (const obj of this.physicsObjects) {
            if (obj.body.worldTransform) { // Wheel
                obj.mesh.position.copy(obj.body.worldTransform.position);
                obj.mesh.quaternion.copy(obj.body.worldTransform.quaternion);
            } else { // Chassis
                obj.mesh.position.copy(obj.body.position);
                obj.mesh.quaternion.copy(obj.body.quaternion);
            }
        }

        this.updateCamera();
        this.renderer.render(this.scene, this.camera);
    }
}

new PortfolioExperience();
