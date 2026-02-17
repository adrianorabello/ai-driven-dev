# 🚀 ANTIGRAVITY FULL-STACK GENERATION PLAN
## Project: Order Management System

---

# 1️⃣ PROJECT METADATA

**Project Name:** Order Management System  
**Purpose:** Educational base system for Software Engineering practical classes  
**Architecture Style:** Layered Architecture (Controller → Service → Repository → Domain)  
**Deployment Model:** Containerized (Docker)  
**Authentication:** JWT  
**API Style:** REST  

---

# 2️⃣ TECH STACK (STRICT REQUIREMENT)

## Backend
- Language: Java 21
- Framework: Spring Boot
- Security: Spring Security + JWT
- ORM: JPA / Hibernate
- Database: PostgreSQL (default) + H2 (dev profile)
- Documentation: Swagger / OpenAPI
- Build Tool: Maven
- Tests: JUnit + Mockito
- Validation: Bean Validation (Jakarta)

## Frontend
- Framework: Angular (latest stable)
- Architecture: Modular SPA
- State Management: Services + RxJS
- HTTP Client for REST communication
- JWT Interceptor
- Route Guards (Role-based authorization)
- UI Library: Angular Material

## Infrastructure
- Docker
- Docker Compose
- Git versioning

---

# 3️⃣ DOMAIN MODEL

## Entities

### User
- id (UUID)
- name
- email (unique)
- password
- active (boolean)
- profiles (ManyToMany)

### Profile
- id (UUID)
- name (ADMIN, USER, READ_ONLY)

### Order
- id (UUID)
- createdAt (LocalDateTime)
- status (INITIAL, PROCESSING, COMPLETED, CANCELED)
- totalAmount (BigDecimal)
- user (ManyToOne)

### OrderItem
- id (UUID)
- productName
- quantity
- unitPrice (BigDecimal)
- subtotal (calculated)
- order (ManyToOne)

---

# 4️⃣ RELATIONSHIPS

- A User can have multiple Profiles (ManyToMany)
- A User can create multiple Orders (OneToMany)
- An Order contains multiple OrderItems (OneToMany)
- Order totalAmount must be calculated automatically from items

---

# 5️⃣ BUSINESS RULES

1. Only ADMIN can update order status to any value.
2. USER can update order only when status = INITIAL.
3. Order cannot be created without at least one OrderItem.
4. Order totalAmount must be calculated in backend.
5. READ_ONLY profile cannot create or update records.
6. Email must be unique.
7. Password must be stored encrypted (BCrypt).

---

# 6️⃣ API SPECIFICATION

## Authentication
POST /auth/login

## Users
GET /users
POST /users
GET /users/{id}

## Orders
GET /orders
GET /orders?userId={id}
POST /orders
PUT /orders/{id}
PATCH /orders/{id}/status
GET /orders/{id}

---

# 7️⃣ APPLICATION LAYERS

## Backend Layers

- controller
- service
- repository
- domain (entities)
- dto
- mapper
- config
- security
- exception
- util

## Frontend Structure

- core
  - services
  - interceptors
  - guards
- features
  - auth
  - users
  - orders
- shared
  - components
  - models
- layouts

---

# 8️⃣ SECURITY ARCHITECTURE

## Backend
- Stateless authentication
- JWT Token generation on login
- Role-based authorization
- Global Exception Handler
- CORS configuration

## Frontend
- Store JWT in memory or localStorage
- HTTP interceptor to attach Authorization header
- Route guards based on user role
- Automatic logout on 401

---

# 9️⃣ PAGINATION & FILTERING

- Paginated GET /orders
- Filter by:
  - userId
  - status
  - date range
- Standard Page response model

---

# 🔟 TESTING REQUIREMENTS

## Backend
- Unit tests for Service layer
- Mock Repository layer
- Validation tests
- Security tests (role validation)

## Frontend
- Basic component tests
- Service HTTP tests

---

# 1️⃣1️⃣ SEED DATA

On startup, system must create:

- ADMIN user
  - email: admin@system.com
  - password: admin123

- USER user
  - email: user@system.com
  - password: user123

- READ_ONLY user
  - email: readonly@system.com
  - password: readonly123

---

# 1️⃣2️⃣ DOCKER REQUIREMENTS

Generate:

- Dockerfile (backend)
- Dockerfile (frontend)
- docker-compose.yml
  - PostgreSQL service
  - Backend service
  - Frontend service

---

# 1️⃣3️⃣ DOCUMENTATION REQUIREMENTS

The generated project must include:

## README.md
- Project overview
- Tech stack
- How to run locally
- How to run with Docker
- API documentation link
- Default credentials
- Folder structure explanation

## Architecture Documentation
- Component Diagram
- Layered Diagram
- ER Diagram
- Sequence Diagram (Order Creation Flow)

---

# 1️⃣4️⃣ ORDER CREATION FLOW (SEQUENCE)

1. User logs in
2. Frontend receives JWT
3. User submits new order
4. Backend validates role
5. Backend validates items
6. Backend calculates total
7. Backend saves order
8. Backend returns 201 Created
9. Frontend updates UI

---

# 1️⃣5️⃣ QUALITY REQUIREMENTS

- Clean code principles
- SOLID principles
- DTO pattern
- No business logic in controllers
- Centralized exception handling
- Logging enabled
- Proper HTTP status codes

---

# 1️⃣6️⃣ FUTURE EVOLUTION READY

Structure project to allow:
- Migration to microservices
- Event-driven communication
- Integration with payment service
- Reporting module expansion

---

# ✅ EXPECTED OUTPUT FROM GENERATOR

The generator must produce:

- Complete backend structure
- Complete frontend structure
- Working authentication
- Working CRUD for Users and Orders
- Dockerized environment
- Swagger documentation enabled
- Example test coverage
- Fully documented README
