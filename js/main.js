// ========================================
// SHRI SELVAM TILES & GRANITES
// Main JavaScript File
// ========================================

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }

  // Initialize all functionality
  initMobileMenu();
  initScrollToTop();
  initSmoothScroll();
  initHeaderScroll();
  initProductFilters();
  initContactForm();
  initEnquiryButtons();
});

// ========== MOBILE MENU ========== 
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.nav-container')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
}

// ========== SCROLL TO TOP ========== 
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');

  if (scrollToTopBtn) {
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// ========== SMOOTH SCROLLING ========== 
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only prevent default for actual hash links, not just "#"
      if (href !== '#' && href.includes('#')) {
        const targetId = href.split('#')[1];
        const target = document.getElementById(targetId);
        
        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // Account for fixed header
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ========== HEADER SCROLL EFFECT ========== 
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// ========== PRODUCT FILTERS (Products Page) ========== 
function initProductFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const brandFilter = document.getElementById('brandFilter');
  const sizeFilter = document.getElementById('sizeFilter');
  const productsGrid = document.getElementById('productsGrid');

  if (!productsGrid) return; // Not on products page

  const filterProducts = () => {
    const categoryValue = categoryFilter ? categoryFilter.value : 'all';
    const brandValue = brandFilter ? brandFilter.value : 'all';
    const sizeValue = sizeFilter ? sizeFilter.value : 'all';

    const products = productsGrid.querySelectorAll('.product-listing-card');

    products.forEach(product => {
      const productCategory = product.dataset.category;
      const productBrand = product.dataset.brand;
      const productSize = product.dataset.size;

      const categoryMatch = categoryValue === 'all' || productCategory === categoryValue;
      const brandMatch = brandValue === 'all' || productBrand === brandValue;
      const sizeMatch = sizeValue === 'all' || productSize === sizeValue;

      if (categoryMatch && brandMatch && sizeMatch) {
        product.style.display = 'block';
        // Re-trigger AOS animation
        product.classList.add('aos-animate');
      } else {
        product.style.display = 'none';
      }
    });
  };

  // Attach event listeners
  if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
  if (brandFilter) brandFilter.addEventListener('change', filterProducts);
  if (sizeFilter) sizeFilter.addEventListener('change', filterProducts);
}

// ========== CONTACT FORM SUBMISSION ========== 
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (!contactForm) return; // Not on contact page

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      mobile: document.getElementById('mobile').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    };

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      // Send to backend
      const response = await fetch('http://localhost:5000/send-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // Success
        showMessage(formMessage, 'success', 'Thank you! Your enquiry has been sent successfully. We will contact you soon.');
        contactForm.reset();
      } else {
        // Error from server
        showMessage(formMessage, 'error', result.message || 'Failed to send enquiry. Please try again.');
      }
    } catch (error) {
      // Network error - show alternative contact methods
      showMessage(formMessage, 'error', 'Unable to send enquiry online. Please call us at +91 98765 43210 or WhatsApp us.');
      console.error('Form submission error:', error);
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
    }
  });
}

// ========== ENQUIRY BUTTONS (Products Page) ========== 
function initEnquiryButtons() {
  // This function is called from product card buttons
  // defined in products.html onclick="openEnquiry('Product Name')"
}

// Global function for product enquiries
function openEnquiry(productName) {
  const message = `Hi, I'm interested in ${productName}. Please provide more details and pricing.`;
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// ========== HELPER FUNCTIONS ========== 

// Show form message
function showMessage(element, type, message) {
  element.className = `form-message ${type}`;
  element.textContent = message;
  element.style.display = 'block';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

// Lazy load images (for better performance)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  // Observe all images with loading="lazy"
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  });
}

// Product card hover effects (enhance visual feedback)
document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card, .product-listing-card');
  
  productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease';
    });
  });
});

// ========== VIDEO FALLBACK ========== 
// Ensure hero video plays on mobile
document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.querySelector('.hero-video');
  
  if (heroVideo) {
    // Try to play video (some browsers block autoplay)
    const playPromise = heroVideo.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented
        console.log('Video autoplay prevented:', error);
      });
    }
  }
});

// ========== CONSOLE BRANDING ========== 
console.log('%c Shri Selvam Tiles & Granites ', 'background: #1a1a1a; color: #d4af37; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c Premium Tiles Showroom Website ', 'background: #d4af37; color: #1a1a1a; font-size: 12px; padding: 5px;');
