

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initCursor();
    initScrollAnimations();
    initScrollIndicator();
    initMobileMenu();
});

/* =========================================
   Custom Cursor Logic - Enhanced
   ========================================= */
function initCursor() {
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot follows instantly
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
    });

    // Smooth outline following with animation frame
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.1;
        outlineY += (mouseY - outlineY) * 0.1;
        
        outline.style.left = `${outlineX}px`;
        outline.style.top = `${outlineY}px`;
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Enhanced hover effects
    const clickables = document.querySelectorAll('a, button, .hobby-card, .skill-card, .timeline-content');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.width = '80px';
            outline.style.height = '80px';
            outline.style.backgroundColor = 'rgba(108, 92, 231, 0.15)';
            outline.style.borderWidth = '3px';
            dot.style.transform = 'translate(-50%, -50%) scale(2)';
            dot.style.backgroundColor = '#6c5ce7';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.width = '40px';
            outline.style.height = '40px';
            outline.style.backgroundColor = 'transparent';
            outline.style.borderWidth = '2px';
            dot.style.transform = 'translate(-50%, -50%) scale(1)';
            dot.style.backgroundColor = '#6c5ce7';
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(0.8)';
        outline.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });

    document.addEventListener('mouseup', () => {
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
}

/* =========================================
   Typewriter Effect
   ========================================= */
function initTypewriter() {
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    // Inject CSS for cursor blink just in case
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid var(--primary); }";
    document.body.appendChild(css);
}

class TxtRotate {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }

    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        let delta = 300 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => {
            this.tick();
        }, delta);
    }
}

/* =========================================
   Scroll Animations (Observer)
   ========================================= */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.skill-card, .hobby-card, .timeline-content');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* =========================================
   Scroll Indicator Hide on Scroll
   ========================================= */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (!scrollIndicator) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }
    });
}

/* =========================================
   Mobile Menu Toggle
   ========================================= */
function initMobileMenu() {
    const toggler = document.querySelector('.custom-toggler');
    const navCollapse = document.getElementById('navbarNav');

    if (!toggler || !navCollapse) return;

    // Listen for Bootstrap's collapse events
    navCollapse.addEventListener('show.bs.collapse', () => {
        toggler.setAttribute('aria-expanded', 'true');
    });

    navCollapse.addEventListener('hide.bs.collapse', () => {
        toggler.setAttribute('aria-expanded', 'false');
    });
}