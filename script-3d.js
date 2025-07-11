// 3D Portfolio Script
class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.raycaster = null;
        this.mouse = null;
        this.objects = [];
        this.currentSection = 'about';
        this.isLoading = true;
        
        this.init();
    }

    init() {
        try {
            console.log('Initializing 3D Portfolio...');
            this.setupScene();
            console.log('Scene setup complete');
            this.setupCamera();
            console.log('Camera setup complete');
            this.setupRenderer();
            console.log('Renderer setup complete');
            this.setupControls();
            console.log('Controls setup complete');
            this.setupRaycaster();
            console.log('Raycaster setup complete');
            this.setupLights();
            console.log('Lights setup complete');
            this.createWorld();
            console.log('World creation complete');
            this.setupEventListeners();
            console.log('Event listeners setup complete');
            this.animate();
            console.log('Animation started');
            this.hideLoadingScreen();
            console.log('Loading screen hidden');
        } catch (error) {
            console.error('Error initializing 3D Portfolio:', error);
            this.hideLoadingScreen(); // Hide loading screen even if there's an error
        }
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Add fog for atmosphere
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 10);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 30;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for atmosphere
        const pointLight1 = new THREE.PointLight(0x00d4ff, 1, 20);
        pointLight1.position.set(-5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff6b6b, 0.5, 15);
        pointLight2.position.set(5, 3, -5);
        this.scene.add(pointLight2);
    }

    createWorld() {
        this.createGround();
        this.createAboutSection();
        this.createSkillsSection();
        this.createProjectsSection();
        this.createJourneySection();
        this.createContactSection();
        this.createParticleSystem();
        this.createAmbientElements();
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.3
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Add grid
        const gridHelper = new THREE.GridHelper(100, 50, 0x666666, 0x333333);
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
    }

    createAboutSection() {
        // About me cube
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00d4ff,
            emissive: 0x002244,
            shininess: 100
        });
        const aboutCube = new THREE.Mesh(geometry, material);
        aboutCube.position.set(-8, 1, 0);
        aboutCube.castShadow = true;
        aboutCube.userData = { 
            type: 'about',
            title: 'About Me',
            content: `
                <h3>About Mohammed Saqhib</h3>
                <p>Aspiring Data Science and Analytics Professional with proficiency in data analysis, data visualization, and data engineering. Skilled in transforming complex datasets into actionable insights using Python, SQL, and Power BI.</p>
                <p>Currently working as a Machine Learning Intern at Quantiota, developing real-time data pipelines and integrating ML models for market trend prediction.</p>
                <div class="skills">
                    <span class="skill-tag">Data Analysis</span>
                    <span class="skill-tag">Machine Learning</span>
                    <span class="skill-tag">Python</span>
                    <span class="skill-tag">SQL</span>
                    <span class="skill-tag">Power BI</span>
                </div>
            `
        };
        this.scene.add(aboutCube);
        this.objects.push(aboutCube);

        // Floating text
        this.createFloatingText('ABOUT', -8, 4, 0);
    }

    createSkillsSection() {
        const skillsData = [
            // Core Data Science Skills
            { name: 'Python', color: 0x3776ab, position: [-6, 1, -8], rating: 4 },
            { name: 'SQL', color: 0xf29111, position: [-4, 1, -8], rating: 5 },
            { name: 'Power BI', color: 0xf2c811, position: [-2, 1, -8], rating: 5 },
            { name: 'Machine Learning', color: 0xff6b6b, position: [0, 1, -8], rating: 4 },
            { name: 'Data Science', color: 0x4ecdc4, position: [2, 1, -8], rating: 4 },
            
            // Additional Skills
            { name: 'Deep Learning', color: 0x9b59b6, position: [4, 1, -8], rating: 3 },
            { name: 'Tableau', color: 0xe67e22, position: [6, 1, -8], rating: 4 },
            { name: 'Jupyter', color: 0x34495e, position: [-6, 1, -10], rating: 4 },
            { name: 'Azure', color: 0x0078d4, position: [-4, 1, -10], rating: 4 },
            { name: 'Excel', color: 0x217346, position: [-2, 1, -10], rating: 5 },
            { name: 'AWS', color: 0xff9900, position: [0, 1, -10], rating: 4 },
        ];

        skillsData.forEach(skill => {
            const height = skill.rating * 0.5; // Height based on rating
            const geometry = new THREE.CylinderGeometry(0.5, 0.5, height, 8);
            const material = new THREE.MeshPhongMaterial({ 
                color: skill.color,
                emissive: new THREE.Color(skill.color).multiplyScalar(0.1),
                shininess: 100
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.set(skill.position[0], skill.position[1] + height/2, skill.position[2]);
            cylinder.castShadow = true;
            cylinder.userData = { 
                type: 'skill',
                name: skill.name,
                title: skill.name,
                rating: skill.rating,
                content: this.getSkillContent(skill.name)
            };
            this.scene.add(cylinder);
            this.objects.push(cylinder);
            
            // Add floating skill rating stars
            this.createSkillRating(skill.name, skill.rating, skill.position[0], skill.position[1] + height + 1, skill.position[2]);
        });

        this.createFloatingText('SKILLS', 0, 4, -8);
    }

    createProjectsSection() {
        const projectsData = [
            // Featured Projects
            {
                name: 'Advanced Stock Prediction Dashboard',
                color: 0x667eea,
                position: [8, 1, 0],
                image: 'Cover Page/Advanced-Stock-Prediction-Analysis-Dashboard.webp.png',
                github: 'https://github.com/Mohammed-Saqhib/Advanced-Stock-Prediction-Analysis-Dashboard',
                skills: ['Python', 'Machine Learning', 'Data Analysis', 'Visualization']
            },
            {
                name: 'Fraud Detection System',
                color: 0x764ba2,
                position: [10, 1, 0],
                image: 'Cover Page/fraud-detection-system.png',
                github: 'https://github.com/Mohammed-Saqhib/fraud-detection-system',
                skills: ['Python', 'ML', 'Security', 'Data Science']
            },
            {
                name: 'AI CSV Dashboard Generator',
                color: 0xf093fb,
                position: [12, 1, 0],
                image: 'Cover Page/Mohammed-Saqhib-AI-CSV-Dashboard-Generator.png',
                github: 'https://github.com/Mohammed-Saqhib/Mohammed-Saqhib-AI-CSV-Dashboard-Generator',
                skills: ['Python', 'AI', 'Dashboard', 'Automation']
            },
            {
                name: 'Facial Recognition System',
                color: 0xf5576c,
                position: [14, 1, 0],
                image: 'Cover Page/Facial-Recognition-Attendance-Management-System.png',
                github: 'https://github.com/Mohammed-Saqhib/Facial-Recognition-Attendance-Management-System',
                skills: ['Python', 'Computer Vision', 'Deep Learning', 'OpenCV']
            },
            // Additional Projects
            {
                name: 'BookStore Application',
                color: 0x3498db,
                position: [8, 1, 2],
                image: 'photos/Book Store application.webp',
                github: 'https://github.com/Mohammed-Saqhib/Mohammed-Saqhib-BCA-V-Sem-FSD-PROJECT',
                skills: ['Python', 'CSS', 'Bootstrap', 'JavaScript']
            },
            {
                name: 'Carpooling Simulation',
                color: 0xe74c3c,
                position: [10, 1, 2],
                image: 'Cover Page/Carpooling-Simulation.png',
                github: 'https://github.com/Mohammed-Saqhib/Carpooling-Simulation',
                skills: ['Python', 'Simulation', 'Algorithms', 'Mapping']
            },
            {
                name: 'Kritya Fashion Demo',
                color: 0x9b59b6,
                position: [12, 1, 2],
                image: 'Cover Page/kritya-fashion-demo.png',
                github: 'https://github.com/Mohammed-Saqhib/kritya-fashion-demo',
                skills: ['HTML', 'CSS', 'JavaScript', 'Node.js']
            },
            {
                name: 'Netflix Household Verify',
                color: 0xe67e22,
                position: [14, 1, 2],
                image: 'Cover Page/Netflix-Household-Verify.png',
                github: 'https://github.com/Mohammed-Saqhib/Netflix-Household-Verify',
                skills: ['Python', 'JavaScript', 'Security', 'API']
            },
            // More Projects
            {
                name: 'TTS Phoneme Model',
                color: 0x2ecc71,
                position: [8, 1, 4],
                image: 'Cover Page/TTS-phoneme-model.png',
                github: 'https://github.com/Mohammed-Saqhib/TTS-phoneme-model',
                skills: ['Python', 'NLP', 'Audio Processing', 'Deep Learning']
            },
            {
                name: 'Indian Contact Scraper',
                color: 0x1abc9c,
                position: [10, 1, 4],
                image: 'Cover Page/Indian-Contact-Scraper.png',
                github: 'https://github.com/Mohammed-Saqhib/Indian-Contact-Scraper',
                skills: ['Python', 'Web Scraping', 'Data Collection', 'Automation']
            },
            {
                name: 'Hill Climb Gesture Controller',
                color: 0xf39c12,
                position: [12, 1, 4],
                image: 'Cover Page/Hill-Climb-Gesture-Controller.png',
                github: 'https://github.com/Mohammed-Saqhib/Hill-Climb-Gesture-Controller',
                skills: ['Python', 'Computer Vision', 'Game Control', 'OpenCV']
            },
            {
                name: 'Formula1 DataHub',
                color: 0xd35400,
                position: [14, 1, 4],
                image: 'Cover Page/Formula1-DataHub.png',
                github: 'https://github.com/Mohammed-Saqhib/Formula1-DataHub',
                skills: ['Python', 'Data Analysis', 'Sports Analytics', 'API']
            }
        ];

        projectsData.forEach((project, index) => {
            const geometry = new THREE.OctahedronGeometry(0.8);
            const material = new THREE.MeshPhongMaterial({ 
                color: project.color,
                emissive: new THREE.Color(project.color).multiplyScalar(0.1),
                shininess: 100
            });
            const octahedron = new THREE.Mesh(geometry, material);
            octahedron.position.set(...project.position);
            octahedron.castShadow = true;
            octahedron.userData = { 
                type: 'project',
                name: project.name,
                title: project.name,
                content: this.getProjectContent(project),
                github: project.github,
                skills: project.skills
            };
            this.scene.add(octahedron);
            this.objects.push(octahedron);
            
            // Add project name label
            this.createProjectLabel(project.name, project.position[0], project.position[1] + 1.5, project.position[2]);
        });

        this.createFloatingText('PROJECTS', 11, 4, 2);
    }

    createContactSection() {
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff88,
            emissive: 0x002211,
            shininess: 100
        });
        const contactSphere = new THREE.Mesh(geometry, material);
        contactSphere.position.set(0, 1.5, 8);
        contactSphere.castShadow = true;
        contactSphere.userData = { 
            type: 'contact',
            title: 'Contact Me',
            content: `
                <h3>Get In Touch</h3>
                <p>Let's connect and create something amazing together!</p>
                <div style="margin: 1rem 0;">
                    <p>📍 Bengaluru, Karnataka, India</p>
                    <p>📧 msaqhib76@gmail.com</p>
                    <p>📱 +91 6239121164</p>
                </div>
                <div class="project-links">
                    <a href="https://linkedin.com/in/mohammed-saqhib-87b8b325a" target="_blank">LinkedIn</a>
                    <a href="https://github.com/Mohammed-Saqhib" target="_blank">GitHub</a>
                    <a href="mailto:msaqhib76@gmail.com">Email</a>
                </div>
            `
        };
        this.scene.add(contactSphere);
        this.objects.push(contactSphere);

        this.createFloatingText('CONTACT', 0, 4, 8);
    }

    createParticleSystem() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.8
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particlesMesh);

        // Animate particles
        this.animateParticles = () => {
            const positions = particlesMesh.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.001;
            }
            particlesMesh.geometry.attributes.position.needsUpdate = true;
        };
    }

    createFloatingText(text, x, y, z) {
        // This would normally use TextGeometry, but for simplicity we'll create a plane with text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.font = 'Bold 48px Poppins';
        context.fillStyle = '#00d4ff';
        context.textAlign = 'center';
        context.fillText(text, 256, 80);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            opacity: 0.8
        });
        const geometry = new THREE.PlaneGeometry(4, 1);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.lookAt(this.camera.position);
        this.scene.add(mesh);
    }

    getSkillContent(skillName) {
        const skillContents = {
            'Python': `
                <h3>Python</h3>
                <img src="photos/python.svg" alt="Python" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Advanced Python programming for data analysis, machine learning, and automation. Skilled in pandas, NumPy, and Scikit-learn.</p>
                <div class="skills">
                    <span class="skill-tag">Pandas</span>
                    <span class="skill-tag">NumPy</span>
                    <span class="skill-tag">Scikit-learn</span>
                    <span class="skill-tag">Flask</span>
                    <span class="skill-tag">FastAPI</span>
                </div>
            `,
            'SQL': `
                <h3>SQL</h3>
                <img src="photos/Sql.png" alt="SQL" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Database querying, joins, optimization, and complex data manipulation. Expert in PostgreSQL and MySQL.</p>
                <div class="skills">
                    <span class="skill-tag">MySQL</span>
                    <span class="skill-tag">PostgreSQL</span>
                    <span class="skill-tag">Query Optimization</span>
                    <span class="skill-tag">ETL Pipelines</span>
                </div>
            `,
            'Power BI': `
                <h3>Power BI</h3>
                <img src="photos/Power Bi.png" alt="Power BI" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Business intelligence, interactive dashboards, and data storytelling. Advanced DAX and data modeling.</p>
                <div class="skills">
                    <span class="skill-tag">DAX</span>
                    <span class="skill-tag">Data Modeling</span>
                    <span class="skill-tag">Dashboards</span>
                    <span class="skill-tag">Business Intelligence</span>
                </div>
            `,
            'Machine Learning': `
                <h3>Machine Learning</h3>
                <img src="photos/Machine Learning.png" alt="ML" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Predictive modeling, classification, regression, and clustering algorithms. Experience with model deployment.</p>
                <div class="skills">
                    <span class="skill-tag">Scikit-learn</span>
                    <span class="skill-tag">TensorFlow</span>
                    <span class="skill-tag">Model Deployment</span>
                    <span class="skill-tag">Feature Engineering</span>
                </div>
            `,
            'Data Science': `
                <h3>Data Science</h3>
                <img src="photos/Data Science.png" alt="Data Science" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Statistical analysis, hypothesis testing, and data-driven insights. Expert in EDA and data visualization.</p>
                <div class="skills">
                    <span class="skill-tag">Statistical Analysis</span>
                    <span class="skill-tag">Data Visualization</span>
                    <span class="skill-tag">EDA</span>
                    <span class="skill-tag">Hypothesis Testing</span>
                </div>
            `,
            'Deep Learning': `
                <h3>Deep Learning</h3>
                <img src="photos/Deep Learning.png" alt="Deep Learning" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Neural networks, image processing, and computer vision. Experience with TensorFlow and PyTorch.</p>
                <div class="skills">
                    <span class="skill-tag">TensorFlow</span>
                    <span class="skill-tag">PyTorch</span>
                    <span class="skill-tag">Computer Vision</span>
                    <span class="skill-tag">Neural Networks</span>
                </div>
            `,
            'Tableau': `
                <h3>Tableau</h3>
                <img src="photos/2tableau.svg" alt="Tableau" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Interactive dashboards and data storytelling. Advanced calculations and visualization techniques.</p>
                <div class="skills">
                    <span class="skill-tag">Dashboards</span>
                    <span class="skill-tag">Data Storytelling</span>
                    <span class="skill-tag">Calculations</span>
                    <span class="skill-tag">Visualization</span>
                </div>
            `,
            'Jupyter': `
                <h3>Jupyter</h3>
                <img src="photos/jupyter.svg" alt="Jupyter" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Interactive computing and data exploration. Expert in notebook development and data analysis workflows.</p>
                <div class="skills">
                    <span class="skill-tag">Data Exploration</span>
                    <span class="skill-tag">Interactive Computing</span>
                    <span class="skill-tag">Prototyping</span>
                    <span class="skill-tag">Documentation</span>
                </div>
            `,
            'Azure': `
                <h3>Azure</h3>
                <img src="photos/azure-48.png" alt="Azure" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Cloud computing and data solutions. Experience with Azure ML, Data Factory, and AI services.</p>
                <div class="skills">
                    <span class="skill-tag">Azure ML</span>
                    <span class="skill-tag">Data Factory</span>
                    <span class="skill-tag">AI Services</span>
                    <span class="skill-tag">Cloud Computing</span>
                </div>
            `,
            'Excel': `
                <h3>Excel</h3>
                <img src="photos/excel-50.png" alt="Excel" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Advanced formulas, pivot tables, and data models. Expert in VBA and automated reporting.</p>
                <div class="skills">
                    <span class="skill-tag">Advanced Formulas</span>
                    <span class="skill-tag">Pivot Tables</span>
                    <span class="skill-tag">VBA</span>
                    <span class="skill-tag">Data Models</span>
                </div>
            `,
            'AWS': `
                <h3>AWS</h3>
                <img src="photos/aws-50.png" alt="AWS" style="width: 100px; height: 100px; margin: 1rem 0;">
                <p>Cloud infrastructure and services. Experience with S3, Lambda, EC2, and data processing.</p>
                <div class="skills">
                    <span class="skill-tag">S3</span>
                    <span class="skill-tag">Lambda</span>
                    <span class="skill-tag">EC2</span>
                    <span class="skill-tag">Data Processing</span>
                </div>
            `
        };
        return skillContents[skillName] || '';
    }

    getProjectContent(project) {
        return `
            <h3>${project.name}</h3>
            <img src="${project.image}" alt="${project.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; margin: 1rem 0;">
            <p>An innovative ${project.name.toLowerCase()} showcasing advanced data science and machine learning techniques. This project demonstrates expertise in modern development practices and cutting-edge technologies.</p>
            <br>
            <h4>Technologies Used:</h4>
            <div class="skills" style="margin: 1rem 0;">
                ${project.skills ? project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('') : ''}
            </div>
            <br>
            <div class="project-links">
                <a href="${project.github}" target="_blank">View on GitHub</a>
                <a href="${project.github}" target="_blank">Live Demo</a>
            </div>
        `;
    }

    getJourneyContent(job) {
        return `
            <h3>${job.title}</h3>
            <h4 style="color: #00d4ff; margin-bottom: 1rem;">${job.company}</h4>
            <p><strong>Period:</strong> ${job.period}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Role:</strong> ${job.role}</p>
            <br>
            <h4>Key Achievements:</h4>
            <ul style="margin: 1rem 0; padding-left: 1.5rem;">
                ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
            <br>
            <div class="skills">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        `;
    }

    setupEventListeners() {
        // Mouse events
        window.addEventListener('click', (event) => this.onMouseClick(event));
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('resize', () => this.onWindowResize());

        // Keyboard controls
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            this.showProjectCard(clickedObject.userData);
            
            // Animate the clicked object
            gsap.to(clickedObject.scale, {
                x: 1.2, y: 1.2, z: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects);

        // Reset all objects
        this.objects.forEach(obj => {
            obj.material.emissive.setHex(0x000000);
        });

        // Highlight hovered object
        if (intersects.length > 0) {
            const hoveredObject = intersects[0].object;
            hoveredObject.material.emissive.setHex(0x444444);
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }

    onKeyDown(event) {
        const moveSpeed = 0.5;
        switch (event.code) {
            case 'KeyW':
                this.camera.position.z -= moveSpeed;
                break;
            case 'KeyS':
                this.camera.position.z += moveSpeed;
                break;
            case 'KeyA':
                this.camera.position.x -= moveSpeed;
                break;
            case 'KeyD':
                this.camera.position.x += moveSpeed;
                break;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    showProjectCard(userData) {
        const card = document.getElementById('project-card');
        const content = document.getElementById('project-content');
        
        content.innerHTML = userData.content;
        card.classList.add('active');
    }

    hideLoadingScreen() {
        // Hide loading screen immediately
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const infoPanel = document.getElementById('info-panel');
                if (infoPanel) {
                    infoPanel.classList.add('active');
                }
                this.isLoading = false;
                console.log('3D Portfolio loaded successfully!');
            }, 500);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();

        // Animate objects
        this.objects.forEach((obj, index) => {
            // Rotate objects
            obj.rotation.y += 0.005;
            
            // Add floating animation
            const time = Date.now() * 0.001;
            obj.position.y += Math.sin(time + index) * 0.002;
            
            // Add pulsing effect for interactive objects
            if (obj.userData.type) {
                const scale = 1 + Math.sin(time * 2 + index) * 0.05;
                obj.scale.setScalar(scale);
            }
        });

        // Animate ambient objects
        if (this.ambientObjects) {
            this.ambientObjects.forEach((obj, index) => {
                const time = Date.now() * 0.001;
                obj.rotation.x += 0.01;
                obj.rotation.y += 0.008;
                obj.position.y += Math.sin(time + index) * 0.001;
            });
        }

        // Animate particles
        if (this.animateParticles) {
            this.animateParticles();
        }

        // Animate ambient objects
        if (this.ambientObjects) {
            this.ambientObjects.forEach((obj, index) => {
                obj.rotation.y += 0.01;
                obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
            });
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    createAmbientElements() {
        // Create floating data visualization cubes
        for (let i = 0; i < 20; i++) {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
                transparent: true,
                opacity: 0.6
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                (Math.random() - 0.5) * 40,
                Math.random() * 10 + 5,
                (Math.random() - 0.5) * 40
            );
            cube.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            this.scene.add(cube);
            
            // Add to ambient objects for animation
            this.ambientObjects = this.ambientObjects || [];
            this.ambientObjects.push(cube);
        }

        // Create tech stack floating icons
        const techStack = [
            { name: 'Python', position: [-15, 3, 0], color: 0x3776ab },
            { name: 'SQL', position: [-15, 3, 2], color: 0xf29111 },
            { name: 'PowerBI', position: [-15, 3, 4], color: 0xf2c811 },
            { name: 'Azure', position: [-15, 3, 6], color: 0x0078d4 },
            { name: 'AWS', position: [-15, 3, 8], color: 0xff9900 }
        ];

        techStack.forEach(tech => {
            const geometry = new THREE.RingGeometry(0.3, 0.5, 16);
            const material = new THREE.MeshPhongMaterial({ 
                color: tech.color,
                transparent: true,
                opacity: 0.8
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.position.set(...tech.position);
            ring.rotation.y = Math.PI / 2;
            this.scene.add(ring);
            
            this.ambientObjects = this.ambientObjects || [];
            this.ambientObjects.push(ring);
        });

        // Create achievement badges
        const achievements = [
            { text: 'Data Professional', position: [15, 3, 0], color: 0x00d4ff },
            { text: 'ML Engineer', position: [15, 3, 2], color: 0xff6b6b },
            { text: '4+ Projects', position: [15, 3, 4], color: 0x4ecdc4 },
            { text: 'Bengaluru Based', position: [15, 3, 6], color: 0x9b59b6 }
        ];

        achievements.forEach(achievement => {
            const geometry = new THREE.SphereGeometry(0.4, 16, 16);
            const material = new THREE.MeshPhongMaterial({ 
                color: achievement.color,
                emissive: new THREE.Color(achievement.color).multiplyScalar(0.1)
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(...achievement.position);
            sphere.userData = {
                type: 'achievement',
                title: achievement.text,
                content: `<h3>${achievement.text}</h3><p>Part of my professional journey and achievements.</p>`
            };
            this.scene.add(sphere);
            this.objects.push(sphere);
        });
    }

    createSkillRating(skillName, rating, x, y, z) {
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = 'Bold 24px Arial';
        context.fillStyle = '#ffd700';
        context.textAlign = 'center';
        context.fillText(stars, 128, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            opacity: 0.9
        });
        const geometry = new THREE.PlaneGeometry(2, 0.5);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.lookAt(this.camera.position);
        this.scene.add(mesh);
    }

    createProjectLabel(projectName, x, y, z) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.font = 'Bold 20px Poppins';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.fillText(projectName, 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            opacity: 0.8
        });
        const geometry = new THREE.PlaneGeometry(3, 0.75);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.lookAt(this.camera.position);
        this.scene.add(mesh);
    }

    createCompanyLabel(companyName, x, y, z) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.font = 'Bold 24px Poppins';
        context.fillStyle = '#00d4ff';
        context.textAlign = 'center';
        context.fillText(companyName, 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            opacity: 0.9
        });
        const geometry = new THREE.PlaneGeometry(3, 0.75);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.lookAt(this.camera.position);
        this.scene.add(mesh);
    }

    createJourneySection() {
        const journeyData = [
            {
                title: 'Machine Learning Intern',
                company: 'Quantiota',
                period: 'Jan 2025 - Mar 2025',
                location: 'Bengaluru, India',
                role: 'ML Engineer Intern',
                position: [-8, 1, -2],
                color: 0x667eea,
                achievements: [
                    'Developed real-time data pipelines',
                    'Integrated ML models for market prediction',
                    'Optimized model performance'
                ],
                skills: ['Python', 'Docker', 'Database']
            },
            {
                title: 'Associate Intern',
                company: 'COSMIC365.AI',
                period: 'Nov - Dec 2024',
                location: 'Bengaluru, India',
                role: 'Data Analysis Intern',
                position: [-6, 1, -2],
                color: 0x764ba2,
                achievements: [
                    'Analyzed complex datasets',
                    'Created data visualization dashboards',
                    'Improved data processing efficiency'
                ],
                skills: ['Python', 'Data Analysis', 'Visualization']
            },
            {
                title: 'Data Mapping Intern',
                company: 'Singularium Technologies',
                period: 'Oct - Nov 2024',
                location: 'Bengaluru, India',
                role: 'Data Engineering Intern',
                position: [-4, 1, -2],
                color: 0xf093fb,
                achievements: [
                    'Ensured data consistency and integrity',
                    'Developed scalable data pipelines',
                    'Ensured data accuracy and documentation'
                ],
                skills: ['Python', 'Automation', 'Database']
            },
            {
                title: 'Data Science and AI Intern',
                company: 'Ioncure Tech',
                period: 'Jun - Aug 2024',
                location: 'Bengaluru, India',
                role: 'Data Science Intern',
                position: [-2, 1, -2],
                color: 0xf5576c,
                achievements: [
                    'Built predictive models for healthcare data',
                    'Analyzed large datasets for pattern recognition',
                    'Developed automated reporting workflows with Excel VBA',
                    'Implemented NLP techniques for text analysis'
                ],
                skills: ['Python', 'Machine Learning', 'Database']
            }
        ];

        journeyData.forEach((job, index) => {
            const geometry = new THREE.ConeGeometry(0.6, 1.5, 6);
            const material = new THREE.MeshPhongMaterial({ 
                color: job.color,
                emissive: new THREE.Color(job.color).multiplyScalar(0.1),
                shininess: 100
            });
            const cone = new THREE.Mesh(geometry, material);
            cone.position.set(...job.position);
            cone.castShadow = true;
            cone.userData = { 
                type: 'journey',
                title: job.title,
                company: job.company,
                content: this.getJourneyContent(job)
            };
            this.scene.add(cone);
            this.objects.push(cone);

            // Add company label
            this.createCompanyLabel(job.company, job.position[0], job.position[1] + 2.5, job.position[2]);
        });

        this.createFloatingText('JOURNEY', -5, 4, -2);
    }
}

// Global functions for UI interaction
function closeProjectCard() {
    document.getElementById('project-card').classList.remove('active');
}

function focusOnSection(section) {
    const positions = {
        'about': { x: -8, y: 5, z: 5 },
        'skills': { x: 0, y: 5, z: -5 },
        'projects': { x: 11, y: 5, z: 2 },
        'journey': { x: -5, y: 5, z: -2 },
        'contact': { x: 0, y: 5, z: 12 }
    };

    const targetPosition = positions[section];
    if (targetPosition) {
        gsap.to(portfolio3d.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: "power2.inOut"
        });
        
        // Update info panel
        updateInfoPanel(section);

        // Update section indicators
        document.querySelectorAll('.section-dot').forEach(dot => dot.classList.remove('active'));
        const sectionIndex = ['about', 'skills', 'projects', 'journey', 'contact'].indexOf(section);
        if (sectionIndex !== -1) {
            document.querySelectorAll('.section-dot')[sectionIndex].classList.add('active');
        }

        // Show info panel
        const infoPanel = document.getElementById('info-panel');
        infoPanel.classList.add('active');
    }
}

function updateInfoPanel(section) {
    const infoPanel = document.getElementById('info-panel');
    const sectionInfo = {
        'about': {
            title: 'About Me',
            content: 'Aspiring Data Science Professional with expertise in Python, SQL, and Machine Learning. Currently working as ML Engineer Intern at Quantiota.',
            skills: ['Data Science', 'Machine Learning', 'Python', 'SQL', 'Power BI']
        },
        'skills': {
            title: 'Technical Skills',
            content: 'Comprehensive skill set in data analysis, visualization, and machine learning. Proficient in multiple programming languages and tools.',
            skills: ['Python', 'SQL', 'Power BI', 'Machine Learning', 'Azure', 'AWS']
        },
        'projects': {
            title: 'Featured Projects',
            content: 'Innovative projects showcasing expertise in data science, machine learning, and software development. Click on projects to explore details.',
            skills: ['Data Science', 'ML', 'Computer Vision', 'Web Development']
        },
        'journey': {
            title: 'Professional Journey',
            content: 'Timeline of professional experience and growth. From Data Science internships to ML Engineering roles.',
            skills: ['Internships', 'Data Analysis', 'ML Engineering', 'Professional Growth']
        },
        'contact': {
            title: 'Contact Information',
            content: 'Get in touch for collaboration opportunities. Based in Bengaluru, India.',
            skills: ['Collaboration', 'Networking', 'Professional Contact']
        }
    };

    const info = sectionInfo[section];
    if (info) {
        infoPanel.innerHTML = `
            <h3>${info.title}</h3>
            <p>${info.content}</p>
            <div class="skills">
                ${info.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        `;
    }
}

// Initialize the 3D portfolio
let portfolio3d;
document.addEventListener('DOMContentLoaded', () => {
    portfolio3d = new Portfolio3D();
});
