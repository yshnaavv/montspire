/* ==========================================================================
   Montspire International - JavaScript Application Logic
   Handles: AOS, Swiper, Animated Counters, Navbar Scroll, FAQ Search, Form Handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize AOS Animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  // 2. Navbar Scroll Glass & Active Link Highlight
  const navbar = document.querySelector('.navbar-glass');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Set Active Nav Link based on current page URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPath || (currentPath === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Back to Top Button Logic
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 4. Animated Counters Observer
  const counterElements = document.querySelectorAll('.counter-value');
  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-target') || '0', 10);
          const suffix = target.getAttribute('data-suffix') || '';
          const prefix = target.getAttribute('data-prefix') || '';
          const duration = 2000;
          const frameRate = 30;
          const totalFrames = Math.round(duration / frameRate);
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            // Ease out quad formula
            const currentCount = Math.round(endValue * (1 - Math.pow(1 - progress, 3)));
            target.textContent = `${prefix}${currentCount.toLocaleString()}${suffix}`;

            if (frame === totalFrames) {
              clearInterval(counter);
              target.textContent = `${prefix}${endValue.toLocaleString()}${suffix}`;
            }
          }, frameRate);

          observer.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // 5. Swiper Slider Initializations
  if (typeof Swiper !== 'undefined') {
    // University Logo Carousel
    if (document.querySelector('.uniSwiper')) {
      new Swiper('.uniSwiper', {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        breakpoints: {
          576: { slidesPerView: 3, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 30 },
          1024: { slidesPerView: 6, spaceBetween: 30 }
        }
      });
    }

    // Testimonial Swiper Slider
    if (document.querySelector('.testimonialSwiper')) {
      new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: { slidesPerView: 2, spaceBetween: 30 },
          1200: { slidesPerView: 3, spaceBetween: 30 }
        }
      });
    }
  }

  // 6. FAQ Search Filter
  const faqSearchInput = document.getElementById('faqSearch');
  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const accordionItems = document.querySelectorAll('.accordion-item');

      accordionItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 7. Contact & Consultation Form Handler
  const inquiryForms = document.querySelectorAll('.js-inquiry-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Submit';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> Sending Request...`;
      }

      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
        
        // Show success alert modal or notification
        const alertBox = document.createElement('div');
        alertBox.className = 'alert alert-success alert-dismissible fade show mt-3';
        alertBox.role = 'alert';
        alertBox.innerHTML = `
          <strong><i class="fas fa-check-circle me-2"></i> Thank You!</strong> Your inquiry has been received. Our senior education consultant will contact you within 24 hours.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        form.appendChild(alertBox);
        form.reset();
      }, 1200);
    });
  });
});
