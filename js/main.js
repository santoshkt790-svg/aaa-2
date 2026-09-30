document.addEventListener('DOMContentLoaded', () => {
  // 1. Simple Scroll Reveal System
  try {
    document.documentElement.classList.add('js');
    const items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.01, rootMargin: '0px 0px -5% 0px' });
      
      items.forEach((el, i) => {
        el.style.transitionDelay = ((i % 6) * 0.08) + 's';
        io.observe(el);
      });
    } else {
      items.forEach(el => el.classList.add('is-visible'));
    }
    // Safety net: after 2.5 seconds show everything no matter what
    setTimeout(() => document.documentElement.classList.add('no-anim'), 2500);
  } catch(e) {
    console.error("Reveal Error:", e);
  }

  // 2. Preloader
  try {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }, 800); // under 1s
    }
  } catch(e) {
    console.error("Preloader Error:", e);
  }

  // 3. Mobile Menu Toggle
  try {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
      });

      // Close menu when link clicked
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          document.body.style.overflow = 'auto';
        });
      });
    }
  } catch(e) {
    console.error("Menu Error:", e);
  }

  // 4. Sticky Header & Scroll Progress
  try {
    const header = document.querySelector('.header');
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', () => {
      // scroll progress
      if(progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (winScroll / height) * 100 + "%";
      }

      if (window.scrollY > 50) {
        if (header) header.style.padding = '0.5rem 0';
      } else {
        if (header) header.style.padding = '0';
      }
    });
  } catch(e) {
    console.error("Header Scroll Error:", e);
  }

  // 5. Scroll Spy (Active Nav Link)
  try {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-links a');

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150; // offset for sticky header
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  } catch(e) {
    console.error("Scroll Spy Error:", e);
  }

  // 6. Testimonial Slider
  try {
    const track = document.querySelector('.slider-track');
    if (track) {
      const dots = document.querySelectorAll('.slider-dots .dot');
      let currentIndex = 0;
      
      // Pause on hover/touch
      let isPaused = false;
      track.addEventListener('mouseenter', () => isPaused = true);
      track.addEventListener('mouseleave', () => isPaused = false);
      track.addEventListener('touchstart', () => isPaused = true, {passive: true});
      track.addEventListener('touchend', () => isPaused = false);

      // Auto slide
      setInterval(() => {
        if(!isPaused) {
          currentIndex = (currentIndex + 1) % dots.length;
          updateSlider();
        }
      }, 5000);

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateSlider();
        });
      });

      function updateSlider() {
        const isDesktop = window.innerWidth >= 992;
        const itemWidth = isDesktop ? 33.333 : 100; 
        let maxIndex = isDesktop ? Math.max(0, dots.length - 3) : dots.length - 1;
        let targetIndex = Math.min(currentIndex, maxIndex);

        track.style.transform = `translateX(-${targetIndex * itemWidth}%)`;
        dots.forEach(d => d.classList.remove('active'));
        if(dots[currentIndex]) {
          dots[currentIndex].classList.add('active');
        }
      }
      window.addEventListener('resize', updateSlider);
      updateSlider(); // initial layout
    }
  } catch(e) {
    console.error("Slider Error:", e);
  }

  // 7. FAQ Accordion
  try {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
      // By default open the first item
      if(index === 0) item.classList.add('active');

      const header = item.querySelector('.faq-header');
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  } catch(e) {
    console.error("FAQ Error:", e);
  }

  // 8. Blog Category Filtering
  try {
    const chips = document.querySelectorAll('.chip');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('blogSearch');

    if (chips.length && blogCards.length) {
      const filterBlogs = () => {
        const activeCategoryNode = document.querySelector('.chip.active');
        const activeCategory = activeCategoryNode ? activeCategoryNode.textContent.toLowerCase() : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        blogCards.forEach(card => {
          const category = (card.dataset.category || '').toLowerCase();
          const titleElement = card.querySelector('h3');
          const title = titleElement ? titleElement.textContent.toLowerCase() : '';
          
          const matchesCategory = activeCategory === 'all' || category === activeCategory;
          const matchesSearch = title.includes(searchTerm);

          if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      };

      chips.forEach(chip => {
        chip.addEventListener('click', () => {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          filterBlogs();
        });
      });

      if(searchInput) {
        searchInput.addEventListener('input', filterBlogs);
      }
    }
  } catch(e) {
    console.error("Blog Filter Error:", e);
  }

  // 9. Contact Form - WhatsApp Submission
  try {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service').value;
        const msg = document.getElementById('message').value;

        let text = `Hello AAA Hospital, I would like to book an appointment.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}`;
        if (email) text += `%0A*Email:* ${email}`;
        if (service) text += `%0A*Service:* ${service}`;
        if (msg) text += `%0A*Message:* ${msg}`;

        const btn = contactForm.querySelector('button[type="submit"]');
        if(btn) {
           btn.classList.add('loading');
           btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Sending...';
        }

        setTimeout(() => {
           const whatsappUrl = `https://wa.me/919728030109?text=${text}`;
           window.open(whatsappUrl, '_blank');
           
           if(btn) {
             btn.classList.remove('loading');
             btn.classList.add('success');
             btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 8px;"></i> Sent Successfully';
             setTimeout(() => {
               btn.classList.remove('success');
               btn.innerHTML = '<i class="fa-brands fa-whatsapp" style="margin-right: 8px;"></i> Send via WhatsApp';
             }, 3000);
           }
           contactForm.reset();
        }, 800);
      });
    }
  } catch(e) {
    console.error("Contact Form Error:", e);
  }

  // 10. Hero Appointment Form - WhatsApp Submission
  try {
    const heroForm = document.getElementById('heroAppointmentForm');
    if (heroForm) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const service = heroForm.querySelector('select:nth-child(1)') ? heroForm.querySelector('select:nth-child(1)').value : '';
        const doctor = heroForm.querySelector('select:nth-child(2)') ? heroForm.querySelector('select:nth-child(2)').value : '';
        const dateInput = heroForm.querySelector('input[type="date"]');
        const date = dateInput ? dateInput.value : '';

        let text = `Hello AAA Hospital, I want to book a quick appointment.%0A%0A*Service:* ${service || 'Not specified'}%0A*Doctor:* ${doctor || 'Any'}%0A*Date:* ${date || 'Earliest possible'}`;
        
        const whatsappUrl = `https://wa.me/919728030109?text=${text}`;
        window.open(whatsappUrl, '_blank');
        heroForm.reset();
      });
    }
  } catch(e) {
    console.error("Hero Form Error:", e);
  }

  // 11. GSAP Hero Intro Animations (No ScrollTrigger for reveals)
  try {
    if (typeof gsap !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion) {
        // Hero Background slow zoom loop
        const heroBg = document.querySelector('.hero-bg-zoom');
        if (heroBg) {
          gsap.to(heroBg, {
            scale: 1.05,
            duration: 10,
            ease: "none",
            repeat: -1,
            yoyo: true
          });
        }

        // Hero Content intro cascade
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          gsap.from(heroContent.children, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            delay: 0.6,
            ease: "power2.out"
          });
        }
        
        const appointmentBar = document.querySelector('.appointment-bar');
        if (appointmentBar) {
          gsap.from(appointmentBar, {
            x: 50,
            opacity: 0,
            duration: 0.8,
            delay: 1.0,
            ease: "power2.out"
          });
        }
      }
    } else {
      // Fallback if GSAP is blocked or fails to load
      document.querySelectorAll('.gsap-init').forEach(el => el.classList.remove('gsap-init'));
    }
  } catch(e) {
    console.error("GSAP Intro Error:", e);
    document.querySelectorAll('.gsap-init').forEach(el => el.classList.remove('gsap-init'));
  }

  // 12. Doctor Modal Logic
  try {
    const modal = document.getElementById('doctorModal');
    const closeBtn = document.querySelector('.modal-close');
    const viewBtns = document.querySelectorAll('.view-details-btn');
    
    if (modal && closeBtn && viewBtns.length) {
      const modalImg = document.getElementById('modalDocImg');
      const modalName = document.getElementById('modalDocName');
      const modalRole = document.getElementById('modalDocRole');
      const modalDesc = document.getElementById('modalDocDesc');
      
      const openModal = (e) => {
        const btn = e.currentTarget;
        modalImg.src = btn.dataset.img || '';
        modalName.textContent = btn.dataset.name || 'Doctor';
        modalRole.textContent = btn.dataset.role || 'Specialist';
        modalDesc.textContent = btn.dataset.desc || '';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      };
      
      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      };

      viewBtns.forEach(btn => btn.addEventListener('click', openModal));
      closeBtn.addEventListener('click', closeModal);
      
      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
      });
    }
  } catch(e) {
    console.error("Modal Error:", e);
  }
});
