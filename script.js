document.addEventListener('DOMContentLoaded', function() {

    // --- 0. Scroll Restoration and Basic Setup ---
    // Restore scroll position and ensure smooth scrolling
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Ensure projects are visible by default
    const allProjectTiles = document.querySelectorAll('.project-tile');
    allProjectTiles.forEach(tile => {
        tile.style.opacity = '1';
        tile.style.visibility = 'visible';
        tile.style.transform = 'scale(1)';
    });

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

    // --- 2. Lenis Smooth Scrolling with Fallback ---
    let lenis;
    try {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Integrate Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time)=>{
            lenis.raf(time * 1000)
        });
        gsap.ticker.lagSmoothing(0);
        
        console.log('Lenis smooth scrolling initialized');
    } catch (error) {
        console.warn('Lenis failed to initialize, falling back to native scrolling:', error);
        // Fallback to CSS smooth scrolling
        document.documentElement.style.scrollBehavior = 'smooth';
    }


    // --- 3. Theme Toggle Functionality ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Set theme on load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    // Set CSS variable for background color RGB (used in nav backdrop)
    updateBgRgb(savedTheme);

    function updateBgRgb(theme) {
        const rgb = theme === 'dark' ? '13, 17, 23' : '255, 255, 255';
        document.documentElement.style.setProperty('--bg-color-rgb', rgb);
    }

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateBgRgb(newTheme);
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
            
            projectElements.forEach(tile => {
                if (filterValue === 'all' || tile.getAttribute('data-category') === filterValue) {
                    tile.classList.remove('hidden');
                    tile.style.opacity = '1';
                    tile.style.visibility = 'visible';
                    tile.style.transform = 'scale(1)';
                } else {
                    tile.classList.add('hidden');
                }
            });
        });
    });

    // --- 8. GSAP Scroll Animations ---
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

      // --- 9. Back to Top Button ---
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- 10. Navigation Progress Bar ---
    const navProgress = document.querySelector('.nav-progress');
    
    if (navProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            navProgress.style.transform = `scaleX(${scrollPercent / 100})`;
        });
    }

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

    // --- 11. Enhanced Navigation Behavior ---
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Auto-hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // --- 12. Intersection Observer for Active Nav Links ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding nav link
                const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // --- 13. Enhanced Project Card Interactions ---
    const projectTiles = document.querySelectorAll('.project-tile');
    
    projectTiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            tile.style.transform = 'translateY(-10px) scale(1.02)';
            tile.style.boxShadow = '0 20px 40px rgba(88, 166, 255, 0.2)';
        });
        
        tile.addEventListener('mouseleave', () => {
            tile.style.transform = 'translateY(0) scale(1)';
            tile.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });

    // --- 14. Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                if (lenis) {
                    lenis.scrollTo(target, { duration: 1.5, offset: -80 });
                } else {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // --- 15. Performance Optimization ---
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // --- 16. Keyboard Navigation Support ---
    document.addEventListener('keydown', (e) => {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && menuItems && menuItems.classList.contains('open')) {
            menuItems.classList.remove('open');
        }
    });

    // --- 17. Performance Monitor (Development only) ---
    if (process?.env?.NODE_ENV === 'development') {
        console.log('Portfolio Performance Monitor:');
        console.log('- GSAP ScrollTrigger initialized');
        console.log('- Lenis smooth scrolling active');
        console.log('- Theme system loaded');
        console.log('- All animations optimized');
    }

    console.log('🚀 Portfolio fully loaded and optimized!');

    // --- 18. Enhanced 3D Portfolio Button Animation ---
    const threeDButton = document.querySelector('a[href="3d-portfolio.html"]');
    if (threeDButton) {
        // Add special glow effect on hover
        threeDButton.addEventListener('mouseenter', () => {
            gsap.to(threeDButton, {
                duration: 0.3,
                boxShadow: '0 0 30px rgba(102, 126, 234, 0.8), 0 0 60px rgba(118, 75, 162, 0.4)',
                scale: 1.05,
                ease: "power2.out"
            });
        });

        threeDButton.addEventListener('mouseleave', () => {
            gsap.to(threeDButton, {
                duration: 0.3,
                boxShadow: '0 8px 25px rgba(88, 166, 255, 0.4)',
                scale: 1,
                ease: "power2.out"
            });
        });

        // Add floating animation
        gsap.to(threeDButton, {
            y: -5,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }

    // --- 19. Portfolio Hub Link Enhancement ---
    const portfolioLinks = document.querySelectorAll('a[href*="portfolio"], a[href*="github.io"]');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add a subtle loading effect
            const originalText = link.textContent;
            link.style.position = 'relative';
            link.style.overflow = 'hidden';
            
            const shimmer = document.createElement('div');
            shimmer.style.position = 'absolute';
            shimmer.style.top = '0';
            shimmer.style.left = '-100%';
            shimmer.style.width = '100%';
            shimmer.style.height = '100%';
            shimmer.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)';
            shimmer.style.transition = 'left 0.6s ease';
            
            link.appendChild(shimmer);
            
            setTimeout(() => {
                shimmer.style.left = '100%';
            }, 50);
            
            setTimeout(() => {
                link.removeChild(shimmer);
            }, 650);
        });
    });

    console.log('🎮 3D Portfolio enhancements loaded!');

    // --- 20. Performance and Accessibility Enhancements ---
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.timeScale(0.5); // Slower animations
        console.log('♿ Reduced motion preferences detected - animations adjusted');
    }

    // Add keyboard navigation for project tiles
    projectTiles.forEach((tile, index) => {
        tile.setAttribute('tabindex', '0');
        tile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                tile.click();
            }
        });
    });

    console.log('✅ All portfolio enhancements loaded and optimized!');

}); // End of DOMContentLoaded
