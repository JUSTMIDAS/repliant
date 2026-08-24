            // =========================================================
            // CORE PAGE INITIALIZATION
            // =========================================================
            function showAllElements() {
                const elements = document.querySelectorAll(
                    '.nav-menu, .text, .section-about, .section-projects, .project-card, .section-contact, .skills-section, .services-section, .icon, .timeline-section, .timeline-item, .service-category'
                );

                elements.forEach((el) => {
                    if (!el.classList.contains('visible')) {
                        el.classList.add('visible');
                    }
                });

                document.querySelectorAll('h4, h2, p, img, .phone-booth').forEach((el) => {
                    if (!el.classList.contains('visible')) {
                        el.classList.add('visible');
                    }
                });
            }

            let activeProjectsList = [];

            function initPage() {
                showAllElements();
                populateSkillsGrids();
                initHeaderNavigation();
                initThemeControls();
                initAnimatedLetters();
                initSkillsMarquee();
                initProjectCatalog();
                initServiceTabs();
                initContactPopup();

                if (typeof myProjects !== 'undefined' && Array.isArray(myProjects)) {
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









            // =========================================================
            // HEADER / NAVIGATION / THEME
            // =========================================================
            function initHeaderNavigation() {
                const menuToggle = document.querySelector('.hamburger, #menuToggle');
                const navLinksMenu = document.querySelector('.nav-links, #navLinks');

                if (menuToggle && navLinksMenu) {
                    menuToggle.addEventListener('click', (e) => {
                        e.stopPropagation();

                        // Toggle nav visibility for small screens
                        navLinksMenu.classList.toggle('hidden');
                        navLinksMenu.classList.toggle('flex');
                        navLinksMenu.classList.toggle('flex-col');

                        // Toggle an active state on the hamburger and swap its icon
                        menuToggle.classList.toggle('active');
                        const icon = menuToggle.querySelector('i');
                        if (icon) {
                            const isOpen = !navLinksMenu.classList.contains('hidden');
                            icon.classList.toggle('fa-bars', !isOpen);
                            icon.classList.toggle('fa-times', isOpen);
                        }
                    });
                }

                // Enable click-to-toggle for dropdown groups so a click will persist the open state.
                const navGroups = document.querySelectorAll('.nav-group');

                function closeAllNavGroups() {
                    navGroups.forEach((group) => {
                        group.classList.remove('open');
                        const dropdown = group.querySelector('.nav-dropdown');
                        const trigger = group.querySelector(':scope > a');
                        if (dropdown) {
                            dropdown.classList.add('hidden');
                            dropdown.classList.remove('flex');
                        }
                        if (trigger) trigger.setAttribute('aria-expanded', 'false');
                    });
                }

                navGroups.forEach((group) => {
                    const trigger = group.querySelector(':scope > a');
                    const dropdown = group.querySelector('.nav-dropdown');

                    if (!trigger || !dropdown) return;

                    // Ensure initial ARIA state
                    trigger.setAttribute('aria-haspopup', 'true');
                    trigger.setAttribute('aria-expanded', 'false');

                    trigger.addEventListener('click', (evt) => {
                        // Prevent following the link when it controls a dropdown
                        evt.preventDefault();

                        const isOpen = group.classList.toggle('open');

                        // Toggle visual classes on the dropdown itself so it stays shown
                        dropdown.classList.toggle('hidden', !isOpen);
                        dropdown.classList.toggle('flex', isOpen);
                        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    });
                });

                // Close dropdowns and mobile nav when clicking outside or pressing Escape
                window.addEventListener('click', (evt) => {
                    const insideNav = evt.target.closest && evt.target.closest('.nav-group, #navLinks, .hamburger, #menuToggle');
                    if (!insideNav) {
                        closeAllNavGroups();

                        // Also close mobile nav if open
                        if (navLinksMenu && !navLinksMenu.classList.contains('hidden')) {
                            navLinksMenu.classList.add('hidden');
                            navLinksMenu.classList.remove('flex');
                            navLinksMenu.classList.remove('flex-col');
                        }

                        if (menuToggle && menuToggle.classList.contains('active')) {
                            menuToggle.classList.remove('active');
                            const icon = menuToggle.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                        }
                    }
                });

                window.addEventListener('keydown', (evt) => {
                    if (evt.key === 'Escape') {
                        closeAllNavGroups();

                        if (navLinksMenu && !navLinksMenu.classList.contains('hidden')) {
                            navLinksMenu.classList.add('hidden');
                            navLinksMenu.classList.remove('flex');
                            navLinksMenu.classList.remove('flex-col');
                        }

                        if (menuToggle && menuToggle.classList.contains('active')) {
                            menuToggle.classList.remove('active');
                            const icon = menuToggle.querySelector('i');
                            if (icon) {
                                icon.classList.remove('fa-times');
                                icon.classList.add('fa-bars');
                            }
                        }
                    }
                });
            }



            

            function toggleIcons() {
                document.querySelectorAll('.icon').forEach((icon) => icon.classList.toggle('disabled'));
            }

            function toggleTheme() {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');

                const themeIcon = document.querySelector('.theme-toggle i');
                if (themeIcon) {
                    themeIcon.classList.toggle('fa-moon', !isDark);
                    themeIcon.classList.toggle('fa-sun', isDark);
                }
            }

            function initThemeControls() {
                const themeIcon = document.querySelector('.theme-toggle i');

                if (localStorage.getItem('theme') === 'dark') {
                    document.body.classList.add('dark-mode');
                    if (themeIcon) {
                        themeIcon.classList.replace('fa-moon', 'fa-sun');
                    }
                } else if (themeIcon) {
                    themeIcon.classList.add('fa-moon');
                    themeIcon.classList.remove('fa-sun');
                }
            }

            function initAnimatedLetters() {
                const letters = document.querySelectorAll('#animatedText span');

                if (letters.length > 0) {
                    letters.forEach((letter) => {
                        letter.addEventListener('click', () => {
                            letter.classList.add('squish');
                            setTimeout(() => {
                                letter.classList.remove('squish');
                            }, 300);
                        });
                    });
                }
            }

            const icons = document.querySelectorAll('.icon');
            icons.forEach((icon) => {
                const duration = Math.random() * 5 + 5;
                const xMove = (Math.random() - 0.5) * 50;
                const yMove = (Math.random() - 0.5) * 50;

                icon.style.setProperty('--duration', `${duration}s`);
                icon.style.setProperty('--x-move', `${xMove}px`);
                icon.style.setProperty('--y-move', `${yMove}px`);
                icon.classList.add('floating');
            });

            // =========================================================
            // SKILLS SECTION
            // =========================================================
            function populateSkillsGrids() {
                const carousel1 = document.getElementById('skillsCarousel');
                const carousel2 = document.getElementById('skillsCarousel2');
                const grid1 = document.getElementById('skillsGrid');
                const grid2 = document.getElementById('skillsGrid2');

                if (carousel1 && grid1) {
                    grid1.innerHTML = carousel1.innerHTML;
                }

                if (carousel2 && grid2) {
                    grid2.innerHTML = carousel2.innerHTML;
                }
            }

            function initSkillsMarquee() {
                const viewButton = document.getElementById('skillsViewToggle');
                const masterContainer = document.getElementById('masterSkillsContainer');
                const rows = document.querySelectorAll('.js-marquee-row');
                const textLabel = document.getElementById('toggleText');

                if (!viewButton || !masterContainer || rows.length === 0 || !textLabel) return;

                let isGridView = false;
                let animationFrameId;
                const AUTO_SPEED = 2.0;
                const rowStates = [];

                rows.forEach((row) => {
                    rowStates.push({
                        currentX: 0,
                        isDragging: false,
                        startX: 0,
                        direction: parseInt(row.getAttribute('data-direction')) || -1,
                        originalCards: Array.from(row.children),
                        maxDistance: 0
                    });
                });

                function initMarqueeView() {
                    if (isGridView) return;

                    rowStates.forEach((state, index) => {
                        const row = rows[index];
                        row.innerHTML = '';

                        state.originalCards.forEach((card) => row.appendChild(card));
                        state.originalCards.forEach((card) => {
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
                        window.addEventListener('mousemove', (e) => {
                            if (state.isDragging) doDrag(e.clientX);
                        });
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
                        rows.forEach((row, index) => {
                            const state = rowStates[index];

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
                                clones.forEach((clone) => clone.remove());
                            });

                            masterContainer.classList.remove('flex-col', 'gap-6');
                            masterContainer.classList.add('flex-row', 'flex-wrap', 'justify-center', 'gap-4', 'sm:gap-6');

                            masterContainer.querySelectorAll('.skill-card').forEach((card) => {
                                card.classList.remove('flex-shrink-0', 'w-48', 'h-48');
                                card.classList.add('w-[calc(50%-0.5rem)]', 'sm:w-48', 'aspect-square', 'p-4');
                            });

                            textLabel.textContent = 'Show Sliding View';
                        } else {
                            masterContainer.classList.remove('flex-row', 'flex-wrap', 'justify-center', 'gap-4', 'sm:gap-6');
                            masterContainer.classList.add('flex-col', 'gap-6');

                            rows.forEach((row) => {
                                row.classList.remove('contents');
                                row.classList.add('flex', 'gap-6', 'overflow-hidden', 'cursor-grab', 'active:cursor-grabbing', 'w-max');
                            });

                            masterContainer.querySelectorAll('.skill-card').forEach((card) => {
                                card.classList.remove('w-[calc(50%-0.5rem)]', 'sm:w-48', 'aspect-square');
                                card.classList.add('w-48', 'h-48', 'flex-shrink-0', 'p-4');
                            });

                            initMarqueeView();
                            textLabel.textContent = 'Show Grid View';
                        }

                        masterContainer.style.opacity = '1';
                    }, 250);
                });

                window.addEventListener('resize', () => {
                    if (!isGridView) initMarqueeView();
                });
            }




            // =========================================================
            // PROJECTS SECTION
            // =========================================================
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
                document.querySelectorAll('.project-tab').forEach((tab) => {
                    tab.classList.toggle('active', tab.dataset.category === category);
                });

                document.querySelectorAll('.project-card').forEach((card) => {
                    const cardCategory = card.dataset.category || 'all';
                    card.style.display = category === 'all' || cardCategory === category ? 'block' : 'none';
                });
            }

            function displayRecent() {
                const list = document.getElementById('recent-projects-list');
                if (!list) return;

                if (typeof myProjects === 'undefined' || !Array.isArray(myProjects)) {
                    console.error('The myProjects array is missing or invalid!');
                    return;
                }

                list.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl mx-auto px-4 py-6';

                const recent = [...myProjects]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 2);

                list.innerHTML = '';

                recent.forEach((proj) => {
                    const card = document.createElement('div');
                    card.className = 'project-card bg-[#121212] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-slate-700 hover:-translate-y-1';
                    card.setAttribute('data-tech', proj.tech || '');
                    card.setAttribute('data-date', proj.date);

                    const techBadges = proj.stackText
                        ? proj.stackText.split(',').map((tech) => `<span class="bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-medium px-3 py-1 rounded-full">${tech.trim()}</span>`).join('')
                        : '';

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

            function renderProjectGrid(projectsToRender) {
                const targetGrid = document.getElementById('all-projects-list');
                if (!targetGrid) return;

                targetGrid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4 py-12';
                targetGrid.innerHTML = '';

                if (projectsToRender.length === 0) {
                    targetGrid.innerHTML = '<p class="col-span-full text-center text-slate-400 text-sm py-12">No matching projects discovered.</p>';
                    return;
                }

                projectsToRender.forEach((project) => {
                    const cardWrapper = document.createElement('div');
                    cardWrapper.className = 'project-card bg-[#121212] border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-slate-700 hover:-translate-y-1';
                    cardWrapper.setAttribute('data-category', project.category || 'all');

                    const techBadges = project.stackText
                        ? project.stackText.split(',').map((tech) => `<span class="bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-medium px-3 py-1 rounded-full">${tech.trim()}</span>`).join('')
                        : '';

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

function filterProjects(techCriterion) {
    // Add this guard check at the top
    if (typeof myProjects === 'undefined') return;

    if (!Array.isArray(myProjects)) {
        activeProjectsList = [];
    } else if (techCriterion === 'all') {
        activeProjectsList = [...myProjects];
    } else {
        activeProjectsList = myProjects.filter(project => (project.tech || '').toLowerCase().includes(techCriterion.toLowerCase()));
    }

    renderProjectGrid(activeProjectsList);
}
            function sortProjects(sortType) {
                if (!Array.isArray(activeProjectsList)) return;

                if (sortType === 'date') {
                    activeProjectsList = [...activeProjectsList].sort((a, b) => new Date(b.date) - new Date(a.date));
                }

                renderProjectGrid(activeProjectsList);
            }
            
function initProjectCatalog() {
    // Add this guard check at the top
    if (typeof myProjects === 'undefined') return;

    if (Array.isArray(myProjects)) {
        activeProjectsList = [...myProjects];
    }
}

            window.filterProjects = filterProjects;
            window.sortProjects = sortProjects;
            window.toggleProjects = toggleProjects;
            window.toggleIcons = toggleIcons;
            window.toggleTheme = toggleTheme;
           




            

   // SERVICES SECTION

function activateTab(button) {
    const tabId = button.dataset.tab;
    const activeTab = document.getElementById(tabId);
    if (!activeTab) return;

    document.querySelectorAll('.tab-button').forEach((btn) => {
        btn.classList.remove('bg-cyan-500', 'text-slate-950', 'active');
        btn.classList.add('text-slate-400');
    });
    document.querySelectorAll('.tab-content').forEach((content) => content.classList.add('hidden'));

    button.classList.add('bg-cyan-500', 'text-slate-950', 'active');
    button.classList.remove('text-slate-400');
    activeTab.classList.remove('hidden');

    activeTab.querySelectorAll('.service-category').forEach((category, index) => {
        category.classList.remove('visible');
        setTimeout(() => {
            category.classList.add('visible');
        }, index * 150);
    });
}

document.querySelectorAll('.tab-button').forEach((btn) => {
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        activateTab(btn);
    });
});

function initServiceTabs() {
    const firstTab = document.querySelector('.tab-button.active');
    if (firstTab) activateTab(firstTab);
}

document.addEventListener('DOMContentLoaded', initServiceTabs);


     //contact popup functionality
            
         function initContactPopup() {
    const phoneButton = document.getElementById('phoneButton');
    const contactPopup = document.getElementById('contactPopup');
    const closePopup = document.getElementById('closePopup');
    const contactbtn = document.getElementById('contactbtn');

    // Safe individual validation for the floating phone button
    if (phoneButton && contactPopup) {
        phoneButton.addEventListener('click', () => {
            contactPopup.classList.toggle('hidden');
        });
    }

    // Safe individual validation for the close button
    if (closePopup && contactPopup) {
        closePopup.addEventListener('click', () => {
            contactPopup.classList.add('hidden');
        });
    }

    // Safe individual validation for the external contact button
    if (contactbtn && contactPopup) {
        contactbtn.addEventListener('click', (event) => {
            event.preventDefault();
            contactPopup.classList.toggle('hidden');
        });
    }
}
            // Legacy dropdown and older skills carousel code are intentionally left out because the active pages use the simpler mobile-menu and marquee implementations above.
            window.dispatchEvent(new Event('scroll'));



            // CONTACT FORM — EmailJS
(function () {
    emailjs.init('eAsoBQ4IWOvJez1MK'); // from Account → General

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_m6ptlzo', 'template_45of4cw', contactForm)
            .then(() => {
                submitBtn.textContent = 'Sent!';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2500);
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                submitBtn.textContent = 'Failed — try again';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 2500);
            });
    });
})();