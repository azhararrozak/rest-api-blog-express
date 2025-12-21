# Testing Documentation

## Overview

Project ini menggunakan Jest untuk unit testing dan integration testing.

## Prerequisites

⚠️ **Sebelum menjalankan test**, pastikan database sudah di-seed:

```bash
npm run seed
```

Test membutuhkan data yang sudah ada di database untuk memverifikasi fitur slug generation dan model relationships.

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

### Run Specific Test Suites

#### Slug Generation Tests

```bash
npm run test:slug
```

Tests untuk memverifikasi:

- Slug auto-generation dari title/name
- Unique slug generation
- Lowercase conversion
- Space to dash replacement
- Duplicate handling dengan numeric suffix
- Slug update saat title/name berubah

#### Model Integration Tests

```bash
npm run test:models
```

Tests untuk memverifikasi:

- Model structure dan required fields
- Population of references (author, categories, roles)
- Database relationships
- Data integrity

## Test Structure

```
src/__test__/
├── slug.test.js      # Slug generation tests
└── models.test.js    # Model integration tests
```

## Test Configuration

Jest configuration ada di `jest.config.js`:

- Test environment: Node.js
- Test pattern: `**/*.test.js` dan `**/*.spec.js`
- Coverage directory: `coverage/`
- Timeout: 30 seconds (untuk database operations)

## Writing New Tests

### Basic Test Structure

```javascript
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

describe("Feature Name", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("should do something", async () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## Test Database

⚠️ **Important**: Tests akan menggunakan database yang sama dengan development environment (dari `MONGODB_URI` di `.env`).

Untuk production, sebaiknya gunakan separate test database:

```env
# .env.test
MONGODB_URI=mongodb://localhost:27017/blog_test_db
PORT=3001
```

## Coverage Report

Setelah menjalankan `npm run test:coverage`, laporan coverage akan tersedia di:

- Terminal output
- HTML report: `coverage/lcov-report/index.html`

Coverage includes:

- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

## Best Practices

1. **Isolate Tests**: Setiap test harus independent
2. **Cleanup**: Hapus test data setelah test selesai
3. **Use Descriptive Names**: Test names harus jelas dan deskriptif
4. **Test Edge Cases**: Test untuk normal cases dan edge cases
5. **Mock External Services**: Mock API calls, emails, dll.
6. **Keep Tests Fast**: Optimize database queries dan operations

## Common Test Patterns

### Testing Slug Generation

```javascript
test("should generate slug from title", async () => {
  const post = new Post({ title: "Hello World", content: "test" });
  await post.save();

  expect(post.slug).toBe("hello-world");

  await Post.deleteOne({ _id: post._id });
});
```

### Testing Database Relationships

```javascript
test("should populate author", async () => {
  const post = await Post.findOne().populate("author");

  expect(post.author.username).toBeDefined();
});
```

### Testing Validation

```javascript
test("should fail without required fields", async () => {
  const post = new Post({});

  await expect(post.save()).rejects.toThrow();
});
```

## Debugging Tests

### Run Single Test File

```bash
npm test src/__test__/slug.test.js
```

### Run Single Test Case

```bash
npm test -- -t "should generate slug from title"
```

### Verbose Output

```bash
npm test -- --verbose
```

## CI/CD Integration

Untuk continuous integration, tambahkan di CI pipeline:

```yaml
# Example: GitHub Actions
- name: Run tests
  run: npm test

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Troubleshooting

### "Cannot use import statement outside a module"

- Pastikan `"type": "module"` ada di `package.json`
- Jest configuration menggunakan ESM support

### "Timeout of 5000ms exceeded"

- Increase timeout di `jest.config.js`
- Atau tambahkan timeout per test: `test('...', async () => {...}, 10000)`

### "Database connection failed"

- Check `.env` file
- Pastikan MongoDB running
- Verify MONGODB_URI correct

## Future Improvements

- [ ] Add API endpoint tests (supertest)
- [ ] Add authentication tests
- [ ] Add authorization tests
- [ ] Setup separate test database
- [ ] Add performance tests
- [ ] Add E2E tests
- [ ] Integrate with CI/CD pipeline
- [ ] Add test data factories
- [ ] Mock external services
