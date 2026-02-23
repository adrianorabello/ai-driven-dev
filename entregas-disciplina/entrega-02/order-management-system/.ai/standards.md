# Coding & Architecture Standards

## Core Principles
- **SOLID Principles:** Always follow SOLID principles for clean, maintainable code.
- **Separation of Concerns (SoC):** Maintain a strict layered architecture.
- **Clean Code:** Use meaningful naming conventions and keep methods small and focused.

## Backend Standards (Spring Boot)
- **Layered Architecture:**
    - **Controller:** HTTP entry points, input validation, DTO mapping. No business logic.
    - **Service:** Business logic implementation and transaction management.
    - **Repository:** Database interactions using Spring Data JPA.
    - **DTO (Data Transfer Object):** External communication contract. Never expose Entities directly.
    - **Model (Entity):** Database schema representation.
- **Exception Handling:** Use `@ControllerAdvice` for global exception management.
- **Security:**
    - Stateless authentication via JWT.
    - Passwords must be hashed using `BCryptPasswordEncoder`.
    - Use Role-Based Access Control (RBAC).

## Frontend Standards (Angular)
- **Standalone Components:** Use Angular 18+ standalone components.
- **Core/Shared/Modules Pattern:**
    - **Core:** Singletons (services, guards, interceptors).
    - **Shared:** Reusable UI components and models.
    - **Modules:** Functional features with lazy loading.
- **Reactive Forms:** Use Reactive Forms for complex data entry.
- **HTTP Interceptors:** Use interceptors for JWT injection.

## API Standards
- **RESTful Principles:** Correct use of HTTP verbs (GET, POST, PUT, DELETE, PATCH).
- **Statelessness:** No session state on the server.
- **JSON:** standard data interchange format.
