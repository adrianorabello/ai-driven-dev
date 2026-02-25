
## Integrantes do Grupo

| Nome | RM |
| :--- | :--- |
| Adriano Rabello | RM362208 |
| Fabio Ivo Silva | RM364993 |
| Francielli Machini Tateo | RM365052 |
| Rafael Gava | RM362550 |
| Renato Magri | RM365124 |


# Sistema de Gerenciamento de Pedidos (Order Management System)

## Visão Geral
Este é um projeto completo (Backend + Frontend) de um Sistema de Gerenciamento de Pedidos, desenvolvido como material educacional para aulas de Engenharia de Software. O projeto demonstra a aplicação de boas práticas, padrões de design, arquitetura em camadas e segurança.

## Tecnologias Utilizadas

### Backend
*   **Linguagem:** Java 21
*   **Framework:** Spring Boot 3.3.x
*   **Segurança:** Spring Security + JWT
*   **Banco de Dados:** H2 (Memória - Padrão) / PostgreSQL (Docker - Produção)
*   **ORM:** JPA / Hibernate
*   **Documentação:** Swagger / OpenAPI
*   **Build:** Maven
*   **Containerização:** Docker

### Frontend
*   **Framework:** Angular 18+ (Componentes Standalone)
*   **Estilização:** CSS / SCSS
*   **Comunicação:** HTTP Client

## Estrutura do Projeto

```
order-management-system/
├── backend/            # Código Fonte do Backend (Spring Boot)
│   ├── src/main/java   # Código Java
│   │   └── com.edu.ordersystem
│   │       ├── config
│   │       ├── controller
│   │       ├── dto
│   │       ├── exception
│   │       ├── model
│   │       ├── repository
│   │       ├── security
│   │       └── service
│   └── src/main/resources # Configuração e SQLs
├── frontend/           # Código Fonte do Frontend (Angular)
│   ├── src/app
│   │   ├── core        # Serviços, Guards, Interceptores (Singleton)
│   │   ├── modules     # Módulos de Funcionalidade (Carregamento Preguiçoso)
│   │   └── shared      # Componentes e Modelos Compartilhados
├── docs/               # Documentação Técnica e Arquitetural
└── docker-compose.yml  # Orquestração de Containers
```

## Como Executar

### Pré-requisitos
*   Java 21 JDK
*   Maven 3.8+
*   Node.js 20+
*   Docker & Docker Compose (Opcional para rodar tudo junto)

### Executar Todos os Projetos (Docker Compose - Recomendado)
Na raiz do projeto (`order-management-system/`), execute:
```bash
docker-compose up --build
```
*   **Backend:** http://localhost:8080
*   **Frontend:** http://localhost:4200
*   **Swagger UI:** http://localhost:8080/swagger-ui.html

### Execução Local (Desenvolvimento)
Você precisa rodar o Backend e o Frontend em terminais separados.

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
*   A aplicação estará disponível em http://localhost:4200.

### Execução Híbrida (Backend Local + Banco Docker)
Este modo é útil se você quiser rodar o banco de dados via Docker mas manter o backend rodando localmente para debug.

1.  **Inicie apenas o Banco de Dados:**
    ```bash
    docker-compose up -d db
    ```

2.  **Rode o Backend (Spring Boot):**
    Você precisa sobrescrever a configuração padrão do H2 para conectar ao PostgreSQL.
    ```bash
    cd backend
    export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/orderdb
    export SPRING_DATASOURCE_USERNAME=postgres
    export SPRING_DATASOURCE_PASSWORD=postgres
    export SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
    mvn spring-boot:run
    ```
    *Nota: No Windows PowerShell, use `$env:VAR="valor"` em vez de `export`.*

3.  **Rode o Frontend:**
    Siga as instruções na seção "Execução Local" acima.

## Verificação

Para verificar se o sistema está funcionando corretamente, você pode usar os scripts shell fornecidos. Esses scripts usam `curl` para interagir com a API.

### Pré-requisitos para Verificação
*   O Backend deve estar rodando (seja via Docker ou localmente).
*   `curl` deve estar instalado.

### Verificar Pedidos (Verify Orders)
Este script realiza um ciclo completo de operações de pedidos: Login (Usuário/Admin), Criar, Ler, Atualizar e Deletar pedidos.

```bash
chmod +x verify_orders.sh
./verify_orders.sh
```

### Verificar Produtos (Verify Products)
Este script autentica um usuário e recupera a lista de produtos.

```bash
chmod +x verify_products.sh
./verify_products.sh
```

## Usuários Padrão (Dados Iniciais)
O sistema inicia com os seguintes usuários para teste:

| Perfil | Usuário | Senha |
| :--- | :---   | :---                  |
| **ADMIN**     | `admin@example.com`   | `admin123` |
| **USER**      | `user@example.com`    | `user123`  |
| **VIEWER**    | `viewer@example.com`  | `viewer123`|

## Autenticação

Para acessar endpoints protegidos, você precisa obter um token JWT.

1.  Faça uma requisição **POST** para `/api/auth/login` (verifique o Swagger UI).
2.  No corpo da requisição, envie as credenciais (email e senha) de um dos usuários acima.
3.  A resposta conterá um `accessToken`.
4.  Nas requisições subsequentes, adicione o cabeçalho `Authorization` com o valor `Bearer <accessToken>`.



## Prompt para Gerar este Projeto

Abaixo está o prompt consolidado que pode ser utilizado para gerar um projeto similar a este utilizando ferramentas de IA Generativa:

> "Crie um **Sistema de Gerenciamento de Pedidos** completo (Full Stack) com as seguintes especificações:
>
> **1. Backend (Java Spring Boot):**
> *   Utilize **Java 21** e **Spring Boot 3.3.x**.
> *   Implemente segurança com **Spring Security** e **JWT** (Autenticação Stateless).
> *   Configure acesso baseado em papéis (RBAC): **ADMIN** (acesso total) e **USER** (apenas seus próprios dados).
> *   Use banco de dados **H2** para desenvolvimento (em memória) e suporte a **PostgreSQL** para produção via Docker.
> *   Arquitetura em camadas: Controller, Service, Repository, DTO, Model.
> *   Documentação da API com **Swagger/OpenAPI**.
> *   Endpoints CRUD para `Produtos` e `Pedidos`.
> *   Regra de negócio: Pedidos só podem ser editados ou excluídos se o status for 'OPEN'.
>
> **2. Frontend (Angular):**
> *   Utilize **Angular 18+** com **Standalone Components**.
> *   Estilize com **Bootstrap 5** e **SCSS**.
> *   Crie um Dashboard com gráficos (**Chart.js**) mostrando estatísticas de pedidos.
> *   Implemente listagem de pedidos com badges de status e ações (Editar, Excluir, Visualizar).
> *   Formulário reativo para criação de pedidos com múltiplos itens dinâmicos.
> *   Interceptores HTTP para anexar o Token JWT automaticamente. 
>
> **3. Infraestrutura & Scripts:**
> *   Crie um `docker-compose.yml` para orquestrar Backend, Frontend (Nginx/Imagem Node) e Banco de Dados PostgreSQL.
> *   Inclua scripts Shell (`verify_orders.sh`) para testar o fluxo completo da API via `curl`.
>
> O código deve ser limpo, seguir os princípios SOLID e incluir tratamento de exceções global."

## Documentação Adicional
*   [Arquitetura e Decisões Técnicas](docs/ARCHITECTURE.md)
*   [Regras de Negócio](docs/BUSINESS_RULES.md)
*   [Segurança](docs/SECURITY.md)
