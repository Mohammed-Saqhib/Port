document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Loader ---
    const loader = document.getElementById('loader');
    window.addEventListener("load", function() {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });

    // --- 2. Simple CSS Smooth Scrolling ---
    document.documentElement.style.scrollBehavior = 'smooth';

    // --- 3. Theme Toggle Functionality ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Set theme on load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // --- 4. Custom Cursor ---
    const cursor = document.getElementById('custom-cursor');
    const hoverElements = document.querySelectorAll('[data-cursor-hover], a, button');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // --- 5. Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuItems = document.getElementById('menu-items');
    
    if (menuToggle && menuItems) {
        menuToggle.addEventListener('click', () => {
            menuItems.classList.toggle('open');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (menuItems.classList.contains('open')) {
                    menuItems.classList.remove('open');
                }
            });
        });
    }

    // --- 6. Typed.js Configuration ---
    if (document.querySelector(".dynamic-text")) {
        new Typed(".dynamic-text", {
            strings: ["Data Engineer", "Data Analyst", "Machine Learning Engineer", "Data Scientist"],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 1500,
            loop: true
        });
    }

    // --- 7. Project Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectElements = document.querySelectorAll('.project-tile');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            // Add smooth transition
            projectElements.forEach(tile => {
                if (filterValue === 'all' || tile.getAttribute('data-category') === filterValue) {
                    tile.classList.remove('hidden');
                    tile.style.display = 'block';
                    // Animate in
                    setTimeout(() => {
                        tile.style.opacity = '1';
                        tile.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    // Animate out
                    tile.style.opacity = '0';
                    tile.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        tile.classList.add('hidden');
                        tile.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- 8. Ensure projects and skills are visible ---
    const allProjectTiles = document.querySelectorAll('.project-tile');
    allProjectTiles.forEach(tile => {
        tile.style.opacity = '1';
        tile.style.visibility = 'visible';
        tile.style.transform = 'scale(1)';
    });

    // Ensure all skill cards are visible
    const allSkillCards = document.querySelectorAll('.skill-card');
    allSkillCards.forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.display = 'flex';
    });

    console.log(`✅ Ensured ${allSkillCards.length} skill cards are visible`);

    // --- 8. GSAP Scroll Animations ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger after page load
    setTimeout(() => {
        ScrollTrigger.refresh();
        console.log('ScrollTrigger refreshed');
    }, 100);

    function animateFrom(elem, direction) {
        direction = direction || 1;
        var x = 0,
            y = direction * 50; // Reduced from 100 to 50
        if(elem.classList.contains("gs_reveal_fromLeft")) {
          x = -50; // Reduced from -100 to -50
          y = 0;
        } else if (elem.classList.contains("gs_reveal_fromRight")) {
          x = 50; // Reduced from 100 to 50
          y = 0;
        }
        elem.style.transform = "translate(" + x + "px, " + y + "px)";
        elem.style.opacity = "0";
        gsap.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
          duration: 1, // Reduced from 1.5 to 1
          x: 0,
          y: 0, 
          autoAlpha: 1, 
          ease: "power2.out", // Changed from expo to power2.out
          overwrite: "auto"
        });
      }
      
      function hide(elem) {
        gsap.set(elem, {autoAlpha: 0});
      }
      
      // Apply animations to elements that are not project tiles
      gsap.utils.toArray(".gs_reveal:not(.project-tile)").forEach(function(elem) {
        hide(elem); // assure that the element is hidden when scrolled into view
        
        ScrollTrigger.create({
          trigger: elem,
          start: "top 90%", // Changed from default to 90%
          end: "bottom 10%", // Added end point
          onEnter: function() { animateFrom(elem) }, 
          onEnterBack: function() { animateFrom(elem, -1) },
          onLeave: function() { hide(elem) } // assure that the element is hidden when scrolled into view
        });
      });

      // Special handling for projects grid (don't hide projects)
      const projectsGrid = document.querySelector('.projects-grid');
      if (projectsGrid && projectsGrid.classList.contains('gs_reveal')) {
        ScrollTrigger.create({
          trigger: projectsGrid,
          start: "top 90%",
          onEnter: function() { 
            gsap.fromTo(projectsGrid, 
              {autoAlpha: 0}, 
              {duration: 0.8, autoAlpha: 1, ease: "power2.out"}
            );
          }
        });
      }

      // Hero Animation on Load
      gsap.from(".hero-content > *", {
        duration: 1,
        y: 30, // Reduced from 50 to 30
        opacity: 0,
        stagger: 0.1, // Reduced from 0.15 to 0.1
        ease: "power3.out",
        delay: 0.3 // Reduced from 0.5 to 0.3
      });

      // Skill Cards Stagger Animation
      gsap.from(".skill-card", {
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 85%" // Changed from 80% to 85%
        },
        duration: 0.6, // Reduced from 0.8 to 0.6
        y: 30, // Reduced from 50 to 30
        opacity: 0,
        stagger: 0.08, // Reduced from 0.1 to 0.08
        ease: "power2.out" // Changed from back.out(1.7) to power2.out
      });

      // Project Cards Stagger Animation - SIMPLIFIED
      gsap.set(".project-tile", {opacity: 1, scale: 1}); // Ensure projects are visible
      gsap.from(".project-tile", {
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 85%", // Changed from 80% to 85%
          refreshPriority: -1 // Lower priority to prevent conflicts
        },
        duration: 0.6, // Reduced from 0.8 to 0.6
        y: 20, // Reduced further from 30 to 20
        scale: 0.98, // Changed from 0.95 to 0.98
        stagger: 0.1, // Reduced from 0.15 to 0.1
        ease: "power2.out" // Changed from back.out(1.7) to power2.out
      });

      // Timeline Animation
      gsap.from(".timeline-container", {
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 85%" // Changed from 80% to 85%
        },
        duration: 0.8, // Reduced from 1 to 0.8
        x: (index, target) => target.classList.contains('left') ? -50 : 50, // Reduced from ±100 to ±50
        opacity: 0,
        stagger: 0.2, // Reduced from 0.3 to 0.2
        ease: "power2.out" // Changed from power3.out to power2.out
      });

      // Floating Animation for Hero Image - SIMPLIFIED
      gsap.to(".hero-img", {
        y: -10, // Reduced from -20 to -10
        duration: 3, // Increased from 2 to 3
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut" // Changed from power2.inOut to power1.inOut
      });

      // Log when animations are complete
      console.log('GSAP animations initialized');

      // Final check to ensure projects are visible
      setTimeout(() => {
          const projects = document.querySelectorAll('.project-tile');
          projects.forEach(project => {
              if (project.style.opacity === '0' || project.style.visibility === 'hidden') {
                  project.style.opacity = '1';
                  project.style.visibility = 'visible';
                  project.style.transform = 'scale(1)';
              }
          });
          console.log(`Ensured ${projects.length} projects are visible`);
      }, 1000);

      // Remove the problematic parallax effect that might interfere with scrolling
      // Commented out the navigation parallax effect
      /*
      gsap.to(".nav", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true
        },
        backdropFilter: "blur(20px)",
        ease: "none"
      });
      */
    } else {
        console.warn('GSAP not loaded, animations disabled');
    }
});
