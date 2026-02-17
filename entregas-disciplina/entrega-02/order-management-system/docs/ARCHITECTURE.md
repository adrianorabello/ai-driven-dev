# Documentação Arquitetural

## Diagrama de Componentes e Camadas
O sistema segue uma arquitetura em camadas estrita para garantir a separação de responsabilidades (SoC) e facilitar a manutenibilidade.

```mermaid
graph TD
    Client[Frontend (Angular)] <-->|HTTP/REST| Controller[Controller Layer]
    
    subgraph Backend [Spring Boot Backend]
        Controller -->|DTOs| Service[Service Layer]
        Service -->|Entities| Repository[Repository Layer]
        Repository <-->|Gera SQL| Database[(Database H2/Postgres)]
        
        Security[Security Filter Chain] -.->|Intercepta| Controller
    end
```

## Decisões Arquiteturais

### 1. Separação de Camadas
*   **Controller:** Responsável apenas por receber requisições HTTP, validar dados de entrada (via DTOs) e retornar respostas formatadas. Não contém regras de negócio.
*   **Service:** Contém toda a regra de negócio da aplicação. É onde as transações são gerenciadas.
*   **Repository:** Interface de comunicação com o banco de dados. Utiliza Spring Data JPA para abstrair queries comuns.
*   **Model (Entity):** Representa as tabelas do banco de dados. Mapeamento ORM.

### 2. DTOs (Data Transfer Objects)
Optamos por usar DTOs para comunicação externa da API.
*   **Motivo:** Evitar expor a estrutura interna do banco de dados (Entidades) diretamente.
*   **Segurança:** Previne Mass Assignment Vulnerabilities.
*   **Versionamento:** Permite alterar o banco de dados sem quebrar o contrato da API.

### 3. Padrão REST
A API segue os princípios RESTful:
*   Uso correto dos verbos HTTP (GET, POST, PUT, DELETE, PATCH).
*   Stateless (cada requisição contém toda a informação necessária).
*   Recursos bem definidos (/orders, /users).

### 4. Diagrama de Sequência: Criação de Pedido

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant OrderController
    participant OrderService
    participant ProductRepository
    participant OrderRepository
    participant Database

    User->>Frontend: Clica em "Criar Pedido"
    Frontend->>OrderController: POST /orders (OrderDTO)
    activate OrderController
    OrderController->>OrderService: createOrder(OrderDTO, UserID)
    activate OrderService
    
    loop Para cada item
        OrderService->>ProductRepository: findById(productId)
        ProductRepository-->>OrderService: Product Entity
        OrderService->>OrderService: Valida Estoque/Preço
    end
    
    OrderService->>OrderService: Calcula Total
    OrderService->>OrderRepository: save(Order)
    OrderRepository->>Database: INSERT INTO orders...
    Database-->>OrderRepository: Order ID
    OrderRepository-->>OrderService: Order Entity
    OrderService-->>OrderController: OrderResponseDTO
    deactivate OrderService
    
    OrderController-->>Frontend: 201 Created (OrderResponseDTO)
    deactivate OrderController
    Frontend-->>User: Exibe confirmação
```

## Diagrama de Entidade-Relacionamento (ER)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS }|--|| ROLES : has
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDER_ITEMS }|--|| PRODUCTS : references

    USERS {
        Long id
        String email
        String password
        String name
    }
    
    ROLES {
        Long id
        String name
    }

    ORDERS {
        Long id
        Date createDate
        Enum status
        BigDecimal total
    }

    PRODUCTS {
        Long id
        String name
        BigDecimal price
    }

    ORDER_ITEMS {
        Long id
        Integer quantity
        BigDecimal unitPrice
    }
```
