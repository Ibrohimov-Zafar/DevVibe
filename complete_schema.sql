-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS experience_timeline CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS portfolio_items CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Foydalanuvchilar jadvali (Authentication uchun)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profil ma'lumotlari jadvali
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    avatar TEXT,
    bio TEXT,
    profession VARCHAR(255),
    location VARCHAR(255),
    website TEXT,
    birth_date DATE,
    experience VARCHAR(50),
    education VARCHAR(255),
    social_github TEXT,
    social_linkedin TEXT,
    social_telegram TEXT,
    social_instagram TEXT,
    social_twitter TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Ko'nikmalar jadvali
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    level INTEGER CHECK (level >= 0 AND level <= 100) DEFAULT 50,
    category VARCHAR(100) DEFAULT 'Frontend',
    description TEXT,
    experience VARCHAR(100),
    projects_count INTEGER DEFAULT 0,
    color VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Portfolio loyihalari jadvali
CREATE TABLE portfolio_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    technologies TEXT[],
    website_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Blog postlari jadvali
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT,
    excerpt TEXT,
    image TEXT,
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    author VARCHAR(255) DEFAULT 'Zafar Ibragimov',
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- 6. Ichki loyihalarni boshqarish jadvali
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning',
    priority VARCHAR(50) DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    budget NUMERIC(10, 2),
    client VARCHAR(255),
    technologies TEXT[],
    team_members INTEGER[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Sozlamalar jadvali
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'auto',
    language VARCHAR(10) DEFAULT 'uz',
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    privacy_profile_visibility VARCHAR(50) DEFAULT 'public',
    security_session_timeout INTEGER DEFAULT 30,
    display_posts_per_page INTEGER DEFAULT 10 CHECK (display_posts_per_page > 0),
    display_animations BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Kontakt formadan kelgan xabarlar jadvali
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    service VARCHAR(100),
    budget VARCHAR(100),
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Mijozlar fikrlari (Testimonials)
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    text TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tajriba yo'li jadvali
CREATE TABLE experience_timeline (
    id SERIAL PRIMARY KEY,
    year VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT '🚀',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DASTLABKI MA'LUMOTLARNI KIRITISH
-- ============================================

-- 1. Admin foydalanuvchisini yaratish
-- Parol: "zafar27112004" (bcrypt hash)
INSERT INTO users (id, email, password_hash, name, role) VALUES 
(1, 'ibragimovzafar001@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Zafar Ibragimov', 'admin');

-- 2. Admin profili ma'lumotlarini yaratish
INSERT INTO profiles (user_id, name, email, phone, avatar, bio, profession, location, website, birth_date, experience, education, social_github, social_linkedin, social_telegram, social_instagram) VALUES 
(1, 'Zafar Ibragimov', 'ibragimovzafar001@gmail.com', '+998 88 000 14 29', '/zafar.jpg', 
 'Full Stack Developer va Web Dizayner. React, Next.js va Node.js bilan professional yechimlar yarataman. 2+ yillik tajriba bilan mijozlarning raqamli muvaffaqiyatiga yordam beraman.',
 'Full Stack Developer', 'Toshkent, O''zbekiston', 'https://zafaribragimov.dev', '2004-11-27', '2+ yil', 
 'Computer Science, Toshkent Axborot Texnologiyalari Universiteti', 
 'https://github.com/zafaribragimov', 'https://linkedin.com/in/zafaribragimov', 
 'https://t.me/Ibragimov_Zafar', 'https://instagram.com/zafaribragimov');

-- 3. Admin uchun standart sozlamalarni yaratish
INSERT INTO settings (user_id, theme, language, notifications_email, notifications_push, privacy_profile_visibility, security_session_timeout, display_posts_per_page, display_animations) VALUES 
(1, 'auto', 'uz', TRUE, TRUE, 'public', 30, 10, TRUE);

-- 4. Ko'nikmalar qo'shish
INSERT INTO skills (name, icon, level, category, description, experience, projects_count, color, featured) VALUES 
('React', '⚛️', 95, 'Frontend', 'Zamonaviy React hooks va context API bilan murakkab UI komponentlar yaratish', '2+ years', 15, 'from-blue-400 to-blue-600', TRUE),
('Next.js', '🔄', 92, 'Frontend', 'Server-side rendering va static site generation bilan performant web aplikatsiyalar', '1.5+ years', 12, 'from-gray-700 to-gray-900', TRUE),
('Node.js', '🟢', 88, 'Backend', 'Express.js framework bilan RESTful API va real-time aplikatsiyalar yaratish', '2+ years', 10, 'from-green-400 to-green-600', TRUE),
('JavaScript', '🟨', 96, 'Frontend', 'ES6+ xususiyatlari bilan modern JavaScript development', '3+ years', 20, 'from-yellow-400 to-yellow-600', TRUE),
('TypeScript', '🔷', 85, 'Frontend', 'Type-safe kod yozish va katta loyihalarda xatoliklarni kamaytirish', '1+ years', 8, 'from-blue-500 to-blue-700', FALSE),
('Python', '🐍', 82, 'Backend', 'Django va FastAPI bilan backend development va data analysis', '1.5+ years', 6, 'from-green-500 to-blue-500', FALSE),
('MongoDB', '🍃', 87, 'Database', 'NoSQL database dizayni va aggregation pipeline', '2+ years', 12, 'from-green-400 to-green-700', TRUE),
('PostgreSQL', '🐘', 83, 'Database', 'Relational database design va complex queries', '1+ years', 8, 'from-blue-600 to-indigo-600', FALSE),
('Tailwind CSS', '🎨', 94, 'Frontend', 'Utility-first CSS framework bilan responsive dizayn', '2+ years', 18, 'from-cyan-400 to-cyan-600', TRUE),
('Git', '📂', 89, 'DevOps', 'Version control va team collaboration', '2+ years', 25, 'from-orange-400 to-orange-600', FALSE);

-- 5. Portfolio loyihalarini qo'shish
INSERT INTO portfolio_items (title, description, image, technologies, website_url, github_url, featured) VALUES 
('E-commerce Platform', 'Zamonaviy onlayn do''kon Next.js va Stripe to''lov tizimi bilan. Admin panel, inventar boshqaruvi va real-time analytics.', 
 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600', 
 ARRAY['Next.js', 'React', 'Stripe', 'PostgreSQL', 'Tailwind CSS'], 
 'https://ecommerce-demo.vercel.app', 'https://github.com/zafaribragimov/ecommerce', TRUE),

('Blog Management System', 'CMS bilan to''liq blog platformasi. Markdown editor, SEO optimization va comment system.', 
 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600', 
 ARRAY['React', 'Node.js', 'MongoDB', 'Express'], 
 'https://blog-cms-demo.vercel.app', 'https://github.com/zafaribragimov/blog-cms', TRUE),

('Real Estate Platform', 'Uy-joy sotish platformasi geolocation, virtual tour va mortgage calculator bilan.', 
 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600', 
 ARRAY['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'], 
 'https://realestate-demo.vercel.app', 'https://github.com/zafaribragimov/realestate', FALSE),

('Restaurant Management', 'Restoran uchun buyurtma boshqaruvi, menu management va delivery tracking.', 
 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', 
 ARRAY['React', 'Firebase', 'Material-UI', 'PWA'], 
 'https://restaurant-demo.vercel.app', 'https://github.com/zafaribragimov/restaurant', FALSE);

-- 6. Blog postlarini qo'shish
INSERT INTO posts (title, slug, content, excerpt, image, category, tags, status, featured, author_id, published_at) VALUES 
('Next.js 13 bilan Modern Web Development', 'nextjs-13-modern-web-development', 
 'Next.js 13 ning yangi xususiyatlari va app directory structure haqida batafsil qo''llanma. Server Components, Streaming va yangi routing tizimi.',
 'Next.js 13 ning eng muhim yangiliklari va ulardan qanday foydalanish haqida.',
 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600',
 'Web Development', ARRAY['Next.js', 'React', 'JavaScript'], 'published', TRUE, 1, NOW()),

('TypeScript bilan React Development', 'typescript-react-development',
 'TypeScript va React birgalikda ishlatish bo''yicha to''liq qo''llanma. Type safety, interface va generic types.',
 'React loyihalarida TypeScript ishlatishning afzalliklari va best practices.',
 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600',
 'Programming', ARRAY['TypeScript', 'React', 'Frontend'], 'published', FALSE, 1, NOW()),

('Database Design Best Practices', 'database-design-best-practices',
 'PostgreSQL va MongoDB bilan efficient database design principles. Indexing, relationships va performance optimization.',
 'Ma''lumotlar bazasi dizayni uchun eng yaxshi amaliyotlar va performance optimization.',
 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600',
 'Database', ARRAY['PostgreSQL', 'MongoDB', 'Database'], 'published', FALSE, 1, NOW());

-- 7. Tajriba yo'lini qo'shish
INSERT INTO experience_timeline (year, title, description, icon) VALUES 
('2024', 'Senior Full Stack Developer', 'Murakkab web aplikatsiyalar yaratish va team leadership. Microservices architecture va cloud deployment.', '🚀'),
('2023', 'Full Stack Developer', 'E-commerce va CMS loyihalarida ishlash. React, Node.js va database optimization.', '💻'),
('2022', 'Frontend Developer', 'React va Next.js bilan modern web interfaces yaratish. UI/UX design principles.', '🎨'),
('2021', 'Junior Developer', 'Dasturlash asoslarini o''rganish va birinchi commercial loyihalar.', '📚');

-- 8. Mijozlar fikrini qo'shish
INSERT INTO testimonials (name, position, text, avatar, rating, approved) VALUES 
('Aziz Karimov', 'CEO, TechStart', 'Zafar bilan ishlash juda yoqimli edi. Loyihani vaqtida va sifatli tayyorladi. Professional yondashuv va creative yechimlar.', 
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300', 5, TRUE),

('Malika Nurmatova', 'Marketing Director, Digital Agency', 'Bizning yangi websitemiz Zafarning ishidan juda mamnunmiz. Zamonaviy dizayn va tez yuklanish.', 
 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300', 5, TRUE),

('Bobur Ismoilov', 'Entrepreneur', 'E-commerce platformamiz Zafar tomonidan yaratildi. Foydalanish oson va barcha funksiyalar mavjud.', 
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300', 4, TRUE);

-- 9. Loyihalar qo'shish (ichki boshqaruv uchun)
INSERT INTO projects (name, description, status, priority, start_date, end_date, progress, budget, client, technologies, team_members) VALUES 
('Portfolio Website Redesign', 'Shaxsiy portfolio websiteni yangilash va yangi funksiyalar qo''shish', 'in-progress', 'high', '2025-01-01', '2025-01-31', 75, 1500.00, 'Personal', ARRAY['Next.js', 'Tailwind CSS', 'PostgreSQL'], ARRAY[1]),

('E-learning Platform', 'Onlayn ta''lim platformasi video kurslar va quiz tizimi bilan', 'planning', 'medium', '2025-02-01', '2025-04-30', 0, 5000.00, 'EduTech Solutions', ARRAY['React', 'Node.js', 'MongoDB', 'WebRTC'], ARRAY[1]),

('Mobile App Backend', 'Mobil ilovalar uchun RESTful API va real-time chat', 'completed', 'high', '2024-10-01', '2024-12-31', 100, 3000.00, 'StartUp Inc', ARRAY['Node.js', 'Socket.io', 'PostgreSQL', 'Redis'], ARRAY[1]);

-- ID sequence larni yangilash
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('profiles_id_seq', (SELECT MAX(id) FROM profiles));
SELECT setval('settings_id_seq', (SELECT MAX(id) FROM settings));
SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));
SELECT setval('portfolio_items_id_seq', (SELECT MAX(id) FROM portfolio_items));
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));
SELECT setval('experience_timeline_id_seq', (SELECT MAX(id) FROM experience_timeline));
SELECT setval('testimonials_id_seq', (SELECT MAX(id) FROM testimonials));
SELECT setval('projects_id_seq', (SELECT MAX(id) FROM projects));

-- Indexlar qo'shish (performance uchun)
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_portfolio_featured ON portfolio_items(featured);
CREATE INDEX idx_skills_featured ON skills(featured);
CREATE INDEX idx_testimonials_approved ON testimonials(approved);
CREATE INDEX idx_contacts_status ON contacts(status);

-- Views yaratish (tez-tez ishlatiladigan queries uchun)
CREATE VIEW published_posts AS 
SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC;

CREATE VIEW featured_portfolio AS 
SELECT * FROM portfolio_items WHERE featured = TRUE ORDER BY created_at DESC;

CREATE VIEW approved_testimonials AS 
SELECT * FROM testimonials WHERE approved = TRUE ORDER BY created_at DESC;

-- Ma'lumotlar to'g'riligini tekshirish uchun function
CREATE OR REPLACE FUNCTION validate_email(email TEXT) RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$';
END;
$$ LANGUAGE plpgsql;

-- Trigger funksiya: post slug avtomatik yaratish
CREATE OR REPLACE FUNCTION generate_slug() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := LOWER(TRIM(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g')));
        NEW.slug := REGEXP_REPLACE(NEW.slug, '\s+', '-', 'g');
        NEW.slug := TRIM(NEW.slug, '-');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger yaratish
CREATE TRIGGER posts_generate_slug_trigger
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION generate_slug();

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Database schema successfully created with sample data!';
    RAISE NOTICE 'Admin user: ibragimovzafar001@gmail.com';
    RAISE NOTICE 'Password: zafar27112004';
END $$;
