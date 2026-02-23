# Business Rules

## Order Management
- **RN01 - Initial Status:** All new orders must be created with the status `OPEN`.
- **RN02 - Backend Calculation:** The order total MUST be calculated on the backend (`price * quantity`). Ignore any total sent by the client to prevent price manipulation.
- **RN03 - Mandatory Items:** An order cannot be created without at least one product item.
- **RN04 - Edit Restrictions:** 
  - Regular users can only edit or cancel their OWN orders.
  - Orders can only be edited/canceled while in `OPEN` status.
- **RN05 - Status Lifecycle:**
  - `OPEN` -> `CONFIRMED`
  - `CONFIRMED` -> `SHIPPED` (ADMIN only)
  - `SHIPPED` -> `DELIVERED` (ADMIN only)
  - `OPEN` -> `CANCELED`

## User & Access
- **RN06 - Unique Identity:** Emails must be unique across all user accounts.
- **RN07 - Role Requirement:** Every user must be assigned at least one security role (`ROLE_ADMIN`, `ROLE_USER`, `ROLE_VIEWER`).
- **RBAC (Role-Based Access Control):**
  - `ROLE_ADMIN`: Full access to all orders and users.
  - `ROLE_USER`: Can view and manage their own orders. Can browse products.
  - `ROLE_VIEWER`: Read-only access to all data.

## Security Rules
- **Statelessness:** No session data should be stored on the server.
- **Encryption:** All user passwords must be hashed using BCrypt.
- **Token Validation:** Every protected request must contain a valid, unexpired JWT in the `Authorization` header.
