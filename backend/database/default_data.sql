-- ============================================
-- COMPLETE DEFAULT DATA INSERT QUERIES
-- RUMI BY MANISHA - E-commerce Platform
-- ============================================

USE rumi_boutique;

-- ============================================
-- 1. INSERT ADMIN USER
-- ============================================
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (email, password, first_name, last_name, phone, role, status, email_verified) VALUES
('admin@rumibymanisha.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '+91 9876543210', 'admin', 'active', TRUE),
('customer@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '+91 9876543211', 'customer', 'active', TRUE);

-- ============================================
-- 2. INSERT CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, image_url, parent_id, display_order, status) VALUES
('Sarees', 'sarees', 'Traditional and contemporary sarees in silk, cotton, and designer fabrics', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', NULL, 1, 'active'),
('Lehengas', 'lehengas', 'Bridal and festive lehengas with intricate embroidery and embellishments', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', NULL, 2, 'active'),
('Anarkalis', 'anarkalis', 'Elegant anarkali suits perfect for weddings and special occasions', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', NULL, 3, 'active'),
('Suits', 'suits', 'Designer salwar suits in various styles and fabrics', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', NULL, 4, 'active'),
('Kurtis', 'kurtis', 'Casual and formal kurtis for everyday wear', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', NULL, 5, 'active'),
('Silk Sarees', 'silk-sarees', 'Premium silk sarees', NULL, 1, 1, 'active'),
('Cotton Sarees', 'cotton-sarees', 'Comfortable cotton sarees', NULL, 1, 2, 'active'),
('Bridal Lehengas', 'bridal-lehengas', 'Exclusive bridal collection', NULL, 2, 1, 'active');

-- ============================================
-- 3. INSERT PRODUCTS
-- ============================================
INSERT INTO products (name, slug, description, short_description, category_id, price, compare_price, sku, stock_quantity, fabric, featured, new_arrival, best_seller, status, seo_title, seo_keywords) VALUES
('Banarasi Silk Saree - Red', 'banarasi-silk-saree-red', 'Exquisite handwoven Banarasi silk saree in rich red color with intricate gold zari work. Perfect for weddings and special occasions. Comes with matching blouse piece.', 'Handwoven Banarasi silk saree with gold zari work', 1, 8500.00, 12000.00, 'BSS-RED-001', 15, 'Pure Silk', TRUE, TRUE, TRUE, 'active', 'Banarasi Silk Saree Red - Handwoven Wedding Saree', 'banarasi saree, silk saree, wedding saree, red saree'),
('Designer Lehenga - Pink', 'designer-lehenga-pink', 'Stunning pink designer lehenga with heavy embroidery and sequin work. Includes lehenga, choli, and dupatta. Perfect for brides and bridesmaids.', 'Designer pink lehenga with heavy embroidery', 2, 25000.00, 35000.00, 'DL-PINK-001', 8, 'Silk & Net', TRUE, TRUE, FALSE, 'active', 'Designer Pink Lehenga - Bridal Lehenga', 'lehenga, bridal lehenga, pink lehenga, designer lehenga'),
('Anarkali Suit - Blue', 'anarkali-suit-blue', 'Elegant blue anarkali suit with beautiful embroidery on the yoke and sleeves. Comes with matching dupatta and churidar.', 'Blue anarkali suit with embroidery', 3, 4500.00, 6000.00, 'AS-BLUE-001', 20, 'Georgette', FALSE, TRUE, TRUE, 'active', 'Blue Anarkali Suit - Party Wear', 'anarkali, blue suit, party wear, ethnic wear'),
('Cotton Kurti - White', 'cotton-kurti-white', 'Comfortable white cotton kurti with block print design. Perfect for casual and office wear. Breathable fabric ideal for summer.', 'White cotton kurti with block print', 5, 1200.00, 1800.00, 'CK-WHITE-001', 50, 'Pure Cotton', FALSE, FALSE, TRUE, 'active', 'White Cotton Kurti - Casual Wear', 'kurti, cotton kurti, white kurti, casual wear'),
('Chanderi Silk Saree - Green', 'chanderi-silk-saree-green', 'Beautiful Chanderi silk saree in elegant green color with traditional motifs. Lightweight and comfortable for all-day wear.', 'Chanderi silk saree with traditional motifs', 1, 6500.00, 9000.00, 'CSS-GREEN-001', 12, 'Chanderi Silk', TRUE, FALSE, FALSE, 'active', 'Chanderi Silk Saree Green - Traditional Saree', 'chanderi saree, silk saree, green saree'),
('Palazzo Suit - Yellow', 'palazzo-suit-yellow', 'Trendy yellow palazzo suit with contemporary design. Includes kurti, palazzo, and dupatta. Perfect for festive occasions.', 'Yellow palazzo suit with contemporary design', 4, 3500.00, 5000.00, 'PS-YELLOW-001', 18, 'Rayon', FALSE, TRUE, FALSE, 'active', 'Yellow Palazzo Suit - Festive Wear', 'palazzo suit, yellow suit, festive wear'),
('Bridal Lehenga - Maroon', 'bridal-lehenga-maroon', 'Luxurious maroon bridal lehenga with heavy zardozi work and stone embellishments. Complete bridal ensemble with intricate detailing.', 'Maroon bridal lehenga with zardozi work', 2, 45000.00, 60000.00, 'BL-MAROON-001', 5, 'Velvet & Silk', TRUE, TRUE, TRUE, 'active', 'Maroon Bridal Lehenga - Wedding Lehenga', 'bridal lehenga, maroon lehenga, wedding dress'),
('Printed Kurti Set - Multi', 'printed-kurti-set-multi', 'Vibrant multi-color printed kurti set with matching pants and dupatta. Perfect for casual outings and daily wear.', 'Multi-color printed kurti set', 5, 2200.00, 3000.00, 'PKS-MULTI-001', 30, 'Cotton Blend', FALSE, FALSE, TRUE, 'active', 'Printed Kurti Set - Casual Wear', 'kurti set, printed kurti, casual wear');

-- ============================================
-- 4. INSERT PRODUCT IMAGES
-- ============================================
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'Banarasi Silk Saree Red Front View', 1, TRUE),
(1, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 'Banarasi Silk Saree Red Detail', 2, FALSE),
(2, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 'Designer Pink Lehenga Front', 1, TRUE),
(2, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'Designer Pink Lehenga Back', 2, FALSE),
(3, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'Blue Anarkali Suit', 1, TRUE),
(4, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 'White Cotton Kurti', 1, TRUE),
(5, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'Chanderi Silk Saree Green', 1, TRUE),
(6, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 'Yellow Palazzo Suit', 1, TRUE),
(7, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 'Maroon Bridal Lehenga', 1, TRUE),
(8, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 'Printed Kurti Set', 1, TRUE);

-- ============================================
-- 5. INSERT PRODUCT VARIANTS
-- ============================================
INSERT INTO product_variants (product_id, variant_name, variant_value, price_adjustment, stock_quantity, sku, status) VALUES
(1, 'Size', 'Free Size', 0, 15, 'BSS-RED-001-FS', 'active'),
(2, 'Size', 'S', 0, 3, 'DL-PINK-001-S', 'active'),
(2, 'Size', 'M', 0, 3, 'DL-PINK-001-M', 'active'),
(2, 'Size', 'L', 0, 2, 'DL-PINK-001-L', 'active'),
(3, 'Size', 'M', 0, 8, 'AS-BLUE-001-M', 'active'),
(3, 'Size', 'L', 0, 7, 'AS-BLUE-001-L', 'active'),
(3, 'Size', 'XL', 0, 5, 'AS-BLUE-001-XL', 'active'),
(4, 'Size', 'S', 0, 15, 'CK-WHITE-001-S', 'active'),
(4, 'Size', 'M', 0, 20, 'CK-WHITE-001-M', 'active'),
(4, 'Size', 'L', 0, 15, 'CK-WHITE-001-L', 'active');

-- ============================================
-- 6. INSERT COLLECTIONS
-- ============================================
INSERT INTO collections (name, slug, description, image_url, display_order, status) VALUES
('Bridal Collection', 'bridal-collection', 'Exclusive bridal wear collection featuring lehengas, sarees, and accessories', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 1, 'active'),
('Festive Favorites', 'festive-favorites', 'Perfect outfits for all festive occasions and celebrations', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 2, 'active'),
('Summer Collection', 'summer-collection', 'Light and breezy outfits perfect for summer season', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', 3, 'active'),
('Best Sellers', 'best-sellers', 'Our most popular and loved products', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800', 4, 'active');

-- ============================================
-- 7. INSERT COLLECTION PRODUCTS
-- ============================================
INSERT INTO collection_products (collection_id, product_id, display_order) VALUES
(1, 2, 1),
(1, 7, 2),
(2, 1, 1),
(2, 3, 2),
(2, 6, 3),
(3, 4, 1),
(3, 8, 2),
(4, 1, 1),
(4, 3, 2),
(4, 4, 3),
(4, 8, 4);

-- ============================================
-- 8. INSERT FAQS
-- ============================================
INSERT INTO faqs (question, answer, category, popular, display_order, status) VALUES
('How long does shipping take?', 'Domestic orders (India) typically take 5-7 business days. International shipping to Canada and USA takes 10-14 business days. Express shipping options are available at checkout for faster delivery.', 'Orders & Shipping', TRUE, 1, 'active'),
('Do you ship internationally?', 'Yes! We ship to over 50 countries including Canada, USA, UK, Australia, UAE, and more. Shipping costs and delivery times vary by location. International orders are shipped via trusted courier partners with full tracking.', 'Orders & Shipping', TRUE, 2, 'active'),
('What are the shipping charges?', 'Shipping is FREE for orders above ₹2000 in India. For orders below ₹2000, we charge ₹100. International shipping charges vary by destination and are calculated at checkout.', 'Orders & Shipping', FALSE, 3, 'active'),
('How can I track my order?', 'Once your order is shipped, you will receive a tracking number via email and SMS. You can use this number to track your order on our website or the courier partner''s website.', 'Orders & Shipping', FALSE, 4, 'active'),
('Can I change my delivery address?', 'Yes, you can change your delivery address before the order is shipped. Please contact our customer support immediately with your order number and new address details.', 'Orders & Shipping', FALSE, 5, 'active'),
('What is your return policy?', 'We offer a 14-day return policy for unworn items with original tags attached. Items must be in their original condition with all packaging. Custom or personalized items cannot be returned unless defective.', 'Returns & Exchanges', TRUE, 1, 'active'),
('How do I initiate a return?', 'To initiate a return, log in to your account, go to My Orders, select the item you wish to return, and click on Return. Our team will arrange for pickup within 2-3 business days.', 'Returns & Exchanges', FALSE, 2, 'active'),
('When will I receive my refund?', 'Refunds are processed within 7-10 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.', 'Returns & Exchanges', FALSE, 3, 'active'),
('Can I exchange an item?', 'Yes, we offer exchanges for size and color variations. Please contact our customer support within 14 days of delivery to arrange an exchange. Exchange shipping is free.', 'Returns & Exchanges', FALSE, 4, 'active'),
('What if I receive a damaged item?', 'If you receive a damaged or defective item, please contact us within 48 hours with photos. We will arrange for a replacement or full refund including shipping charges.', 'Returns & Exchanges', FALSE, 5, 'active'),
('How do I care for my silk saree?', 'We recommend dry cleaning for silk sarees. Store them in muslin cloth in a cool, dry place away from direct sunlight. Air them out periodically to maintain freshness. Avoid using mothballs directly on the fabric.', 'Products & Care', TRUE, 1, 'active'),
('Are your products authentic handloom?', 'Yes, all our sarees and ethnic wear are handcrafted by skilled artisans using traditional techniques passed down through generations. Each piece comes with a certificate of authenticity and supports local artisan communities.', 'Products & Care', TRUE, 2, 'active'),
('What fabrics do you use?', 'We use premium quality fabrics including pure silk, cotton, georgette, chiffon, velvet, and blended materials. Each product description mentions the specific fabric composition.', 'Products & Care', FALSE, 3, 'active'),
('How do I choose the right size?', 'Please refer to our detailed size chart available on each product page. For custom measurements, you can contact our customer support. We also offer stitching services for select products.', 'Products & Care', FALSE, 4, 'active'),
('Can I customize my order?', 'Yes, we offer customization services for select products. You can choose custom colors, embroidery, and sizes. Please contact our customer support for customization requests and pricing.', 'Products & Care', FALSE, 5, 'active'),
('How do I create an account?', 'Click on the Sign Up button at the top of the page, enter your email and create a password. You can also sign up using your Google or Facebook account for faster checkout.', 'Account & Pricing', FALSE, 1, 'active'),
('Do you offer discounts?', 'Yes, we regularly offer seasonal discounts, festive sales, and exclusive offers for newsletter subscribers. Follow us on social media and subscribe to our newsletter for latest deals.', 'Account & Pricing', TRUE, 2, 'active'),
('What payment methods do you accept?', 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. We also offer Cash on Delivery (COD) for orders within India. International customers can pay via PayPal.', 'Account & Pricing', FALSE, 3, 'active'),
('Is there a loyalty program?', 'Yes! Join our RUMI Rewards program and earn points on every purchase. Points can be redeemed for discounts on future orders. Members also get early access to sales and exclusive offers.', 'Account & Pricing', FALSE, 4, 'active'),
('How do I use a discount code?', 'Enter your discount code at checkout in the "Promo Code" field and click Apply. The discount will be reflected in your order total. Only one discount code can be used per order.', 'Account & Pricing', FALSE, 5, 'active');

-- ============================================
-- 9. INSERT GALLERY ITEMS
-- ============================================
INSERT INTO gallery (url, title, category, type, thumbnail, instagram_url, status, display_order) VALUES
('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200', 'Bridal Elegance', 'Sarees', 'image', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', NULL, 'active', 1),
('https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200', 'Festive Glamour', 'Lehengas', 'image', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', NULL, 'active', 2),
('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200', 'Traditional Beauty', 'Anarkalis', 'image', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', NULL, 'active', 3),
('https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200', 'Summer Vibes', 'Kurtis', 'image', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', NULL, 'active', 4),
('https://www.instagram.com/p/example1/', 'Latest Collection', 'Sarees', 'instagram-post', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', 'https://www.instagram.com/p/example1/', 'active', 5),
('https://www.instagram.com/reel/example1/', 'Behind the Scenes', 'Lehengas', 'instagram-reel', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', 'https://www.instagram.com/reel/example1/', 'active', 6),
('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200', 'Designer Collection', 'Suits', 'image', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', NULL, 'active', 7),
('https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200', 'Ethnic Charm', 'Sarees', 'image', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', NULL, 'active', 8);

-- ============================================
-- 10. INSERT REVIEWS
-- ============================================
INSERT INTO reviews (product_id, user_id, author_name, author_email, rating, title, comment, verified_purchase, status, helpful_count) VALUES
(1, 2, 'Priya Sharma', 'priya@example.com', 5, 'Absolutely Beautiful!', 'The Banarasi saree is stunning! The quality is excellent and the zari work is intricate. Perfect for my wedding. Highly recommended!', TRUE, 'approved', 12),
(1, NULL, 'Anjali Patel', 'anjali@example.com', 5, 'Worth every penny', 'Gorgeous saree with beautiful drape. The color is exactly as shown. Very happy with my purchase.', FALSE, 'approved', 8),
(2, 2, 'Neha Gupta', 'neha@example.com', 4, 'Beautiful Lehenga', 'The lehenga is beautiful but sizing runs a bit small. Overall great quality and design.', TRUE, 'approved', 5),
(3, NULL, 'Ritu Singh', 'ritu@example.com', 5, 'Perfect for parties', 'Love this anarkali! The fit is perfect and the embroidery is beautiful. Got so many compliments!', FALSE, 'approved', 10),
(4, 2, 'Meera Reddy', 'meera@example.com', 5, 'Comfortable and stylish', 'Great cotton kurti for daily wear. Comfortable fabric and nice print. Will buy more colors!', TRUE, 'approved', 15),
(4, NULL, 'Kavita Joshi', 'kavita@example.com', 4, 'Good quality', 'Nice kurti but color is slightly different from the picture. Still satisfied with the purchase.', FALSE, 'approved', 3),
(7, NULL, 'Divya Mehta', 'divya@example.com', 5, 'Dream Bridal Lehenga', 'This is my dream lehenga! The work is exquisite and it fits perfectly. Thank you RUMI!', FALSE, 'pending', 0),
(8, 2, 'Sneha Kumar', 'sneha@example.com', 4, 'Nice kurti set', 'Good quality and vibrant colors. Comfortable for daily wear. Value for money.', TRUE, 'approved', 6);

-- ============================================
-- 11. INSERT INQUIRIES
-- ============================================
INSERT INTO inquiries (name, email, phone, subject, message, inquiry_type, status, priority, assigned_to) VALUES
('Rahul Verma', 'rahul@example.com', '+91 9876543212', 'Custom Lehenga Order', 'I would like to order a custom lehenga for my sister''s wedding. Can you help with measurements and design?', 'custom', 'new', 'high', NULL),
('Pooja Desai', 'pooja@example.com', '+91 9876543213', 'Bulk Order Inquiry', 'I am interested in placing a bulk order for my boutique. Please share wholesale pricing details.', 'wholesale', 'new', 'medium', NULL),
('Amit Shah', 'amit@example.com', '+91 9876543214', 'Order Status', 'My order #ORD-001 has not been delivered yet. Can you please check the status?', 'order', 'in_progress', 'urgent', 1),
('Sunita Rao', 'sunita@example.com', '+91 9876543215', 'Product Question', 'Is the Banarasi saree available in other colors? Also, do you provide stitching services?', 'product', 'resolved', 'low', 1),
('Vikram Malhotra', 'vikram@example.com', '+91 9876543216', 'Return Request', 'I received the wrong size. How can I exchange it for the correct size?', 'order', 'closed', 'medium', 1);

-- ============================================
-- 12. INSERT NEWSLETTER SUBSCRIBERS
-- ============================================
INSERT INTO newsletter_subscribers (email, name, status) VALUES
('subscriber1@example.com', 'Lakshmi Iyer', 'active'),
('subscriber2@example.com', 'Geeta Nair', 'active'),
('subscriber3@example.com', 'Radha Krishnan', 'active'),
('subscriber4@example.com', 'Sita Devi', 'active'),
('subscriber5@example.com', 'Kamala Suresh', 'active');

-- ============================================
-- 13. INSERT COUPONS
-- ============================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase, max_discount, usage_limit, usage_count, valid_from, valid_until, status) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10.00, 1000.00, 500.00, 100, 25, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), 'active'),
('FESTIVE20', 'Festive season special discount', 'percentage', 20.00, 2000.00, 1000.00, 200, 50, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), 'active'),
('FLAT500', 'Flat ₹500 off on orders above ₹5000', 'fixed', 500.00, 5000.00, NULL, 50, 10, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'active'),
('SUMMER15', 'Summer collection discount', 'percentage', 15.00, 1500.00, 750.00, 150, 30, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY), 'active');

-- ============================================
-- 14. INSERT SETTINGS
-- ============================================
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'RUMI by Manisha', 'string', 'Website name'),
('site_email', 'support@rumibymanisha.com', 'string', 'Contact email'),
('site_phone', '+91 9876543210', 'string', 'Contact phone'),
('currency', 'INR', 'string', 'Default currency'),
('tax_rate', '18', 'number', 'Tax rate percentage'),
('shipping_cost', '100', 'number', 'Default shipping cost'),
('free_shipping_threshold', '2000', 'number', 'Free shipping above this amount'),
('instagram_url', 'https://instagram.com/rumibymanisha', 'string', 'Instagram profile URL'),
('facebook_url', 'https://facebook.com/rumibymanisha', 'string', 'Facebook page URL'),
('whatsapp_number', '+919876543210', 'string', 'WhatsApp contact number');

-- ============================================
-- 15. INSERT WISHLIST (Sample)
-- ============================================
INSERT INTO wishlist (user_id, product_id) VALUES
(2, 1),
(2, 2),
(2, 7);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check total records in each table
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Product Images', COUNT(*) FROM product_images
UNION ALL
SELECT 'Product Variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'Collections', COUNT(*) FROM collections
UNION ALL
SELECT 'Collection Products', COUNT(*) FROM collection_products
UNION ALL
SELECT 'FAQs', COUNT(*) FROM faqs
UNION ALL
SELECT 'Gallery', COUNT(*) FROM gallery
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Inquiries', COUNT(*) FROM inquiries
UNION ALL
SELECT 'Newsletter Subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'Coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'Settings', COUNT(*) FROM settings
UNION ALL
SELECT 'Wishlist', COUNT(*) FROM wishlist;

-- ============================================
-- END OF DEFAULT DATA INSERT
-- ============================================
