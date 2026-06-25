# 🚀 Quick Installation Guide
## RUMI by Manisha - E-commerce Platform

Complete setup in **5 minutes**!

---

## ✅ Step 1: Install Prerequisites

### **Download & Install:**
1. **XAMPP** (includes Apache, MySQL, PHP)
   - Download: https://www.apachefriends.org/
   - Install to default location
   - Start Apache and MySQL

2. **Node.js** (includes npm)
   - Download: https://nodejs.org/
   - Install LTS version
   - Verify: `node --version` and `npm --version`

---

## ✅ Step 2: Setup Database

### **Create Database:**
1. Open **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Click **"New"** in left sidebar
3. Database name: `rumi_boutique`
4. Collation: `utf8mb4_unicode_ci`
5. Click **"Create"**

### **Import Schema:**
1. Select `rumi_boutique` database
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Select: `backend/database/schema.sql`
5. Click **"Go"** at bottom
6. Wait for success message ✅

### **Verify Tables:**
- Check that 19 tables were created
- Should see: users, products, categories, faqs, gallery, reviews, inquiries, etc.

---

## ✅ Step 3: Setup Backend

### **Copy Backend Files:**
1. Open XAMPP installation folder
2. Navigate to `htdocs` folder
3. Copy entire `backend` folder from project
4. Paste into `htdocs`
5. Rename folder to `rumi-backend`

**Path should be:** `C:\xampp\htdocs\rumi-backend\`

### **Configure Database Connection:**
1. Open: `C:\xampp\htdocs\rumi-backend\config\config.php`
2. Update if needed (default works for XAMPP):
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'rumi_boutique');
define('DB_USER', 'root');
define('DB_PASS', '');  // Leave empty for XAMPP
```
3. Save file

### **Test Backend:**
Open in browser:
```
http://localhost/rumi-backend/api/faqs.php
```

**Expected:** JSON response with FAQ data ✅

---

## ✅ Step 4: Setup Frontend

### **Install Dependencies:**
1. Open **Command Prompt** or **PowerShell**
2. Navigate to project folder:
```bash
cd C:\Users\Admin\Desktop\chic-boutique-hub-main
```

3. Install packages:
```bash
npm install
```

**Wait for installation to complete** (2-3 minutes)

### **Start Development Server:**
```bash
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ✅ Step 5: Access Application

### **Open in Browser:**
```
http://localhost:5173
```

### **Test Features:**
1. ✅ Browse home page
2. ✅ View products in Shop
3. ✅ Check FAQ page
4. ✅ View Gallery
5. ✅ Access Admin Dashboard: `http://localhost:5173/admin/login`

### **Admin Login:**
- **Email:** `admin@rumibymanisha.com`
- **Password:** `admin123`

---

## ✅ Verification Checklist

### **Backend:**
- [ ] XAMPP Apache running (green in control panel)
- [ ] XAMPP MySQL running (green in control panel)
- [ ] Database `rumi_boutique` created
- [ ] 19 tables imported successfully
- [ ] Backend folder in `htdocs/rumi-backend`
- [ ] API test successful: `http://localhost/rumi-backend/api/faqs.php`

### **Frontend:**
- [ ] Node.js installed
- [ ] npm packages installed (`node_modules` folder exists)
- [ ] Dev server running (`npm run dev`)
- [ ] Application opens: `http://localhost:5173`
- [ ] Pages load correctly
- [ ] Admin login works

---

## 🔧 Troubleshooting

### **Problem: Database connection error**
**Solution:**
- Check XAMPP MySQL is running
- Verify database name is `rumi_boutique`
- Check `config.php` credentials

### **Problem: API returns 404**
**Solution:**
- Verify backend folder is in `htdocs/rumi-backend`
- Check Apache is running in XAMPP
- Try: `http://localhost/rumi-backend/api/faqs.php`

### **Problem: Frontend won't start**
**Solution:**
- Delete `node_modules` folder
- Run `npm install` again
- Try `npm run dev`

### **Problem: Port 5173 already in use**
**Solution:**
- Close other Vite/React apps
- Or change port in `vite.config.ts`

### **Problem: XAMPP ports 80/443 in use**
**Solution:**
- Stop IIS or other web servers
- Or change Apache ports in XAMPP config

---

## 📝 Quick Commands Reference

### **Frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Backend:**
```bash
# No commands needed - just ensure XAMPP is running
```

### **Database:**
```sql
-- Create database
CREATE DATABASE rumi_boutique;

-- Select database
USE rumi_boutique;

-- Show tables
SHOW TABLES;

-- Count records
SELECT COUNT(*) FROM faqs;
```

---

## 🎯 Next Steps

After successful installation:

1. ✅ **Explore Admin Dashboard**
   - Add products
   - Manage FAQs
   - Upload gallery items
   - Review inquiries

2. ✅ **Customize Content**
   - Update product data
   - Add your images
   - Customize FAQs
   - Update settings

3. ✅ **Test All Features**
   - Product browsing
   - Search functionality
   - Reviews system
   - Contact forms

4. ✅ **Prepare for Production**
   - Change admin password
   - Update API URLs
   - Configure SSL
   - Deploy to hosting

---

## 📚 Documentation

For detailed information, see:
- `README.md` - Project overview
- `BACKEND_SETUP_GUIDE.md` - Backend details
- `API_DOCUMENTATION.md` - API reference
- `BACKEND_ALL_APIS_COMPLETE.md` - All APIs summary

---

## 🎉 Success!

If all steps completed successfully, you now have:

✅ **Working database** with 19 tables  
✅ **6 functional APIs** ready to use  
✅ **Frontend application** running  
✅ **Admin dashboard** accessible  
✅ **Complete e-commerce platform** ready!

**Start building amazing features!** 🚀

---

## 💡 Tips

- Keep XAMPP running while developing
- Use `Ctrl+C` in terminal to stop dev server
- Check browser console for errors
- Use phpMyAdmin to view database
- Test APIs with Postman or browser

---

## 🆘 Need Help?

If you encounter issues:
1. Check error messages carefully
2. Verify all prerequisites installed
3. Ensure XAMPP services running
4. Review configuration files
5. Check documentation files

---

**Installation Time:** ~5 minutes  
**Difficulty:** Easy  
**Status:** Ready to Go! ✅
