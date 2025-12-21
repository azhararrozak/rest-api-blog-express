# REST API Blog with Authentication

A complete REST API for a blog system with JWT authentication, role-based authorization, and SEO-friendly slug URLs.

## Features

✨ **Authentication & Authorization**

- JWT-based authentication
- Role-based access control (Admin, Moderator, User)
- Refresh token mechanism
- Password encryption with bcrypt

📝 **Blog Features**

- Post management (CRUD operations)
- Category management
- User management
- SEO-friendly slug URLs for posts and categories

🔐 **Security**

- JWT token verification
- Password hashing
- CORS enabled
- Input validation

## Framework and Libraries

- **ExpressJS** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **JSONWEBTOKEN (JWT)** - Authentication
- **DotEnv** - Environment variables
- **Bcryptjs** - Password hashing
- **uuid** - Unique identifiers
- **Slugify** - SEO-friendly URL generation
- **Nodemon** - Development server

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd rest-api-blog
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Seed the database:

```bash
npm run seed
```

5. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login
- `POST /api/auth/refreshtoken` - Refresh JWT token

### Users

- `GET /api/test/all` - Public content
- `GET /api/test/user` - User content (requires user role)
- `GET /api/test/mod` - Moderator content (requires moderator role)
- `GET /api/test/admin` - Admin content (requires admin role)

### Posts

- `POST /api/post` - Create post (requires auth)
- `GET /api/post` - Get all posts (requires auth)
- `GET /api/post/slug/:slug` - Get post by slug (requires auth)
- `GET /api/post/:id` - Get post by ID (requires auth)
- `PUT /api/post/:id` - Update post (requires auth)
- `DELETE /api/post/:id` - Delete post (requires auth)

### Categories

- `POST /api/category` - Create category (requires auth)
- `GET /api/category` - Get all categories (public)
- `GET /api/category/slug/:slug` - Get category by slug (public)
- `GET /api/category/:id` - Get category by ID (public)
- `PUT /api/category/:id` - Update category (requires auth)
- `DELETE /api/category/:id` - Delete category (requires auth)

## Slug Feature

The API includes SEO-friendly slug generation for posts and categories:

- **Auto-generation**: Slugs are automatically created from titles/names
- **Unique**: Duplicate slugs are handled with numeric suffixes
- **SEO-friendly**: Clean, readable URLs

Example slugs:

- "Getting Started with Node.js" → `getting-started-with-nodejs`
- "Technology" → `technology`

For detailed slug documentation, see [SLUG_FEATURE.md](SLUG_FEATURE.md)

## Database Schema

### User

- username, email, password
- roles (references Role model)

### Role

- name (user, admin, moderator)

### Category

- name, slug, description
- timestamps

### Post

- title, slug, content
- author (references User)
- categories (references Category)
- timestamps

### RefreshToken

- token, user, expiryDate

## Seeded Data

The seed command creates:

- **3 Roles**: user, admin, moderator
- **4 Users**:
  - admin@example.com (password: admin123)
  - moderator@example.com (password: moderator123)
  - john@example.com (password: user123)
  - jane@example.com (password: user123)
- **6 Categories**: Technology, Travel, Food, Health, Lifestyle, Business
- **8 Sample Posts** with various categories

## Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm run seed           # Seed database with initial data
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run test:slug      # Run slug generation tests only
npm run test:models    # Run model integration tests only
```

## Testing

Project ini menggunakan Jest untuk unit testing dan integration testing.

### Running Tests

**Important**: Seed database dulu sebelum menjalankan test:

```bash
npm run seed
npm test
```

### Test Suites

- **Slug Tests** (`npm run test:slug`): Verifikasi auto-generation, uniqueness, dan formatting
- **Model Tests** (`npm run test:models`): Verifikasi struktur model dan relationships

### Coverage Report

```bash
npm run test:coverage
```

Lihat detailed coverage report di `coverage/lcov-report/index.html`

Untuk dokumentasi testing lengkap, lihat [Testing README](src/__test__/README.md)

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/blog_db
PORT=3000
```

## License

ISC
