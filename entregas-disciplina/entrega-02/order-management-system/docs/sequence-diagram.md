# Sequence Diagram: Order Creation

This diagram illustrates the flow of creating a new order in the system, from the initial API request to the final persistence in the database.

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Controller as OrderController
    participant Service as OrderServiceImpl
    participant UserRepo as UserRepository
    participant ProdRepo as ProductRepository
    participant OrderRepo as OrderRepository
    participant DB as Database

    Client->>Controller: POST /api/orders (OrderRequestDTO)
    activate Controller
    
    Controller->>Service: createOrder(orderRequest, userEmail)
    activate Service

    Service->>UserRepo: findByEmail(userEmail)
    activate UserRepo
    UserRepo-->>Service: User instance
    deactivate UserRepo

    Note over Service: Create new Order instance

    loop For each item in request
        Service->>ProdRepo: findById(productId)
        activate ProdRepo
        ProdRepo-->>Service: Product instance
        deactivate ProdRepo
        Note over Service: Create OrderItem with current price
    end

    Note over Service: Calculate Order Total
    Note over Service: Link Items to Order

    Service->>OrderRepo: save(Order)
    activate OrderRepo
    OrderRepo->>DB: INSERT into orders/order_items
    DB-->>OrderRepo: Persisted Order
    OrderRepo-->>Service: Saved Order
    deactivate OrderRepo

    Note over Service: Map to OrderResponseDTO
    Service-->>Controller: OrderResponseDTO
    deactivate Service

    Controller-->>Client: 201 Created (OrderResponseDTO)
    deactivate Controller
```

## Step-by-Step Explanation

1.  **Request Initiation**: The client sends a `POST` request to `/api/orders` with the order details.
2.  **Controller Delegation**: The `OrderController` authenticates the request and passes the data to the `OrderServiceImpl`.
3.  **User Verification**: The service retrieves the user information from the `UserRepository` using the email from the security context.
4.  **Order Initialization**: A new `Order` entity is instantiated and associated with the user.
5.  **Product Validation**: For each item in the request, the service validates the existence of the product and snapshots its current price.
6.  **Persistence**: The complete `Order` (including its `OrderItems`) is saved to the database through the `OrderRepository`.
7.  **Response**: The newly created order is mapped to a `DTO` and returned to the client with a `201 Created` status.
