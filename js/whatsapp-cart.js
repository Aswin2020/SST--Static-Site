/**
 * WhatsApp Cart System
 * Elegant, minimal, non-intrusive cart for tiles products
 */

const WhatsAppCart = {
  // Configuration
  config: {
    whatsappNumber: '919942929527',
    storageKey: 'tilesWhatsAppCart',
    // Your website URL - update this when you deploy the site
    websiteUrl: 'https://yourwebsite.com/'
  },

  // Initialize cart
  init() {
    this.createCartModal();
    this.updateCartBadge();
    this.attachEventListeners();
  },

  // Get cart items from localStorage
  getCart() {
    try {
      const cart = localStorage.getItem(this.config.storageKey);
      return cart ? JSON.parse(cart) : [];
    } catch (e) {
      console.error('Error reading cart:', e);
      return [];
    }
  },

  // Save cart to localStorage
  saveCart(cart) {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(cart));
      this.updateCartBadge();
      return true;
    } catch (e) {
      console.error('Error saving cart:', e);
      return false;
    }
  },

  // Add product to cart
  addToCart(product) {
    const cart = this.getCart();
    
    // Check if product already exists
    const exists = cart.some(item => item.id === product.id);
    
    if (exists) {
      this.showNotification('Product already in cart', 'info');
      return false;
    }

    // Add product
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      images: product.images,
      pageUrl: product.pageUrl,
      addedAt: new Date().toISOString()
    });

    this.saveCart(cart);
    this.showNotification('Added to WhatsApp Cart!', 'success');
    return true;
  },

  // Remove product from cart
  removeFromCart(productId) {
    let cart = this.getCart();
    const product = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    this.saveCart(cart);
    this.showNotification('Removed from cart', 'info');
    this.renderCartItems();
  },

  // Clear entire cart
  clearCart() {
    if (this.getCart().length === 0) return;
    
    if (confirm('Are you sure you want to clear all items from your cart?')) {
      localStorage.removeItem(this.config.storageKey);
      this.updateCartBadge();
      this.renderCartItems();
      this.showNotification('Cart cleared', 'info');
    }
  },

  // Update cart badge count
  updateCartBadge() {
    const cart = this.getCart();
    const badge = document.querySelector('.whatsapp-cart-badge');
    
    if (badge) {
      const count = cart.length;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  },

  // Generate WhatsApp message
  generateWhatsAppMessage() {
    const cart = this.getCart();
    
    if (cart.length === 0) {
      return 'Hello,\n\nI would like to inquire about your tiles products.';
    }

    let message = 'Hello,\n\nI am interested in the following tiles:\n\n';

    cart.forEach((product, index) => {
      message += `${index + 1}. ${product.name}\n`;
      
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          // Convert relative path to full web URL
          const fullUrl = this.config.websiteUrl + img;
          message += `${fullUrl}\n`;
        });
      }
      
      message += '\n';
    });

    message += 'Please share best price and availability.\n';
    message += 'Thank you!';

    return message;
  },

  // Open WhatsApp with cart items
  sendToWhatsApp() {
    const cart = this.getCart();
    
    if (cart.length === 0) {
      this.showNotification('Cart is empty. Add products first!', 'warning');
      return;
    }

    this.closeCartModal();
    const message = this.generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.config.whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  },

  // Show notification
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.whatsapp-cart-notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `whatsapp-cart-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // Create cart modal HTML
  createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'whatsapp-cart-modal';
    modal.id = 'whatsappCartModal';
    modal.innerHTML = `
      <div class="cart-modal-content">
        <div class="cart-modal-header">
          <h3>
            <i class="fab fa-whatsapp"></i>
            WhatsApp Cart
          </h3>
          <button class="cart-close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="cart-modal-body" id="cartModalBody">
          <!-- Cart items will be rendered here -->
        </div>
        <div class="cart-modal-footer">
          <button class="btn-clear-cart">
            <i class="fas fa-trash"></i>
            Clear All
          </button>
          <button class="btn-send-whatsapp">
            <i class="fab fa-whatsapp"></i>
            Send to WhatsApp
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  },

  // Render cart items in modal
  renderCartItems() {
    const cart = this.getCart();
    const modalBody = document.getElementById('cartModalBody');
    
    if (!modalBody) return;

    if (cart.length === 0) {
      modalBody.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      return;
    }

    modalBody.innerHTML = cart.map(item => `
      <div class="cart-item" data-product-id="${item.id}">
        <img src="${item.images && item.images[0] ? item.images[0] : 'assets/images/placeholder.jpg'}" 
             alt="${item.name}" 
             class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-category">${item.category}</div>
        </div>
        <button class="cart-item-remove" data-product-id="${item.id}">
          Remove
        </button>
      </div>
    `).join('');
  },

  // Open cart modal
  openCartModal() {
    const modal = document.getElementById('whatsappCartModal');
    if (modal) {
      this.renderCartItems();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  // Close cart modal
  closeCartModal() {
    const modal = document.getElementById('whatsappCartModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  // Attach event listeners
  attachEventListeners() {
    // WhatsApp cart floating button click - open modal
    document.addEventListener('click', (e) => {
      if (e.target.closest('.whatsapp-cart-btn')) {
        e.preventDefault();
        this.openCartModal();
      }

      // Close modal
      if (e.target.closest('.cart-close-btn') || e.target.classList.contains('whatsapp-cart-modal')) {
        this.closeCartModal();
      }

      // Remove item from cart
      if (e.target.classList.contains('cart-item-remove')) {
        const productId = e.target.getAttribute('data-product-id');
        this.removeFromCart(productId);
      }

      // Clear cart
      if (e.target.closest('.btn-clear-cart')) {
        this.clearCart();
      }

      // Send to WhatsApp
      if (e.target.closest('.btn-send-whatsapp')) {
        this.sendToWhatsApp();
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCartModal();
      }
    });
  },

  // Get product data from current page (for product details page)
  getCurrentProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    
    if (!productId) return null;

    const images = [];
    const mainImg = document.getElementById('mainImage');
    const additionalImg = document.getElementById('additionalImage');
    
    // Extract relative paths from image src
    if (mainImg && mainImg.src) {
      const relativePath = mainImg.getAttribute('src') || mainImg.src.split('/').slice(-3).join('/');
      images.push(relativePath);
    }
    if (additionalImg && additionalImg.src && additionalImg.src !== '') {
      const relativePath = additionalImg.getAttribute('src') || additionalImg.src.split('/').slice(-3).join('/');
      images.push(relativePath);
    }

    return {
      id: productId,
      name: document.getElementById('productName')?.textContent || 'Unknown Product',
      category: document.getElementById('productCategory')?.textContent || 'Tiles',
      images: images,
      pageUrl: window.location.href
    };
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  WhatsAppCart.init();
});

// Expose to global scope for inline usage
window.WhatsAppCart = WhatsAppCart;
