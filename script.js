// Ensure elements are visible on page load
function showAllElements() {
    const elements = document.querySelectorAll(
        '.nav-menu, .text, .section-about, .section-projects, .project-card, .section-contact, .skills-section, .services-section, .icon, .timeline-section, .timeline-item, .service-category'
    );
    elements.forEach(el => {
        if (!el.classList.contains('visible')) {
            el.classList.add('visible');
        }
    });

    document.querySelectorAll('h4, h2, p, img, .phone-booth').forEach(el => {
        if (!el.classList.contains('visible')) {
            el.classList.add('visible');
        }
    });
}





let activeProjectsList = [];

function initPage() {
    showAllElements();
    populateSkillsGrids();

    if (Array.isArray(myProjects)) {
        activeProjectsList = [...myProjects];
    }

    if (document.querySelector('#all-projects-list')) {
        renderProjectGrid(activeProjectsList);
    }

    displayRecent();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}

// Trigger scroll event for dynamic content — removed immediate forced dispatch to reduce work



 



// SKILLS VIEW TOGGLE & GRID POPULATIon
function toggleSkillsView(view) {
    const carouselViews = document.querySelectorAll('.carousel-view');
    const gridViews = document.querySelectorAll('.grid-view');
    const buttons = document.querySelectorAll('.view-toggle-btn');

    carouselViews.forEach(el => el.classList.toggle('hidden', view !== 'carousel'));
    gridViews.forEach(el => el.classList.toggle('hidden', view !== 'grid'));

    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
}



function populateSkillsGrids() {
    const carousel1 = document.getElementById('skillsCarousel');
    const carousel2 = document.getElementById('skillsCarousel2');
    const grid1 = document.getElementById('skillsGrid');
    const grid2 = document.getElementById('skillsGrid2');

    // Meticulously copy the content from the carousel to the grid
    if (carousel1 && grid1) {
        grid1.innerHTML = carousel1.innerHTML;
    }

    if (carousel2 && grid2) {
        grid2.innerHTML = carousel2.innerHTML;
    }
};


// ============================================
// ANIMATED TEXT & ICONS
// ============================================

// Animated letters in hero section
const letters = document.querySelectorAll('#animatedText span');
if (letters.length > 0) {
    letters.forEach(letter => {
        letter.addEventListener('click', () => {
            letter.classList.add('squish');
            setTimeout(() => {
                letter.classList.remove('squish');
            }, 300);
        });
    });
}


// Floating icons animation
const icons = document.querySelectorAll('.icon');
icons.forEach(icon => {
    const duration = Math.random() * 5 + 5;
    const xMove = (Math.random() - 0.5) * 50;
    const yMove = (Math.random() - 0.5) * 50;
    icon.style.setProperty('--duration', `${duration}s`);
    icon.style.setProperty('--x-move', `${xMove}px`);
    icon.style.setProperty('--y-move', `${yMove}px`);
    icon.classList.add('floating');
});

// Global debounced scroll handler to reveal/hide skill sections and update scroll position
let _scrollTimeout = null;
function handleScrollVisibility() {
    const windowHeight = window.innerHeight;
    skillsSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const shouldShow = rect.top < windowHeight - 100 && rect.bottom > 0;
        section.querySelectorAll('.section-title, .section-heading, .skill-card, .cv-button').forEach(element => {
            element.classList.toggle('visible', shouldShow);
        });
    });
    lastScrollTop = window.pageYOffset || 0;
}

window.addEventListener('scroll', () => {
    if (_scrollTimeout) clearTimeout(_scrollTimeout);
    _scrollTimeout = setTimeout(handleScrollVisibility, 60);
});

// Run once on load
handleScrollVisibility();


// ============================================
// NAVIGATION & THEME
// ============================================

// Hamburger menu toggle
const menuToggle = document.querySelector('.hamburger, #menuToggle');
const navLinksMenu = document.querySelector('.nav-links, #navLinks');
if (menuToggle && navLinksMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksMenu.classList.toggle('hidden');
        navLinksMenu.classList.toggle('flex');
        navLinksMenu.classList.toggle('flex-col');
    });
}

function toggleIcons() {
    document.querySelectorAll('.icon').forEach(icon => icon.classList.toggle('disabled'));
}

// Theme toggle (light/dark mode)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelector('.theme-toggle i').classList.toggle('fa-moon', !isDark);
    document.querySelector('.theme-toggle i').classList.toggle('fa-sun', isDark);
}

// Load saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
}


// ============================================
// PROJECT CONTROLS
// ============================================

// Toggle project view layout
function toggleProjects(view) {
    const projectContainer = document.querySelector('.project-card-container');
    if (!projectContainer) return;

    projectContainer.classList.remove('hidden', 'normal', 'list', 'grid');
    if (view !== 'hide') {
        projectContainer.classList.add(view);
    } else {
        projectContainer.classList.add('hidden');
    }
    window.dispatchEvent(new Event('scroll'));
}

function setProjectCategory(category) {
    document.querySelectorAll('.project-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    document.querySelectorAll('.project-card').forEach(card => {
        const cardCategory = card.dataset.category || 'all';
        card.style.display = category === 'all' || cardCategory === category ? 'block' : 'none';
    });
}

   function displayRecent() {
    const list = document.getElementById('recent-projects-list');
    if (!list) {
        console.error("Could not find the element with ID 'recent-projects-list'");
        return;
    }

    if (typeof myProjects === 'undefined' || !Array.isArray(myProjects)) {
        console.error("The myProjects array is missing or invalid!");
        return;
    }

    const recent = [...myProjects]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);

    list.innerHTML = ""; 

    recent.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-tech', proj.tech || '');
        card.setAttribute('data-date', proj.date);
        
        const imageSrc = proj.image;
        
        card.innerHTML = `
            <div class="project-link">
                <img src="${imageSrc}" alt="${proj.title}" loading="lazy" onerror="this.src='IMG_2040.png'">
                <h3>${proj.title}</h3>
                <p>${proj.description}</p>
                <a href="${proj.url}" class="demo-link" target="_blank">View Live/ Demo</a>
            </div>
        `;
        list.appendChild(card);
    });
    
    window.dispatchEvent(new Event('scroll'));
}

              




// 2. Base Template Card Injection Loop
function renderProjectGrid(projectsToRender) {
    const targetGrid = document.getElementById('all-projects-list');
    if (!targetGrid) return;

    targetGrid.innerHTML = "";

    if (projectsToRender.length === 0) {
        targetGrid.innerHTML = `<p class="col-span-full text-center text-slate-400 text-sm py-12">No matching projects discovered.</p>`;
        return;
    }

    projectsToRender.forEach(project => {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = "project-card bg-white/10 backdrop-blur-md border border-cyan-400 rounded-[30px] overflow-hidden shadow-lg flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1";
        cardWrapper.setAttribute('data-category', project.category || 'all');
        
        cardWrapper.innerHTML = `
            <div>
                <div class="w-full h-48  relative overflow-hidden  border-gray-50">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x200?text=${encodeURIComponent(project.title)}'" class="w-full h-full object-cover">
                    
                </div>
                <div class="p-6 ">
                    <h3 class="text-xl font-black text-cyan-400 uppercase tracking-wide mb-2">${project.title}</h3>
                    <p class="text-slate-300 text-sm leading-relaxed mb-4">${project.description}</p>
                    <p class="text-xs font-semibold text-cyan-300 font-bold">
                        <strong class="text-slate-700 font-bold">Stack:</strong> ${project.stackText}
                    </p>
                </div>
            </div>
            <div class="p-6 pt-0 mt-auto flex justify-center md:justify-start">
    <a href="${project.url}" class="inline-flex items-center justify-center w-full sm:w-44 bg-slate-950 border border-cyan-500/20 hover:border-cyan-400 text-cyan-400 text-xs font-black uppercase tracking-widest py-3.5 px-4 rounded-xl transition-all duration-300 text-center shadow-lg hover:shadow-cyan-500/10" target="_blank" rel="noopener noreferrer">
        View Project Live
    </a>
</div>
        `;
        targetGrid.appendChild(cardWrapper);
    });
}



// 3. Global Window Event Handlers (Prevents inline HTML crashes)
window.filterProjects = function(techCriterion) {
    if (!Array.isArray(myProjects)) {
        activeProjectsList = [];
    } else if (techCriterion === 'all') {
        activeProjectsList = [...myProjects];
    } else {
        activeProjectsList = myProjects.filter(p => (p.tech || '').toLowerCase().includes(techCriterion.toLowerCase()));
    }
    renderProjectGrid(activeProjectsList);
};

window.sortProjects = function(sortType) {
    if (!Array.isArray(activeProjectsList)) return;
    if (sortType === 'date') {
        activeProjectsList = [...activeProjectsList].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    renderProjectGrid(activeProjectsList);
};

// Handle each .skills-scroll independently so both SKILLS and ADDITIONAL SKILLS work
const skillsSections = document.querySelectorAll('.skills-section');
// Track last scroll position to avoid reference errors and enable scroll-direction checks
let lastScrollTop = window.pageYOffset || 0;
skillsSections.forEach(section => {
    const skillsScrolls = section.querySelectorAll('.skills-scroll');

    skillsScrolls.forEach(skillsScroll => {
        // Prevent re-initialization on subsequent loads
        if (skillsScroll.dataset.initialized === 'true') return;
        skillsScroll.dataset.initialized = 'true';

        const skillCards = skillsScroll.querySelectorAll('.skill-card');
        if (!skillCards || skillCards.length === 0) return;

        let scrollPosition = 0;
        let isPaused = false;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationFrameId = null;
        const totalWidth = Array.from(skillCards).reduce((acc, card) => acc + card.offsetWidth + 32, 0);

        // Duplicate content for infinite scroll (only once)
        skillsScroll.innerHTML += skillsScroll.innerHTML;

        // Auto-scroll animation (scoped per skills-scroll)
        function animateSkills() {
            if (!isPaused && !isDragging) {
                scrollPosition -= 1;
                if (Math.abs(scrollPosition) >= totalWidth / 2) {
                    scrollPosition = 0;
                }
                currentTranslate = scrollPosition;
                skillsScroll.style.transform = `translateX(${currentTranslate}px)`;
            }
            animationFrameId = requestAnimationFrame(animateSkills);
        }

        // Manage starting/stopping the animation to save CPU when offscreen
        let animationRunning = false;
        function startAnimation() {
            if (!animationRunning) {
                animationFrameId = requestAnimationFrame(animateSkills);
                animationRunning = true;
            }
        }
        function stopAnimation() {
            if (animationRunning && animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                animationRunning = false;
            }
        }

        // Use IntersectionObserver to only run animation when the section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startAnimation();
                } else {
                    stopAnimation();
                }
            });
        }, { root: null, threshold: 0 });

        observer.observe(section);

        // Pause animations when the page is hidden to further reduce work
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stopAnimation();
            else {
                // restart only if section is visible
                const rect = section.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) startAnimation();
            }
        });

        // Pause on card click
        skillCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('clicked');
                isPaused = card.classList.contains('clicked');
            });
        });

        // Mouse/touch drag handlers
        skillsScroll.addEventListener('mousedown', startDragging);
        skillsScroll.addEventListener('touchstart', startDragging, { passive: true });
        skillsScroll.addEventListener('mousemove', drag);
        skillsScroll.addEventListener('touchmove', drag, { passive: true });
        skillsScroll.addEventListener('mouseup', stopDragging);
        skillsScroll.addEventListener('touchend', stopDragging);
        skillsScroll.addEventListener('mouseleave', stopDragging);

        function startDragging(e) {
            isDragging = true;
            isPaused = true;
            startX = e.type.includes('mouse') ? e.pageX : (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
            prevTranslate = currentTranslate;
        }

        function drag(e) {
            if (isDragging) {
                const currentX = e.type.includes('mouse') ? e.pageX : (e.touches && e.touches[0] ? e.touches[0].pageX : 0);
                const deltaX = currentX - startX;
                currentTranslate = prevTranslate + deltaX;

                if (currentTranslate > 0) currentTranslate = 0;
                if (Math.abs(currentTranslate) > totalWidth / 2) currentTranslate = -(totalWidth / 2);

                skillsScroll.style.transform = `translateX(${currentTranslate}px)`;
            }
        }

        function stopDragging() {
            isDragging = false;
            isPaused = Array.from(skillCards).some(card => card.classList.contains('clicked'));
            scrollPosition = currentTranslate;
        }

        // Visibility handled by global debounced scroll handler (defined below)
    });
});

// CASE STUDIES
function showCaseStudy(projectTitle) {
    const modal = document.querySelector('#caseStudyModal');
    const content = document.querySelector('#caseStudyContent');

    const details = {
        'E-Commerce Platform': {
            problem: "Low conversion rates on mobile devices due to slow image loading.",
            solution: "Implemented lazy-loading and WebP image compression, reducing load time by 60%.",
            hurdle: "Integrating secure payment gateways with complex tax calculations."
        },
        'Task Management App': {
            problem: "Real-time updates were causing excessive server load.",
            solution: "Optimized WebSocket emissions and implemented Redis for state caching.",
            hurdle: "Maintaining data synchronization across multiple concurrent users."
        },
        'Portfolio Website': {
            problem: "Static content led to poor user engagement.",
            solution: "Added interactive animations and dynamic content loading.",
            hurdle: "Ensuring cross-browser compatibility for animations."
        },
        'Social Media Dashboard': {
            problem: "Inefficient API calls leading to slow data retrieval.",
            solution: "Implemented caching and optimized query structures.",
            hurdle: "Handling rate limits from social media APIs."
        },
        'Weather App': {
            problem: "Inaccurate forecasts due to API limitations.",
            solution: "Integrated multiple weather APIs for better accuracy.",
            hurdle: "Parsing and normalizing data from different sources."
        },
        'Blog Platform': {
            problem: "Poor SEO performance affecting visibility.",
            solution: "Implemented meta tags, sitemaps, and optimized content structure.",
            hurdle: "Balancing user experience with SEO requirements."
        },
        'Chat Application': {
            problem: "High latency in message delivery.",
            solution: "Upgraded to WebSocket for real-time communication.",
            hurdle: "Managing connection stability and fallbacks."
        },
        'Inventory Management System': {
            problem: "Manual data entry errors causing discrepancies.",
            solution: "Automated data import and validation processes.",
            hurdle: "Integrating with existing legacy systems."
        },
        'Fitness Tracker': {
            problem: "Battery drain from constant tracking.",
            solution: "Optimized algorithms for efficient data collection.",
            hurdle: "Ensuring accuracy while reducing power consumption."
        },
        'Event Booking System': {
            problem: "Concurrent bookings leading to overbooking.",
            solution: "Implemented transaction locks and queue management.",
            hurdle: "Handling high traffic during peak booking times."
        }
    };

    const data = details[projectTitle] || { problem: "N/A", solution: "N/A", hurdle: "N/A" };

    content.innerHTML = `
        <h2>Case Study: ${projectTitle}</h2>
        <div class="case-study-grid">
            <div class="case-study-box">
                <h4><i class="fas fa-exclamation-triangle"></i> The Problem</h4>
                <p>${data.problem}</p>
            </div>
            <div class="case-study-box">
                <h4><i class="fas fa-check-circle"></i> The Solution</h4>
                <p>${data.solution}</p>
            </div>
        </div>
        <div class="case-study-box" style="margin-top:20px; border-left-color: #e74c3c;">
            <h4><i class="fas fa-mountain"></i> The Technical Hurdle</h4>
            <p>${data.hurdle}</p>
        </div>
    `;

    modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // Case study modal close
    const closeCaseStudyBtn = document.querySelector('#closeCaseStudy');
    if (closeCaseStudyBtn) {
        closeCaseStudyBtn.addEventListener('click', () => {
            document.querySelector('#caseStudyModal').classList.remove('active');
        });
    }

    // Contact popup handlers
    const phoneButton = document.querySelector('#phoneButton');
    const contactPopup = document.querySelector('#contactPopup');
    const closePopupBtn = document.querySelector('.contact-popup .close-popup');

    // Floating phone button opens centered popup
    if (phoneButton && contactPopup) {
        phoneButton.addEventListener('click', () => {
            contactPopup.classList.add('active');
            history.replaceState(null, '', '#contact');
        });
    }

    // Open contact popup when `#contact` links are clicked (do not modify URL hash)
    document.querySelectorAll('a[href="#contact"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (contactPopup) {
                contactPopup.classList.add('active');
            }
        });
    });

    // If page loaded with #contact hash, open popup
    if (location.hash === '#contact' && contactPopup) {
        contactPopup.classList.add('active');
    }

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            contactPopup.classList.remove('active');
        });
    }

    // Close popup when clicking outside
    if (contactPopup) {
        contactPopup.addEventListener('click', (e) => {
            if (e.target === contactPopup) {
                contactPopup.classList.remove('active');
            }
        });
    }
});


// SERVICES TAB SWITCHING
function switchTab(event, tabId) {
    event.preventDefault();

    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Remove active class from all buttons and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    event.target.closest('.tab-button').classList.add('active');
    document.getElementById(tabId).classList.add('active');

    // Animate service categories
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.querySelectorAll('.service-category').forEach((category, idx) => {
            category.classList.remove('visible');
            setTimeout(() => {
                category.classList.add('visible');
            }, idx * 150);
        });
    }
}


// Trigger scroll on load
window.dispatchEvent(new Event('scroll'));