document.addEventListener('DOMContentLoaded', function() {
    // Welcome modal
    const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));
    setTimeout(() => welcomeModal.show(), 1000);
    
    document.getElementById('welcomeModal').addEventListener('hidden.bs.modal', function () {
        sessionStorage.setItem('welcomeModalShown', 'true');
    });
    
    if (sessionStorage.getItem('welcomeModalShown')) return;

    // Brands carousel
    const brandsTrack = document.querySelector('.brands-track');
    if (brandsTrack) {
        brandsTrack.addEventListener('mouseenter', () => brandsTrack.style.animationPlayState = 'paused');
        brandsTrack.addEventListener('mouseleave', () => brandsTrack.style.animationPlayState = 'running');
    }

    // Product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() { this.style.transform = 'translateY(-5px)'; });
        card.addEventListener('mouseleave', function() { this.style.transform = 'translateY(0)'; });
    });

    // Testimonials scroll - ИСПРАВЛЕННАЯ ЧАСТЬ
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const scrollPrev = document.querySelector('.scroll-prev');
    const scrollNext = document.querySelector('.scroll-next');
    
    if (testimonialsTrack && scrollPrev && scrollNext) {
        const scrollAmount = 370; // card width + gap
        
        scrollNext.addEventListener('click', function() {
            testimonialsTrack.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
        
        scrollPrev.addEventListener('click', function() {
            testimonialsTrack.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Touch swipe support
        let isDragging = false;
        let startX;
        let scrollLeft;

        testimonialsTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - testimonialsTrack.offsetLeft;
            scrollLeft = testimonialsTrack.scrollLeft;
            testimonialsTrack.style.cursor = 'grabbing';
        });

        testimonialsTrack.addEventListener('mouseleave', () => {
            isDragging = false;
            testimonialsTrack.style.cursor = 'grab';
        });

        testimonialsTrack.addEventListener('mouseup', () => {
            isDragging = false;
            testimonialsTrack.style.cursor = 'grab';
        });

        testimonialsTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - testimonialsTrack.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsTrack.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        testimonialsTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - testimonialsTrack.offsetLeft;
            scrollLeft = testimonialsTrack.scrollLeft;
        });

        testimonialsTrack.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - testimonialsTrack.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsTrack.scrollLeft = scrollLeft - walk;
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                testimonialsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else if (e.key === 'ArrowRight') {
                testimonialsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });

        // Auto-scroll
        let autoScrollInterval;

        function startAutoScroll() {
            autoScrollInterval = setInterval(() => {
                if (isElementInViewport(testimonialsTrack)) {
                    testimonialsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    
                    // Reset to start if at the end
                    if (testimonialsTrack.scrollLeft + testimonialsTrack.clientWidth >= testimonialsTrack.scrollWidth - 10) {
                        setTimeout(() => {
                            testimonialsTrack.scrollTo({ left: 0, behavior: 'smooth' });
                        }, 1000);
                    }
                }
            }, 4000);
        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }

        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // Pause auto-scroll on interaction
        testimonialsTrack.addEventListener('mouseenter', stopAutoScroll);
        testimonialsTrack.addEventListener('mouseleave', startAutoScroll);
        testimonialsTrack.addEventListener('touchstart', stopAutoScroll);

        // Start auto-scroll
        startAutoScroll();
    }

    // Dress style cards
    const dressCards = document.querySelectorAll('.dress-card');
    dressCards.forEach(card => {
        card.addEventListener('click', function() {
            const styleName = this.querySelector('.text-white').textContent;
            console.log('Dress style selected:', styleName);
        });
    });

    // Newsletter
    const newsletterForm = document.querySelector('.newsletter .input-group');
    if (newsletterForm) {
        const subscribeBtn = newsletterForm.querySelector('.btn');
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        
        subscribeBtn.addEventListener('click', function() {
            const email = emailInput.value;
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailInput.value = '';
                alert('Thank you for subscribing!');
            } else {
                emailInput.classList.add('is-invalid');
                setTimeout(() => emailInput.classList.remove('is-invalid'), 3000);
            }
        });

        // Enter key support
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                subscribeBtn.click();
            }
        });
    }

    // View All buttons
    const viewAllButtons = document.querySelectorAll('.btn-outline-dark');
    viewAllButtons.forEach(button => {
        if (button.textContent === 'View All') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.closest('section');
                const sectionTitle = section.querySelector('h2').textContent;
                console.log('View All clicked for:', sectionTitle);
            });
        }
    });

    // Footer links
    const footerLinks = document.querySelectorAll('.footer a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent;
            console.log('Footer link clicked:', linkText);
        });
    });
});