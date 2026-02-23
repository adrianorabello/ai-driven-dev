# System Architecture

## Overview
The Order Management System (OMS) follows a strict 3-tier architecture with a clear separation of frontend, backend, and persistence layers.

## Backend Architecture (Spring Boot)
The backend is structured into five distinct levels to isolate responsibilities:
1.  **Controller Layer:** Entry point for REST requests. Handles DTO validation and HTTP status codes.
2.  **Service Layer:** Core business logic. Manages transactions and orchestrates data movement between DTOs and Entities.
3.  **Repository Layer:** Abstracted data access using Spring Data JPA.
4.  **Security Filter Chain:** Intercepts requests for JWT validation and RBAC enforcement.
5.  **Model/Entity Layer:** Represents the persistence schema.

## Frontend Architecture (Angular)
The frontend utilizes a modular structure:
- **Core:** Global singletons (AuthService, AuthGuard, AuthInterceptor).
- **Modules:** Feature-based lazy loading (Dashboard, Orders, Products, Auth).
- **Shared:** Reusable components, pipes, and common models.

## Communication Flow
1.  **Client (Angular)** -> **REST/HTTP** (with JWT) -> **Backend (Spring Boot)**.
2.  **Security Filter** validates the JWT.
3.  **Controller** receives the request DTO.
4.  **Service** applies business rules and calculates values.
5.  **Repository** saves/retrieves data from **Database (PostgreSQL/H2)**.
6.  **Response DTO** is sent back to the client.

## Data Transfer Pattern
Exterior interaction is handled exclusively via **DTOs** (Data Transfer Objects) to maintain a decoupled contract between the database schema (Entities) and the API consumers.
