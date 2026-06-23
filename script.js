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



document.addEventListener("DOMContentLoaded", () => {
    // Collect all elements with the class 'nav-group' into an array list
    const navGroups = document.querySelectorAll(".nav-group");

    navGroups.forEach((group) => {
        // Find the dropdown that sits inside THIS specific group container
        const dropdown = group.querySelector(".nav-dropdown");
        if (!dropdown) return;

        group.addEventListener("click", (event) => {
            event.stopPropagation();
            
            // Close any other open dropdowns first to avoid overlapping layout clashing
            document.querySelectorAll(".nav-dropdown").forEach((d) => {
                if (d !== dropdown) d.style.display = "none";
            });

            // Toggle the display state of this specific clicked dropdown
            const isCurrentlyOpen = dropdown.style.display === "flex";
            dropdown.style.display = isCurrentlyOpen ? "none" : "flex";
        });
    });

    // Close all menus instantly if the user clicks anywhere else on the screen
    document.addEventListener("click", () => {
        document.querySelectorAll(".nav-dropdown").forEach((d) => {
            d.style.display = "none";
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const viewButton = document.getElementById('skillsViewToggle');
    const masterContainer = document.getElementById('masterSkillsContainer');
    const rows = document.querySelectorAll('.js-marquee-row');
    const textLabel = document.getElementById('toggleText');

    let isGridView = false;
    let animationFrameId;

    const AUTO_SPEED = 2.0; 
    let rowStates = [];

    rows.forEach((row, rowIndex) => {
        const originalCards = Array.from(row.children);
        
        rowStates.push({
            currentX: 0,
            isDragging: false,
            startX: 0,
            direction: parseInt(row.getAttribute('data-direction')) || -1,
            originalCards: originalCards, 
            maxDistance: 0
        });
    });

    function initMarqueeView() {
        if (isGridView) return;

        rowStates.forEach((state, rowIndex) => {
            const row = rows[rowIndex];
            
            row.innerHTML = '';
            
            state.originalCards.forEach(card => row.appendChild(card));
            
            state.originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.add('js-cloned-card'); 
                row.appendChild(clone);
            });

            const firstCard = state.originalCards[0];
            const cardWidth = firstCard.offsetWidth;
            const gapSpace = 24; 
            state.maxDistance = (cardWidth + gapSpace) * state.originalCards.length;

            row.style.width = 'max-content';
            row.style.display = 'flex';
            row.style.transform = `translate3d(${state.currentX}px, 0px, 0px)`;

            const startDrag = (clientX) => {
                if (isGridView) return;
                state.isDragging = true;
                state.startX = clientX - state.currentX;
            };

            const doDrag = (clientX) => {
                if (!state.isDragging || isGridView) return;
                state.currentX = clientX - state.startX;
            };

            const endDrag = () => {
                state.isDragging = false;
            };

            row.addEventListener('mousedown', (e) => startDrag(e.clientX));
            window.addEventListener('mousemove', (e) => { if(state.isDragging) doDrag(e.clientX); });
            window.addEventListener('mouseup', endDrag);

            row.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
            row.addEventListener('touchmove', (e) => doDrag(e.touches[0].clientX), { passive: true });
            row.addEventListener('touchend', endDrag);
        });

        if (!animationFrameId) {
            updatePositions();
        }
    }

    function updatePositions() {
        if (!isGridView) {
            rows.forEach((row, i) => {
                const state = rowStates[i];

                if (!state.isDragging) {
                    state.currentX += AUTO_SPEED * state.direction;
                }

                if (state.currentX <= -state.maxDistance) {
                    state.currentX += state.maxDistance;
                    if (state.isDragging) state.startX -= state.maxDistance;
                } else if (state.currentX >= 0) {
                    state.currentX -= state.maxDistance;
                    if (state.isDragging) state.startX += state.maxDistance;
                }

                row.style.transform = `translate3d(${state.currentX}px, 0px, 0px)`;
            });
        }
        animationFrameId = requestAnimationFrame(updatePositions);
    }

    initMarqueeView();

    if (viewButton && masterContainer && textLabel) {
        viewButton.addEventListener('click', () => {
            isGridView = !isGridView;
            masterContainer.style.opacity = '0';

            setTimeout(() => {
                if (isGridView) {
                    if (animationFrameId) {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }

                    rows.forEach((row) => {
                        row.removeAttribute('style'); 
                        row.classList.remove('flex', 'gap-6', 'overflow-hidden', 'cursor-grab', 'active:cursor-grabbing', 'w-max');
                        row.classList.add('contents');

                        const clones = row.querySelectorAll('.js-cloned-card');
                        clones.forEach(clone => clone.remove());
                    });

                    masterContainer.classList.remove('flex-col', 'gap-6');
                    masterContainer.classList.add('flex-row', 'flex-wrap', 'justify-center', 'gap-4', 'sm:gap-6');

                    const cards = masterContainer.querySelectorAll('.skill-card');
                    cards.forEach(card => {
                        card.classList.remove('flex-shrink-0', 'w-48', 'h-48');
                        card.classList.add('w-[calc(50%-0.5rem)]', 'sm:w-48', 'aspect-square', 'p-4');
                    });

                    textLabel.textContent = 'Show Sliding View';
                } else {
                    masterContainer.classList.remove('flex-row', 'flex-wrap', 'justify-center', 'gap-4', 'sm:gap-6');
                    masterContainer.classList.add('flex-col', 'gap-6');

                    rows.forEach(row => {
                        row.classList.remove('contents');
                        row.classList.add('flex', 'gap-6', 'overflow-hidden', 'cursor-grab', 'active:cursor-grabbing', 'w-max');
                    });

                    const cards = masterContainer.querySelectorAll('.skill-card');
                    cards.forEach(card => {
                        card.classList.remove('w-[calc(50%-0.5rem)]', 'sm:w-48', 'aspect-square');
                        card.classList.add('w-48', 'h-48', 'flex-shrink-0', 'p-4');
                    });

                    initMarqueeView();
                    textLabel.textContent = 'Show Grid View';
                }
                masterContainer.style.opacity = '1';
            }, 250);
        });
    }

    window.addEventListener('resize', () => {
        if (!isGridView) initMarqueeView();
    });
});













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

    // 1. Uniform dashboard grid spacing for the recent projects container
    list.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl mx-auto px-4 py-6";

    const recent = [...myProjects]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 2);

    list.innerHTML = ""; 

    recent.forEach(proj => {
        const card = document.createElement('div');
        
        // 2. Premium card styling following your reference dashboard interface
        card.className = "project-card bg-[#121212] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-slate-700 hover:-translate-y-1";
        card.setAttribute('data-tech', proj.tech || '');
        card.setAttribute('data-date', proj.date);
        
        // 3. Process the tech stack text string into clean, individual array badges
        const techBadges = proj.stackText 
            ? proj.stackText.split(',').map(tech => `<span class="bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-medium px-3 py-1 rounded-full">${tech.trim()}</span>`).join('')
            : '';
        
        // 4. Inject the crisp layout containing the image showcase, top links, and tags
        card.innerHTML = `
            <div>
                <div class="w-full h-48 relative overflow-hidden bg-slate-950 border-b border-slate-900">
                    <img src="${proj.image}" alt="${proj.title}" loading="lazy" onerror="this.src='IMG_2040.png'" class="w-full h-full object-cover">
                </div>
                
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xl font-bold text-slate-100 tracking-tight">${proj.title}</h3>
                        
                        <div class="flex items-center gap-3 text-slate-400">
                            <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors text-sm">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors text-sm">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                    
                    <p class="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">${proj.description}</p>
                    
                    <div class="flex flex-wrap gap-1.5 pt-2">
                        ${techBadges}
                    </div>
                </div>
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

    // 1. Uniform grid system with standard, consistent spacing gaps
    targetGrid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4 py-12";
    targetGrid.innerHTML = "";

    if (projectsToRender.length === 0) {
        targetGrid.innerHTML = `<p class="col-span-full text-center text-slate-400 text-sm py-12">No matching projects discovered.</p>`;
        return;
    }

    projectsToRender.forEach(project => {
        const cardWrapper = document.createElement('div');
        
        // 2. Rigid, professional card styling following your reference picture
        cardWrapper.className = "project-card bg-[#121212] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-slate-700 hover:-translate-y-1";
        cardWrapper.setAttribute('data-category', project.category || 'all');
        
        // 3. Process the tech stack text string into clean, individual array badges
        const techBadges = project.stackText 
            ? project.stackText.split(',').map(tech => `<span class="bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-medium px-3 py-1 rounded-full">${tech.trim()}</span>`).join('')
            : '';

        // 4. Inject the premium structure with top action icons and bottom badges
        cardWrapper.innerHTML = `
            <div>
                <div class="w-full h-48 relative overflow-hidden bg-slate-950 border-b border-slate-900">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x200?text=${encodeURIComponent(project.title)}'" class="w-full h-full object-cover">
                </div>
                
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xl font-bold text-slate-100 tracking-tight">${project.title}</h3>
                        
                        <div class="flex items-center gap-3 text-slate-400">
                            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors text-sm">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors text-sm">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                    </div>
                    
                    <p class="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">${project.description}</p>
                    
                    <div class="flex flex-wrap gap-1.5 pt-2">
                        ${techBadges}
                    </div>
                </div>
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