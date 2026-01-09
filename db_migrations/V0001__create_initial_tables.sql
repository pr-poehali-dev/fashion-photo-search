-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица истории поиска
CREATE TABLE IF NOT EXISTS search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    image_url TEXT NOT NULL,
    clothing_type VARCHAR(100),
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица истории примерок
CREATE TABLE IF NOT EXISTS tryon_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    person_image_url TEXT NOT NULL,
    clothes_image_url TEXT NOT NULL,
    result_image_url TEXT,
    status VARCHAR(50) DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица товаров (для результатов поиска)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'RUB',
    image_url TEXT,
    product_url TEXT,
    match_score DECIMAL(5, 2),
    search_id INTEGER REFERENCES search_history(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_search_user ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tryon_user ON tryon_history(user_id);
CREATE INDEX IF NOT EXISTS idx_products_search ON products(search_id);