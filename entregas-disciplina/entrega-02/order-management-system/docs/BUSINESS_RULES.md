# Regras de Negócio e Segurança

## Regras de Negócio

### 1. Pedidos
*   **RN01 - Status Inicial:** Todo pedido nasce com o status `OPEN` (Aberto).
*   **RN02 - Cálculo de Total:** O total do pedido deve ser calculado, obrigatoriamente, no Backend, somando `(quantidade * preço_unitario)` de cada item. O valor enviado pelo frontend deve ser ignorado para evitar fraudes.
*   **RN03 - Itens Obrigatórios:** Um pedido não pode ser criado sem itens.
*   **RN04 - Modificação de Pedido:** Um usuário comum só pode alterar ou cancelar seus próprios pedidos se eles estiverem no status `OPEN`. Se o pedido já estiver `CONFIRMED` ou `SHIPPED`, a edição é bloqueada.
*   **RN05 - Evolução de Status:**
    *   `OPEN` -> `CONFIRMED`
    *   `CONFIRMED` -> `SHIPPED`
    *   `SHIPPED` -> `DELIVERED`
    *   `OPEN` -> `CANCELED`
    *   Apenas ADMIN pode mover para `SHIPPED` ou `DELIVERED`.

### 2. Usuários
*   **RN06 - Unicidade:** Não podem existir dois usuários com o mesmo e-mail.
*   **RN07 - Roles:** Um usuário deve ter pelo menos uma Role associada.

## Documentação de Segurança

### Autenticação (JWT)
O sistema utiliza **JSON Web Tokens (JWT)** para autenticação Stateless.

1.  **Login:** O usuário envia `email` e `senha` para `/auth/login`.
2.  **Geração:** O servidor valida as credenciais. Se corretas, gera um token JWT assinado (HMAC SHA256) contendo:
    *   `sub`: Email do usuário
    *   `roles`: Lista de permissões (ex: `["ROLE_ADMIN", "ROLE_USER"]`)
    *   `iat`: Data de emissão
    *   `exp`: Data de expiração (ex: 24 horas)
3.  **Uso:** O cliente armazena o token e o envia no header `Authorization: Bearer <token>` em todas as requisições subsequentes.

### Autorização (RBAC - Role Based Access Control)

| Recurso | Método | Permissão Necessária | Descrição |
| :--- | :--- | :--- | :--- |
| `/auth/login` | POST | Pública | Login no sistema |
| `/users` | GET | `ROLE_ADMIN` | Listar todos usuários |
| `/orders` | GET | `ROLE_ADMIN`, `ROLE_USER`, `ROLE_VIEWER` | Listar pedidos (User vê os seus, Admin/Viewer vê todos) |
| `/orders` | POST | `ROLE_USER` | Criar novo pedido |
| `/orders/{id}` | PUT | `ROLE_USER` (Dono e Status OPEN), `ROLE_ADMIN` | Atualizar pedido |
| `/orders/{id}/status` | PATCH | `ROLE_ADMIN` | Alterar status do pedido |

### Tratamento Global de Exceções
Todas as exceções são capturadas por um `@ControllerAdvice`.
*   Erro de Validação (400): Retorna lista de campos inválidos.
*   Recurso Não Encontrado (404): Retorna mensagem amigável.
*   Acesso Negado (403): Retorna erro de autorização.
*   Erro de Negócio (422): Regra de negócio violada.
*   Erro Interno (500): Erro genérico de servidor (logs detalhados ocultos do cliente).
