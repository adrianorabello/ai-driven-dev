# Configurações de Segurança Detalhadas

## JWT (JSON Web Token)
A implementação do JWT reside no pacote `com.edu.ordersystem.security`.

### Estrutura do Token
```json
{
  "sub": "admin@email.com",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": [
    "ROLE_ADMIN"
  ]
}
```

### Componentes de Segurança
1.  **JwtAuthenticationFilter:** Filtro que intercepta cada requisição HTTP. Extrai o token do header, valida a assinatura e autentica o usuário no contexto do Spring Security (`SecurityContextHolder`).
2.  **CustomUserDetailsService:** Carrega os dados do usuário do banco de dados para validar contra o token.
3.  **SecurityConfig:** Classe de configuração (`@Configuration`) que define a cadeia de filtros de segurança (`SecurityFilterChain`). Desabilita CSRF (pois é stateless), configura CORS e define as regras de acesso às rotas.

## CORS (Cross-Origin Resource Sharing)
Como o Frontend (Angular) roda em porta diferente (4200) do Backend (8080) em desenvolvimento, o CORS é configurado para permitir:
*   **Origens:** `http://localhost:4200`
*   **Métodos:** `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`
*   **Headers:** `Authorization`, `Content-Type`

## Senhas
As senhas **nunca** são armazenadas em texto plano. Utilizamos `BCryptPasswordEncoder` para gerar o hash das senhas antes de salvar no banco.
