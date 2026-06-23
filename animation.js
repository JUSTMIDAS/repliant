

document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const glassCard = document.getElementById('animatedText');
    const blobContainer = document.getElementById('animatedBlob');
    
    const nameLetters = document.querySelectorAll('#animatedText .font-black span:not(.question-mark)');
    const questionMark = document.querySelector('#animatedText .question-mark');
    const subHeading = document.querySelector('#animatedText h4');
    const textParagraph = document.querySelector('#animatedText p');
    const actionButton = document.querySelector('.availability-btn');
    
    const graphicBlob = document.querySelector('.blob-container');
    const socialItems = document.querySelectorAll('.social-links-list li');

    if (aboutSection && glassCard && blobContainer) {
        
        const setInitialStates = () => {
            gsap.set(glassCard, { opacity: 0, x: -60 });
            gsap.set(blobContainer, { opacity: 0, x: 60 });
            gsap.set(nameLetters, { opacity: 0, y: 50, rotateX: -90 });
            gsap.set(questionMark, { opacity: 0, scale: 0, rotate: -45 });
            gsap.set(subHeading, { opacity: 0, y: 30 });
            gsap.set(textParagraph, { opacity: 0, y: 30 });
            gsap.set(actionButton, { opacity: 0, y: 30 });
            gsap.set(graphicBlob, { scale: 0.6, rotate: -20, opacity: 0 });
            gsap.set(socialItems, { opacity: 0, y: 20 });
        };

        setInitialStates();

        const clearTimeline = gsap.timeline({ paused: true });

        clearTimeline
            .to(glassCard, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" })
            .to(blobContainer, { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, "-=0.6")
            .to(nameLetters, { opacity: 1, y: 0, rotateX: 0, stagger: 0.05, duration: 0.5, ease: "back.out(1.5)" }, "-=0.2")
            .to(questionMark, { opacity: 1, scale: 1, rotate: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }, "-=0.1")
            .to(subHeading, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }, "-=0.2")
            .to(textParagraph, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }, "-=0.3")
            .to(actionButton, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }, "-=0.3")
            .to(graphicBlob, { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "power2.out" }, "-=0.8")
            .to(socialItems, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: "power2.out" }, "-=0.3");

        ScrollTrigger.create({
            trigger: aboutSection,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => clearTimeline.play(),
            onLeave: () => clearTimeline.reverse(),
            onEnterBack: () => clearTimeline.play(),
            onLeaveBack: () => clearTimeline.reverse(),
            invalidateOnRefresh: true
        });
    }
});









// timeline previews

document.addEventListener('DOMContentLoaded', () => {
    const previewSection = document.getElementById('timeline-preview');
    
    if (previewSection) {
        // Target structural assets inside the markup
        const orangeGlow = previewSection.querySelector('.bg-orange-600');
        const mainHeading = previewSection.querySelector('h2');
        const subHeading = previewSection.querySelector('h1');
        const profileCards = previewSection.querySelectorAll('.grid > div');
        const redirectWrapper = previewSection.querySelector('.text-center');

        // Establish structural baselines outside the timeline flow
        const setInitialStates = () => {
            gsap.set(orangeGlow, { opacity: 0, scale: 0.4 });
            gsap.set([mainHeading, subHeading], { opacity: 0, x: -50 });
            gsap.set(profileCards, { opacity: 0, y: 40, scale: 0.96 });
            gsap.set(redirectWrapper, { opacity: 0, y: 20 });
        };

        setInitialStates();

        const timeline = gsap.timeline({ paused: true });

        timeline
            // 1. Ambient lighting initialization
            .to(orangeGlow, { opacity: 0.15, scale: 1, duration: 0.8, ease: "power2.out" })
            
            // 2. Text layout entry
            .to(mainHeading, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.4")
            .to(subHeading, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
            
            // 3. Staggered content deployment
            .to(profileCards, { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.5, ease: "back.out(1.2)" }, "-=0.1")
            
            // 4. Interactive redirection link presentation
            .to(redirectWrapper, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }, "-=0.2");

        // Viewport intersection management
        ScrollTrigger.create({
            trigger: previewSection,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => timeline.play(),
            onLeave: () => timeline.reverse(),
            onEnterBack: () => timeline.play(),
            onLeaveBack: () => timeline.reverse(),
            invalidateOnRefresh: true
        });
    }
});



//services 
document.addEventListener('DOMContentLoaded', () => {
    const servicesSection = document.getElementById('services');
    
    if (servicesSection) {
        // Target background glows and layout blocks separately
        const glowEngines = servicesSection.querySelectorAll('.bg-cyan-500, .bg-orange-500, .bg-cyan-400');
        const miniHeading = servicesSection.querySelector('h2');
        const mainHeading = servicesSection.querySelector('h1');
        const tabNavigation = servicesSection.querySelector('.service-tabs');
        const contentContainer = servicesSection.querySelector('.relative.max-w-3xl.mx-auto');

        // Isolate initial structural properties
        const setInitialStates = () => {
            gsap.set(glowEngines, { opacity: 0, scale: 0.6 });
            gsap.set(miniHeading, { opacity: 0, y: -20 });
            gsap.set(mainHeading, { opacity: 0, y: -30 });
            gsap.set(tabNavigation, { opacity: 0, scale: 0.95, y: 20 });
            gsap.set(contentContainer, { opacity: 0, y: 40 });
        };

        setInitialStates();

        const clearTimeline = gsap.timeline({ paused: true });

        clearTimeline
            // 1. Reveal ambient atmosphere
            .to(glowEngines, { opacity: 0.7, scale: 1, duration: 1, stagger: 0.15, ease: "power2.out" })
            
            // 2. Animate typography headers
            .to(miniHeading, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.8")
            .to(mainHeading, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.6")
            
            // 3. Slide in navigation controls
            .to(tabNavigation, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.2)" }, "-=0.4")
            
            // 4. Reveal active description container
            .to(contentContainer, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");

        // Bi-directional scroll tracking
        ScrollTrigger.create({
            trigger: servicesSection,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => clearTimeline.play(),
            onLeave: () => clearTimeline.reverse(),
            onEnterBack: () => clearTimeline.play(),
            onLeaveBack: () => clearTimeline.reverse(),
            invalidateOnRefresh: true
        });
    }
});




// project preview
document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.getElementById('projects');
    
    if (projectsSection) {
        const ambientGlows = projectsSection.querySelectorAll('.bg-cyan-500, .bg-orange-600');
        const topHeader = projectsSection.querySelector('h4');
        const mainHeader = projectsSection.querySelector('h2');
        const projectGridItems = projectsSection.querySelectorAll('#recent-projects-list > div');
        const primaryButton = projectsSection.querySelector('.text-center');

        const setInitialStates = () => {
            gsap.set(ambientGlows, { opacity: 0, scale: 0.5 });
            gsap.set(topHeader, { opacity: 0, y: -20 });
            gsap.set(mainHeader, { opacity: 0, y: -30 });
            gsap.set(projectGridItems, { opacity: 0, y: 50, scale: 0.95 });
            gsap.set(primaryButton, { opacity: 0, y: 30 });
        };

        setInitialStates();

        const clearTimeline = gsap.timeline({ paused: true });

        clearTimeline
            .to(ambientGlows, { opacity: 0.1, scale: 1, duration: 0.9, ease: "power2.out" })
            .to(topHeader, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.6")
            .to(mainHeader, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.4")
            .to(projectGridItems, { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.6, ease: "power2.out" })
            .to(primaryButton, { opacity: 1, y: 0, duration: 0.4, ease: "power1.out" }, "-=0.3");

        ScrollTrigger.create({
            trigger: projectsSection,
            start: "top 80%",
            end: "bottom top", 
            onEnter: () => clearTimeline.play(),
            onLeave: () => clearTimeline.reverse(),
            onEnterBack: () => clearTimeline.play(),
            onLeaveBack: () => clearTimeline.reverse(),
            invalidateOnRefresh: true
        });

        // Forces GSAP to recalculate positions once all project images load
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }
});












    // ==========================================
    // 2. TIMELINE TRACK ENGINE (REUSABLE)
    // ==========================================
    function initTimelineAnimation(sectionSelector, lineId, cardClass) {
        const targetSection = document.querySelector(sectionSelector);
        const scrollLine = document.querySelector(lineId);

        // Exit early if elements are missing to prevent syntax crashes
        if (!targetSection || !scrollLine) return;

        // Draw the vertical track spine line dynamically on scroll
        gsap.fromTo(scrollLine, 
            { height: "0%" },
            {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: targetSection,
                    start: "top 70%",
                    end: "bottom 80%",
                    scrub: true,
                }
            }
        );

        // Sequence individual card tracking rows smoothly
        gsap.utils.toArray(cardClass).forEach((card) => {
            const dot = card.querySelector('.gsap-marker');
            const badge = card.querySelector('.gsap-badge');
            const innerCard = card.querySelector('.bg-gray-900\\/40');

            const cardTl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            if (dot) cardTl.to(dot, { backgroundColor: "#22d3ee", scale: 1.2, duration: 0.2, ease: "power2.out" });
            if (badge) cardTl.to(badge, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.1");
            if (innerCard) {
                cardTl.fromTo(innerCard, 
                    { opacity: 0, y: 30, rotationX: -10, transformOrigin: "top center" },
                    { opacity: 1, y: 0, rotationX: 0, duration: 0.5, ease: "power3.out" }, 
                    "-=0.2"
                );
            }
        });
    }

    // Initialize individual tracks for both sections independently safely
    initTimelineAnimation("#education", "#education-scroll-line", ".gsap-education-card");
    initTimelineAnimation("#work-history", "#work-scroll-line", ".gsap-work-card");

    