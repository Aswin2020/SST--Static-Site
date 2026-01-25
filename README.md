# Shri Selvam Tiles & Granites
## Premium Tiles Showroom Website

A professional, multi-page website for a luxury tiles and granites showroom with modern design, smooth animations, and functional contact form with email integration.

---

## 🎯 **Features**

### **Frontend**
- ✅ **4 Pages**: Home, Products, About, Contact
- ✅ **Sticky Navigation**: Active page highlighting, mobile-responsive menu
- ✅ **Hero Section**: Full-width background video with overlay
- ✅ **Product Categories**: 6 tile categories with images and descriptions
- ✅ **Products Page**: 12 sample products with filters (Category, Brand, Size)
- ✅ **About Page**: Company story, values, and trust factors
- ✅ **Contact Page**: Working contact form with validation
- ✅ **Smooth Animations**: AOS (Animate On Scroll) library
- ✅ **Mobile Responsive**: Works perfectly on all devices
- ✅ **SEO Optimized**: Proper meta tags and heading structure

### **Design**
- 🎨 **Color Palette**: Black, Gold (#d4af37), Grey, White
- 🎨 **Typography**: Playfair Display (headings) + Poppins (body)
- 🎨 **Icons**: Font Awesome 6
- 🎨 **Premium Look**: Luxury showroom aesthetic

### **Backend**
- 📧 **Email Functionality**: SMTP email sending on form submission
- 📧 **Two Options**: Python Flask OR Node.js
- 📧 **HTML Email**: Professional email template
- 📧 **Success/Error Messages**: User feedback on form submission

---

## 📁 **Folder Structure**

```
demo-html-site/
│
├── index.html              # Home page
├── products.html           # Products listing page
├── about.html             # About us page
├── contact.html           # Contact page with form
│
├── css/
│   └── style.css          # Centralized stylesheet
│
├── js/
│   └── main.js            # JavaScript functionality
│
├── assets/
│   ├── images/
│   │   └── products/      # Product images (placeholder)
│   │       ├── floor1.jpg
│   │       ├── wall1.jpg
│   │       └── bathroom1.jpg
│   │
│   └── videos/
│       └── home-tiles.mp4 # Hero section video
│
└── backend/
    ├── app.py             # Python Flask server
    ├── server.js          # Node.js server (alternative)
    ├── requirements.txt   # Python dependencies
    ├── package.json       # Node.js dependencies
    └── .env.example       # Environment variables template
```

---

## 🚀 **Setup Instructions**

### **1. Frontend Setup**

The frontend is ready to use! Simply open `index.html` in a browser.

**For local development with Live Server:**
```bash
# If using VS Code, install Live Server extension
# Right-click on index.html → "Open with Live Server"
```

### **2. Add Your Video**

Place your tiles showroom video at:
```
assets/videos/home-tiles.mp4
```

If you don't have a video yet, the website uses a fallback online video.

### **3. Add Product Images**

Add your actual product images to:
```
assets/images/products/
```

Update the image paths in `products.html` to match your filenames.

---

## 📧 **Backend Setup (Email Functionality)**

### **Option A: Python Flask Backend**

#### **Step 1: Install Python** (if not already installed)
Download from: https://www.python.org/downloads/

#### **Step 2: Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

#### **Step 3: Configure Email**
1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your email credentials:
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   RECIPIENT_EMAIL=info@shriselvamtiles.com
   ```

**For Gmail:**
- Enable 2-Factor Authentication
- Generate App Password: https://myaccount.google.com/apppasswords
- Use the App Password (not your regular password)

#### **Step 4: Run the Server**
```bash
python app.py
```

Server will run on: http://localhost:5000

---

### **Option B: Node.js Backend**

#### **Step 1: Install Node.js** (if not already installed)
Download from: https://nodejs.org/

#### **Step 2: Install Dependencies**
```bash
cd backend
npm install
```

#### **Step 3: Configure Email**
Same as Python option - edit the `.env` file

#### **Step 4: Run the Server**
```bash
npm start
```

OR for development with auto-reload:
```bash
npm run dev
```

---

## 🌐 **Deployment**

### **Frontend Hosting (Free Options)**
- **Netlify**: https://www.netlify.com/
- **Vercel**: https://vercel.com/
- **GitHub Pages**: https://pages.github.com/

### **Backend Hosting**
- **Heroku**: https://www.heroku.com/
- **Render**: https://render.com/
- **Railway**: https://railway.app/

### **Full Stack Hosting**
- **DigitalOcean**: https://www.digitalocean.com/
- **AWS**: https://aws.amazon.com/
- **Google Cloud**: https://cloud.google.com/

---

## 🎨 **Customization Guide**

### **Update Business Information**

#### **1. Contact Details**
Edit in ALL HTML files (footer section):
- Business name
- Address
- Phone numbers
- Email
- Business hours

#### **2. Phone & WhatsApp Numbers**
Search and replace `+919876543210` with your actual number in:
- `index.html`
- `products.html`
- `about.html`
- `contact.html`
- `js/main.js`

#### **3. Google Maps**
In `contact.html`, replace the Google Maps embed URL with your location.

Get your embed code: https://www.google.com/maps/

#### **4. Colors**
Edit in `css/style.css`:
```css
:root {
  --color-black: #1a1a1a;
  --color-gold: #d4af37;
  --color-grey: #6b6b6b;
  --color-light-grey: #e5e5e5;
  --color-white: #ffffff;
}
```

### **Add More Products**

In `products.html`, duplicate a product card and modify:
```html
<div class="product-listing-card" data-category="floor" data-brand="kag" data-size="600x600">
  <div class="product-image">
    <img src="your-image.jpg" alt="Product Name">
  </div>
  <div class="product-details">
    <h3 class="product-name">Your Product Name</h3>
    <!-- Rest of the product details -->
  </div>
</div>
```

---

## 📱 **Testing**

### **Test Contact Form**

1. Start the backend server (Python or Node.js)
2. Open `contact.html` in browser
3. Fill out the form
4. Submit
5. Check your email inbox

### **Mobile Responsiveness**

Test on different devices:
- Desktop (1920px, 1366px)
- Tablet (768px, 1024px)
- Mobile (375px, 414px)

Use browser DevTools: `F12` → Toggle Device Toolbar

---

## 🔧 **Troubleshooting**

### **Contact Form Not Working**

1. **Check backend server is running**
   - Should see "Server running on http://localhost:5000" in terminal

2. **Check SMTP credentials**
   - Verify `.env` file has correct email/password
   - For Gmail, use App Password, not regular password

3. **Check browser console**
   - Press `F12` → Console tab
   - Look for error messages

4. **CORS Issues**
   - Backend already has CORS enabled
   - If still facing issues, run frontend and backend on same domain

### **Images Not Loading**

- Check image paths are correct
- Ensure images exist in `assets/images/products/`
- Use lowercase filenames without spaces

### **Video Not Playing**

- Check video file exists at `assets/videos/home-tiles.mp4`
- Use MP4 format (H.264 codec)
- Compress video to under 10MB for faster loading

---

## 📄 **License**

This project is created for Shri Selvam Tiles & Granites.

---

## 👨‍💻 **Support**

For customization or technical support:
- Email: info@shriselvamtiles.com
- Phone: +91 98765 43210

---

## 🎉 **Credits**

- **Fonts**: Google Fonts (Poppins, Playfair Display)
- **Icons**: Font Awesome 6
- **Animations**: AOS Library
- **Images**: Unsplash (placeholder images)

---

**Built with ❤️ for Shri Selvam Tiles & Granites**
