-- Foydalanuvchilar uchun (kelajakda authentication uchun)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profil ma'lumotlari uchun
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ko'nikmalar jadvali
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    level INTEGER CHECK (level >= 0 AND level <= 100),
    category VARCHAR(100),
    description TEXT,
    experience VARCHAR(100),
    projects_count INTEGER DEFAULT 0,
    color VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio loyihalari jadvali
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

-- Blog postlari jadvali
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    excerpt TEXT,
    image TEXT,
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Ichki loyihalarni boshqarish jadvali
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planned',
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

-- Sozlamalar jadvali
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'uz',
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    privacy_profile_visibility VARCHAR(50) DEFAULT 'public',
    display_posts_per_page INTEGER DEFAULT 10 CHECK (display_posts_per_page > 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kontakt formadan kelgan xabarlar uchun
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

-- Mijozlar fikrlari (Testimonials)
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    text TEXT NOT NULL,
    avatar TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DASTLABKI MA'LUMOTLARNI KIRITISH

-- 1. Admin foydalanuvchisini yaratish
-- Parol: "adminpassword". Kelajakda xavfsizroq hash bilan almashtiring.
INSERT INTO users (id, email, password_hash, name, role)
VALUES (1, 'admin@example.com', '$2b$10$f.wZ5sD.d/a.s9d8F7g6H5e4R3T2Y1U0o.i.p.a.s.s.w.o.r.d', 'Admin User', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 2. Admin profili ma'lumotlarini yaratish
INSERT INTO profiles (user_id, name, email, phone, avatar, bio, profession, location, website, birth_date, experience, education, social_github, social_linkedin, social_telegram, social_instagram)
VALUES (
    1,
    'Zafar Ibragimov',
    'ibragimovzafar001@gmail.com',
    '+998 88 000 14 29',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
    'Full Stack Developer va Web Dizayner. React, Next.js va Node.js bilan ishlashni yaxshi ko''raman.',
    'Full Stack Developer',
    'Toshkent, O''zbekiston',
    'https://zafaribragimov.dev',
    '2004-11-27',
    '2+ years',
    'Computer Science',
    'https://github.com/zafaribragimov',
    'https://linkedin.com/in/zafaribragimov',
    'https://t.me/zafaribragimov',
    'https://instagram.com/zafaribragimov'
) ON CONFLICT (user_id) DO NOTHING;

-- 3. Admin uchun standart sozlamalarni yaratish
INSERT INTO settings (user_id, theme, language, notifications_email, notifications_push, privacy_profile_visibility, display_posts_per_page)
VALUES (1, 'light', 'uz', true, true, 'public', 10)
ON CONFLICT (user_id) DO NOTHING;

-- Jadvallar uchun ID ketma-ketligini yangilash
-- Yuqoridagi INSERTlarda ID qo'lda kiritilgani uchun, keyingi avtomatik IDlar to'g'ri ishlashi uchun buni ishga tushirish muhim
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('profiles_id_seq', (SELECT MAX(id) FROM profiles));
SELECT setval('settings_id_seq', (SELECT MAX(id) FROM settings));