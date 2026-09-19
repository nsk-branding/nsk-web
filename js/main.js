document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. TEMA CLARO/OSCURO
    (function theme() {
        const toggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        if (!toggle) return;
        const savedTheme = localStorage.getItem('nsk-theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        toggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('nsk-theme', next);
        });
    })();

    // 2. MENÚ MÓVIL
    (function mobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        if (!hamburger || !mobileMenu) return;
        hamburger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            hamburger.classList.toggle('is-active');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
                hamburger.classList.remove('is-active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header') && mobileMenu.classList.contains('is-open')) {
                mobileMenu.classList.remove('is-open');
                hamburger.classList.remove('is-active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    })();

    // 3. HEADER DINÁMICO
    (function dynamicHeader() {
        const header = document.getElementById('header');
        if (!header) return;
        let ticking = false;
        const update = () => {
            if (window.scrollY > 40) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    })();

    // 4. SCROLL SUAVE
    (function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({
                        top,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });
    })();

    // 5. ANIMACIONES AL SCROLL
    (function scrollAnimations() {
        const elements = document.querySelectorAll('[data-animate]');
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('is-visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        elements.forEach(el => observer.observe(el));
    })();

    // 6. ENVÍO DEL FORMULARIO
    (function contactForm() {
        const form = document.getElementById('contactForm');
        const status = document.getElementById('formStatus');
        if (!form || !status) return;
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            status.textContent = 'Enviando...';
            status.className = 'form-status is-loading';
            const data = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    status.textContent = '¡Mensaje enviado! Redirigiendo...';
                    status.className = 'form-status is-success';
                    form.reset();
                    setTimeout(() => {
                        window.location.href = 'gracias.html';
                    }, 800);
                } else {
                    throw new Error('Error en la respuesta');
                }
            } catch (error) {
                status.textContent = 'Hubo un problema. Escribinos a nsk.branding@gmail.com';
                status.className = 'form-status is-error';
            }
        });
    })();

    // 7. LOG SOLO EN DESARROLLO
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('%cNSK', 'color: #6C5CE7; font-size: 24px; font-weight: 700; font-family: sans-serif;');
        console.log('%cEstudio digital · Montevideo', 'color: #8A8A9A; font-size: 12px;');
    }
});