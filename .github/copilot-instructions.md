# Copilot Instructions for LaptrinhwebAPI

## Architecture Overview

This is a **Node.js Express REST API** following a **layered architecture pattern** with strict separation of concerns:

```

Request → Controller → Service → Repository → Database
           ↓           ↓         ↓
        Validation   Business   Data
        & Routing    Logic      Access
```

**Key principle**: Each layer has a single responsibility. Never skip layers.

## Layered Architecture Pattern

### Controllers (`controllers/`)
- **Responsibility**: HTTP request/response handling only
- **Pattern**: Validate input → Call service → Return formatted response
- **Example**: `user.controller.js` routes all user operations through `userService` methods
- **Rules**:
  - Always validate using dedicated validators before passing to service
  - Catch errors and return appropriate HTTP status codes (201 for create, 404 for not found, 400 for validation)
  - Call logger at start of each handler for observability

### Services (`services/`)
- **Responsibility**: Business logic and orchestration
- **Pattern**: Validate existence → Transform data with DTOs → Call repository → Return result
- **Example**: `userService.getUserById()` checks if user exists before returning DTO
- **Rules**:
  - Use DTOs for all data returned from services (transforms raw DB data)
  - Throw errors with meaningful messages for controllers to catch
  - Log significant operations (creates, updates, deletes, not found cases)

### Repositories (`repositories/`)
- **Responsibility**: Pure data access layer
- **Pattern**: Execute SQL queries → Handle DB errors → Return raw data
- **Example**: `userRepository.getAll()` only queries DB, no business logic
- **Rules**:
  - Never apply business logic here
  - Always use parameterized queries (`?` placeholders) to prevent SQL injection
  - Log queries for debugging

### DTOs (`dtos/`)
- **Responsibility**: Transform database objects into API responses
- **Pattern**: Constructor receives raw DB data, returns clean public properties
- **Example**: `UserDTO` excludes sensitive fields, formats timestamps, etc.
- **Rules**:
  - Create separate DTOs for different use cases (e.g., `CreateUserDTO`, `UpdateUserDTO`, `UserDTO`)
  - Never return raw DB columns without transformation

### Validators (`validators/`)
- **Responsibility**: Input schema validation using Zod
- **Pattern**: Define schema with `z.object()`, export validation function
- **Example**: `createUserSchema` requires id/name/email, email must be valid format
- **Rules**:
  - Use Zod's built-in methods for type safety (`.email()`, `.min()`, `.max()`)
  - Validation errors are thrown and caught in controller
  - Separate validators for create/update operations (different requirements)

## Database Configuration

- **Engine**: MySQL 2 (mysql2/promise for async operations)
- **Connection**: `config/database.js` exports a connection pool
- **Access**: Use `pool.query(sql, [params])` for parameterized queries
- **Tables**: Schema defined in `SQLQuery.sql` (check this file when adding entities)

**Pattern for DB queries**:
```javascript
const [rows] = await pool.query("SELECT * FROM Users WHERE id = ?", [id]);
```

## Logging Strategy

- **Tool**: Winston (configured in `config/logger.js`)
- **Levels**: info (operations), warn (missing resources), error (failures)
- **Pattern**: Log at each layer with context (what operation, what ID, what failed)
- **Example**: `logger.info("Service: Getting user by ID 5")` helps trace request flow
- **Key rule**: Always log before doing expensive operations (DB calls, external APIs)

## Adding New Entities

When adding a new entity (e.g., `Product`):

1. **Create table** in MySQL via `SQLQuery.sql`
2. **Repository** (`repositories/product.repository.js`): CRUD operations only
3. **Service** (`services/product.service.js`): Business logic, use DTOs
4. **DTOs** (`dtos/products/product.dto.js`, `create-product.dto.js`): Define public shape
5. **Validators** (`validators/products/create-product.validator.js`): Input validation
6. **Controller** (`controllers/product.controller.js`): HTTP handlers, call service
7. **Routes** (`routes/api.js`): Register controller methods

**Do NOT skip any layer** - always validate → service → repository → DB.

## Development Workflow

```bash
npm start         # Start server with hot-reload (nodemon)
npm run lint      # Check code standards (StandardJS)
npm run lintfix   # Auto-fix code style issues
```

- **Port**: `process.env.PORT` or default 3000
- **Environment**: Load from `.env` file (copy from `.env.example`)
- **Hot-reload**: Nodemon watches `index.js` and restarts on changes

## Error Handling

- **Pattern**: Errors bubble up from repository → service → controller
- **Service layer**: Throw descriptive errors when business rules violated (e.g., "User not found")
- **Controller layer**: Catch and map to HTTP status codes
  - 201: Create success
  - 400: Validation failed
  - 404: Resource not found
  - 500: Server error (caught by global error handler in `index.js`)
- **Global handler**: `index.js` has `app.use((err, req, res, next) => {...})` that logs and returns error JSON

## Security & Middleware Stack

- **Helmet**: Protects against common vulnerabilities (CORS headers, XSS, etc.)
- **CORS**: Enabled for all origins (`*`) - adjust if needed for production
- **Compression**: Gzip responses automatically
- **Cookie Parser**: Parses request cookies
- **Request Logger**: Custom middleware logs all HTTP requests

## Testing (Not Yet Implemented)

- **Framework**: Mocha + Chai (installed, see `package.json`)
- **Pattern when adding tests**: Place in `tests/` folder, mirror source structure
- **Command**: `npm test` (once test script added to package.json)
