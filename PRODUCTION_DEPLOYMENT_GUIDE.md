# 🚀 PRODUCTION DEPLOYMENT GUIDE
## RUMI by Manisha - Go Live Checklist

**Complete guide to deploy your e-commerce platform to production**

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### **1. Code Preparation**
- [ ] All features tested locally
- [ ] No console errors
- [ ] All APIs working
- [ ] Database populated with real data
- [ ] Images optimized
- [ ] Remove test/dummy data

### **2. Security**
- [ ] Change admin password
- [ ] Update database credentials
- [ ] Remove debug/development code
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Secure API endpoints

### **3. Performance**
- [ ] Build frontend for production
- [ ] Optimize images
- [ ] Enable caching
- [ ] Minify CSS/JS
- [ ] Compress responses

---

## 🌐 DEPLOYMENT OPTIONS

### **Option 1: Shared Hosting (cPanel)**
**Best for:** Small to medium businesses  
**Cost:** $5-20/month  
**Providers:** Hostinger, Bluehost, SiteGround

### **Option 2: VPS Hosting**
**Best for:** Growing businesses  
**Cost:** $10-50/month  
**Providers:** DigitalOcean, Linode, Vultr

### **Option 3: Cloud Hosting**
**Best for:** Scalable businesses  
**Cost:** Pay as you go  
**Providers:** AWS, Google Cloud, Azure

---

## 📦 STEP-BY-STEP DEPLOYMENT

## PART 1: BACKEND DEPLOYMENT (PHP + MySQL)

### **Step 1: Choose Hosting Provider**

**Recommended for Beginners:**
- **Hostinger** (₹149/month)
- **Bluehost** (₹199/month)
- **SiteGround** (₹299/month)

All include:
- cPanel
- MySQL database
- PHP support
- SSL certificate
- Email accounts

---

### **Step 2: Setup Domain & Hosting**

1. **Purchase Domain:**
   - Example: `rumibymanisha.com`
   - Cost: ₹500-1000/year

2. **Purchase Hosting:**
   - Choose plan with PHP 7.4+ and MySQL
   - Get cPanel access

3. **Point Domain to Hosting:**
   - Update nameservers
   - Wait 24-48 hours for propagation

---

### **Step 3: Upload Backend Files**

#### **Via cPanel File Manager:**

1. **Login to cPanel**
2. **Open File Manager**
3. **Navigate to `public_html`**
4. **Create folder:** `api`
5. **Upload backend files:**
   ```
   public_html/
   └── api/
       ├── config/
       ├── models/
       ├── api/
       └── .htaccess
   ```

#### **Via FTP (FileZilla):**

1. **Download FileZilla**
2. **Connect using:**
   - Host: `ftp.yourdomain.com`
   - Username: Your cPanel username
   - Password: Your cPanel password
3. **Upload to:** `/public_html/api/`

---

### **Step 4: Create Production Database**

1. **Login to cPanel**
2. **MySQL Databases**
3. **Create Database:**
   - Name: `youruser_rumi_boutique`
4. **Create User:**
   - Username: `youruser_rumi`
   - Password: Strong password (save it!)
5. **Add User to Database:**
   - Grant ALL PRIVILEGES
6. **Import Database:**
   - phpMyAdmin → Import
   - Upload `schema.sql`
   - Upload `default_data.sql`

---

### **Step 5: Update Backend Configuration**

**Edit:** `public_html/api/config/config.php`

```php
<?php
// Production Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'youruser_rumi_boutique');
define('DB_USER', 'youruser_rumi');
define('DB_PASS', 'YOUR_STRONG_PASSWORD');

// Production URLs
define('APP_URL', 'https://rumibymanisha.com');
define('API_URL', 'https://rumibymanisha.com/api');

// Security
define('JWT_SECRET', 'CHANGE_THIS_TO_RANDOM_STRING');

// Disable errors in production
error_reporting(0);
ini_set('display_errors', 0);

// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');
```

---

### **Step 6: Test Backend APIs**

Visit:
```
https://rumibymanisha.com/api/faqs.php
https://rumibymanisha.com/api/products.php
https://rumibymanisha.com/api/categories.php
```

Should return JSON data ✅

---

## PART 2: FRONTEND DEPLOYMENT

### **Option A: Deploy to Vercel (Recommended)**

**Advantages:**
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto deployments from Git

#### **Steps:**

1. **Create Vercel Account:**
   - Go to: https://vercel.com
   - Sign up with GitHub

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Update API URLs:**
   
   **Edit:** `src/lib/api.ts`
   ```typescript
   export const API_CONFIG = {
     BASE_URL: 'https://rumibymanisha.com/api',
     // ...
   };
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Deploy:**
   ```bash
   vercel
   ```

6. **Follow prompts:**
   - Link to Git repository
   - Configure project
   - Deploy!

7. **Custom Domain:**
   - Vercel Dashboard → Settings → Domains
   - Add: `rumibymanisha.com`
   - Update DNS records

---

### **Option B: Deploy to Netlify**

1. **Create Netlify Account:**
   - https://netlify.com

2. **Build Project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   - Drag & drop `dist` folder
   - Or connect Git repository

4. **Custom Domain:**
   - Site Settings → Domain Management
   - Add custom domain

---

### **Option C: Deploy to Same cPanel**

1. **Build Project:**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder:**
   - Via cPanel File Manager
   - To: `public_html/`

3. **Configure:**
   - Rename `dist` contents to root
   - Or use subdomain

---

## 🔐 SECURITY HARDENING

### **1. Change Admin Password**

**In phpMyAdmin:**
```sql
UPDATE users 
SET password = '$2y$10$NEW_HASH_HERE' 
WHERE email = 'admin@rumibymanisha.com';
```

**Generate hash:**
```php
<?php
echo password_hash('YOUR_NEW_PASSWORD', PASSWORD_BCRYPT);
?>
```

---

### **2. Update CORS Settings**

**Edit:** `backend/api/*.php`

```php
// Change from:
header('Access-Control-Allow-Origin: *');

// To:
header('Access-Control-Allow-Origin: https://rumibymanisha.com');
```

---

### **3. Enable HTTPS**

**In cPanel:**
1. SSL/TLS → Install SSL
2. Let's Encrypt (Free)
3. Force HTTPS redirect

**Add to `.htaccess`:**
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

### **4. Secure Database**

1. **Strong passwords**
2. **Limit remote access**
3. **Regular backups**
4. **Monitor logs**

---

## 📧 EMAIL CONFIGURATION

### **Setup Email Accounts**

**In cPanel:**
1. Email Accounts
2. Create: `support@rumibymanisha.com`
3. Create: `orders@rumibymanisha.com`
4. Create: `admin@rumibymanisha.com`

---

## 🔄 CONTINUOUS DEPLOYMENT

### **Setup Git Repository**

1. **Create GitHub Repository**
2. **Push Code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/rumi-boutique.git
   git push -u origin main
   ```

3. **Connect to Vercel/Netlify:**
   - Auto-deploy on push

---

## 📊 MONITORING & ANALYTICS

### **1. Google Analytics**

Add to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

### **2. Error Monitoring**

**Sentry.io:**
```bash
npm install @sentry/react
```

---

### **3. Uptime Monitoring**

- **UptimeRobot** (Free)
- **Pingdom**
- **StatusCake**

---

## 💳 PAYMENT GATEWAY

### **Razorpay Integration (India)**

1. **Create Account:** https://razorpay.com
2. **Get API Keys**
3. **Install SDK:**
   ```bash
   npm install razorpay
   ```

---

### **PayPal (International)**

1. **Create Business Account**
2. **Get API Credentials**
3. **Integrate SDK**

---

## 📱 SOCIAL MEDIA

### **Setup Accounts:**
- [ ] Instagram Business
- [ ] Facebook Page
- [ ] Pinterest Business
- [ ] WhatsApp Business

### **Add to Website:**
- Update links in Footer
- Add social sharing buttons
- Instagram feed integration

---

## 🎯 SEO OPTIMIZATION

### **1. Meta Tags**

Update `index.html`:
```html
<meta name="description" content="RUMI by Manisha - Premium Indian ethnic wear, sarees, lehengas, and designer outfits">
<meta name="keywords" content="sarees, lehengas, ethnic wear, indian fashion">
<meta property="og:title" content="RUMI by Manisha">
<meta property="og:description" content="Premium Indian ethnic wear">
<meta property="og:image" content="https://rumibymanisha.com/og-image.jpg">
```

---

### **2. Sitemap**

Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://rumibymanisha.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://rumibymanisha.com/shop</loc>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

### **3. Google Search Console**

1. Verify ownership
2. Submit sitemap
3. Monitor performance

---

## 🔧 PERFORMANCE OPTIMIZATION

### **1. Image Optimization**

```bash
npm install sharp
```

Compress all images before upload

---

### **2. Enable Caching**

**Add to `.htaccess`:**
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

### **3. Enable Gzip Compression**

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
</IfModule>
```

---

## 📋 POST-DEPLOYMENT CHECKLIST

### **Functionality:**
- [ ] All pages load correctly
- [ ] Products display properly
- [ ] FAQ page works
- [ ] Gallery loads
- [ ] Admin login works
- [ ] APIs respond correctly
- [ ] Forms submit successfully
- [ ] Images load fast

### **Security:**
- [ ] HTTPS enabled
- [ ] Admin password changed
- [ ] Database secured
- [ ] CORS configured
- [ ] Error logging enabled

### **SEO:**
- [ ] Meta tags added
- [ ] Sitemap submitted
- [ ] Google Analytics installed
- [ ] Social media linked

### **Performance:**
- [ ] Images optimized
- [ ] Caching enabled
- [ ] Gzip enabled
- [ ] Load time < 3 seconds

---

## 🆘 TROUBLESHOOTING

### **Issue: 500 Internal Server Error**
- Check error logs
- Verify file permissions (755 for folders, 644 for files)
- Check `.htaccess` syntax

### **Issue: Database Connection Failed**
- Verify credentials in `config.php`
- Check database exists
- Ensure user has privileges

### **Issue: CORS Errors**
- Update CORS headers
- Check domain in API responses

### **Issue: Images Not Loading**
- Check file paths
- Verify upload permissions
- Use absolute URLs

---

## 📞 SUPPORT RESOURCES

### **Hosting Support:**
- cPanel documentation
- Hosting provider support
- Community forums

### **Development:**
- React documentation
- PHP documentation
- MySQL documentation

---

## ✅ LAUNCH CHECKLIST

**Final Steps:**
1. [ ] Test all features
2. [ ] Backup database
3. [ ] Backup files
4. [ ] Monitor for 24 hours
5. [ ] Announce launch!

---

## 🎉 CONGRATULATIONS!

**Your e-commerce platform is now LIVE!** 🚀

**Next Steps:**
1. Add real products
2. Configure payment gateway
3. Start marketing
4. Monitor analytics
5. Gather customer feedback

---

**Deployment Guide Created:** January 23, 2026  
**Status:** Production Ready  
**Good Luck!** 🎊
