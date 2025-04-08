document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const menuBar = document.getElementById('menuBar');
  const closeMenu = document.getElementById('closeMenu');
  const menuItems = document.getElementById('menu-items');
  const logo = document.querySelector('.logo'); // Adjust if necessary

  // Toggle Menu Function
  function ToggleMenu() {
    document.body.classList.toggle('menu-open');
    menuItems.classList.toggle('open'); // Toggle the 'open' class on menu items
    
    // Toggle visibility of menu bar and close icon
    if (menuItems.classList.contains('open')) {
      menuBar.style.display = 'none';
      closeMenu.style.display = 'block';
      closeMenu.style.zIndex = '9990000000000000000';
    } else {
      menuBar.style.display = 'block';
      closeMenu.style.display = 'none';
    }
    logo.style.display = 'block'; // Ensure logo is visible
    logo.style.zIndex = '10000000000';
  }

  // Close the menu when clicking outside of it
  function closeMenuOnClickOutside(event) {
    if (document.body.classList.contains('menu-open') &&
        !menuItems.contains(event.target) &&
        !menuBar.contains(event.target) &&
        !closeMenu.contains(event.target) &&
        !logo.contains(event.target)) {
      ToggleMenu();
    }
  }

  function setupMenu() {
    // Add event listeners if viewport height is 750px or less
    if (window.innerHeight <= 1050) {
      menuBar.addEventListener('click', ToggleMenu);
      closeMenu.addEventListener('click', ToggleMenu);
      document.addEventListener('click', closeMenuOnClickOutside);
    } else {
      // Remove event listeners if viewport height is more than 750px
      menuBar.removeEventListener('click', ToggleMenu);
      closeMenu.removeEventListener('click', ToggleMenu);
      document.removeEventListener('click', closeMenuOnClickOutside);
    }
  }

  // Initial setup
  setupMenu();

  // Update setup on resize
  window.addEventListener('resize', setupMenu);

  // Theme Toggle Functionality
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use default
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  
  // Toggle theme function
  function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
  
  // Add event listener to theme toggle button
  themeToggleBtn.addEventListener('click', toggleTheme);

  // Project Filtering Functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  // Add click event to each filter button
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.getAttribute('data-filter');
      
      // Show/hide projects based on filter
      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.style.display = 'block';
          // Add animation for smooth appearance
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
});

// Typed.js Configuration (no changes needed here)
var typed = new Typed(".text", {
  strings: ["Data Engineer", "Data Analyst", "Machine Learning ", "Deep Learning"],
  typeSpeed: 150,
  backSpeed: 150,
  loop: true
});

// Page Loader Logic
document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("load", function() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
    const content = document.querySelector('.content');
    content.style.display = 'block';
  });
});

// Scroll-Based Icon Position Update
window.addEventListener('scroll', updateIconPosition);
window.addEventListener('load', updateIconPosition);

function updateIconPosition() {
  const buttonContainer = document.querySelector('.navigator');
  const icon = buttonContainer.querySelector('i');
  
  if (!buttonContainer || !icon) return; // Ensure elements exist

  const documentHeight = document.documentElement.scrollHeight;
  const viewportHeight = window.innerHeight;
  const scrollPosition = window.scrollY;
  
  const scrollPercentage = (scrollPosition / (documentHeight - viewportHeight)) * 100;
  
  const containerHeight = buttonContainer.offsetHeight;
  const iconHeight = icon.offsetHeight;
  
  const maxPosition = containerHeight - iconHeight;
  const newPosition = (scrollPercentage / 100) * maxPosition;
  
  icon.style.top = `${newPosition}px`;
}

/*Scroll Animation*/
document.addEventListener("DOMContentLoaded", function() {
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.fade-in-up-target').forEach(el => {
  gsap.fromTo(el, 
    { opacity: 0, filter: blur(5), y: 50 },
    {
      opacity: 1,
      filter: blur(0),
      y: 0,
      duration: 2,
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        end: 'bottom 50%',
        scrub: true
      }
    }
  );
});

gsap.utils.toArray('.fade-in-left-target').forEach(el => {
  gsap.fromTo(el, 
    { opacity: 0, x: -100 }, // Start state
    {
      opacity: 1,
      x: 0, // End state
      duration: 2,
      scrollTrigger: {
        trigger: el,
        start: 'top 98%',
        end: 'bottom 50%',
        scrub: true
      }
    }
  );
});

gsap.utils.toArray('.fade-in-right-target').forEach(el => {
  gsap.fromTo(el, 
    { opacity: 0}, 
    {
      opacity: 1,
      duration: 2,
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        end: 'bottom 10%',
        scrub: true
      }
    }
  );
});

gsap.from(".line-2", {
  scrollTrigger: {
    trigger: ".orange",
    scrub: true,
    pin: true,
    start: "top top",
    end: "+=100%"
  },
  scaleX: 0, 
  transformOrigin: "left center", 
  ease: "none"
});
});
/*Scroll Animation*/