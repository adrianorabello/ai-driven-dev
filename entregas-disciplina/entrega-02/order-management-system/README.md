

## Group Members (Integrantes do Grupo)

| Name | RM |
| :--- | :--- |
| Adriano Rabello | RM362208 |
| Fabio Ivo Silva | RM364993 |
| Francielli Machini Tateo | RM365052 |
| Rafael Gava | RM362550 |
| Renato Magri | RM365124 |


# Order Management System

## Overview
This is a complete project (Backend + Frontend) of an Order Management System, developed as educational material for Software Engineering classes. The project demonstrates the application of best practices, design patterns, layered architecture, and security.

## Technologies Used

### Backend
*   **Language:** Java 21
*   **Framework:** Spring Boot 3.3.x
*   **Security:** Spring Security + JWT
*   **Database:** H2 (Memory - Default) / PostgreSQL (Docker - Production)
*   **ORM:** JPA / Hibernate
*   **Documentation:** Swagger / OpenAPI
*   **Build:** Maven
*   **Containerization:** Docker

### Frontend
*   **Framework:** Angular 18+ (Standalone Components)
*   **Styling:** CSS / SCSS
*   **Communication:** HTTP Client

## Project Structure

```
order-management-system/
├── backend/            # Backend Source Code (Spring Boot)
│   ├── src/main/java   # Java Code
│   │   └── com.edu.ordersystem
│   │       ├── config
│   │       ├── controller
│   │       ├── dto
│   │       ├── exception
│   │       ├── model
│   │       ├── repository
│   │       ├── security
│   │       └── service
│   └── src/main/resources # Configuration and SQLs
├── frontend/           # Frontend Source Code (Angular)
│   ├── src/app
│   │   ├── core        # Services, Guards, Interceptors (Singleton)
│   │   ├── modules     # Feature Modules (Lazy Loaded)
│   │   └── shared      # Shared Components and Models
├── docs/               # Technical and Architectural Documentation
└── docker-compose.yml  # Container Orchestration
```

## How to Run

### Prerequisites
*   Java 21 JDK
*   Maven 3.8+
*   Node.js 20+
*   Docker & Docker Compose (Optional to run everything together)

### Run All Projects (Docker Compose)
At the project root (`order-management-system/`), execute:
```bash
docker-compose up --build
```
*   **Backend:** http://localhost:8080
*   **Frontend:** http://localhost:4200
*   **Swagger UI:** http://localhost:8080/swagger-ui.html

### Local Execution (Development)
You need to run the Backend and Frontend in separate terminals.

#### Terminal 1: Backend
```bash
cd backend
mvn spring-boot:run
```

#### Terminal 2: Frontend
```bash
cd frontend
npm install
npm start
```
*   The application will be available at http://localhost:4200.

### Hybrid Execution (Local Backend + Docker DB)
This mode is useful if you want to run the database via Docker but keep the backend running locally for debugging.

1.  **Start only the Database:**
    ```bash
    docker-compose up -d db
    ```

2.  **Run Backend (Spring Boot):**
    You need to override the default H2 configuration to connect to PostgreSQL.
    ```bash
    cd backend
    export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/orderdb
    export SPRING_DATASOURCE_USERNAME=postgres
    export SPRING_DATASOURCE_PASSWORD=postgres
    export SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
    mvn spring-boot:run
    ```
    *Note: On Windows PowerShell, use `$env:VAR="value"` instead of `export`.*

3.  **Run Frontend:**
    Follow the instructions in the "Local Execution" section above.

## Verification

To verify that the system is working correctly, you can use the provided shell scripts. These scripts use `curl` to interact with the API.

### Prerequisites for Verification
*   The Backend must be running (either via Docker or locally).
*   `curl` must be installed.

### Verify Orders
This script performs a full cycle of order operations: Login (User/Admin), Create, Read, Update, and Delete orders.

```bash
chmod +x verify_orders.sh
./verify_orders.sh
```

### Verify Products
This script authenticates a user and retrieves the list of products.

```bash
chmod +x verify_products.sh
./verify_products.sh
```

## Default Users (Seed Data)
The system starts with the following users for testing:

| Profile | User | Password |
| :--- | :---   | :---                  |
| **ADMIN**     | `admin@example.com`   | `admin123` |
| **USER**      | `user@example.com`    | `user123`  |
| **VIEWER**    | `viewer@example.com`  | `viewer123`|

## Authentication

To access protected endpoints, you need to obtain a JWT token.

1.  Make a **POST** request to `/api/auth/login` (check Swagger UI).
2.  In the request body, send the credentials (email and password) of one of the users above.
3.  The response will contain an `accessToken`.
4.  In subsequent requests, add the `Authorization` header with the value `Bearer <accessToken>`.



## Development Prompts Summary

Here is a refined summary of the prompts and instructions used to build this project:

### 1. Project Initialization
- "Create a complete Order Management System using **Java Spring Boot** (Backend) and **Angular** (Frontend)."
- "Implement a layered architecture: Controller, Service, Repository, DTOs, and Domain Models."
- "Configure **Docker** and **Docker Compose** to orchestrate Backend, Frontend, and PostgreSQL database containers."

### 2. Security & Authentication
- "Implement **JWT Authentication** with Spring Security."
- "Define Role-Based Access Control (RBAC) with `ADMIN` and `USER` roles."
- "Secure API endpoints to ensure Users can only manage their own orders, while Admins have full access."

### 3. Core Functionality (Backend)
- "Create CRUD endpoints for `Products` and `Orders`."
- "Implement business rules: Orders can only be edited/deleted if status is `OPEN`."
- "Add a verification script (`verify_orders.sh`) to test API endpoints using `curl`."

### 4. Frontend UI/UX
- "Develop a responsive UI using **Bootstrap 5** and custom SCSS."
- "Create a Dashboard with **Chart.js** to visualize order statistics (e.g., Orders by Status)."
- "Implement an Order List with status badges and action buttons (Edit, Delete, View)."
- "Build a reactive Order Form (`OrderCreateComponent`) with dynamic line items."

### 5. Debugging & Polish
- "Fix 404 errors on `GET /orders/{id}` by implementing the missing backend endpoint."
- "Resolve CORS issues to allow Frontend communication with Backend."
- "Improve the verification script to cover edge cases and ensure robustness."
- "Refine the project structure and documentation for educational purposes."

## Additional Documentation
*   [Architecture and Technical Decisions](docs/ARCHITECTURE.md)
*   [Business Rules](docs/BUSINESS_RULES.md)
*   [Security](docs/SECURITY.md)
