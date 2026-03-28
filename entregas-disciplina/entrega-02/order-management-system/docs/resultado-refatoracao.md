# 🏆 Resultado Consolidado de Refatoração e Dívida Técnica

## 📌 Visão Geral

Este documento apresenta o resultado consolidado do diagnóstico de dívida técnica do software e do consequente plano de execução. Após o diagnóstico inicial, foram aplicadas refatorações profundas tanto no **Frontend (Angular)** quanto no **Backend (Java/Spring Boot)** para sanar as dívidas técnicas levantadas, elevando a qualidade estrutural e a manutenibilidade do projeto.

---

## 🛠️ Diagnóstico de Dívida Técnica Base (Todo o Projeto)

Usando o prompt arquiteto da IA sob o comando _"Aja como um Arquiteto de Software. Analise meu projeto e gere um relatório de dívida técnica, focando em violações de SOLID e acoplamento excessivo"_, as seguintes categorias de problemas foram identificadas:

### 1. Code Smells
- **God Class / Múltiplas Responsabilidades (Frontend):** `OrderCreateComponent` possuía rotina de mapeamento, formulários nativos, injeções diversas e controle de chamadas HTTP.
- **Modelos Anêmicos & Feature Envy (Backend):** Entidades como `Order` e `OrderItem` eram meras estruturas de dados, enquanto o serviço `OrderServiceImpl` concentrava todo cálculo financeiro.
- **Duplicação (Backend):** Regras de autorização por ID de usuário espalhadas pelos serviços.

### 2. Violação de Padrões e Arquitetura
- **Vazamento de Memória Reactivo (Frontend):** Angular Components (`OrderListComponent` e `OrderCreateComponent`) mantinham instâncias de `subscribe()` abertas, comprometendo o desempenho por falta de cleanup estruturado.
- **Lógica de Banco no Controller (Backend):** Regras de filtro associadas a Roles de usuários no Controller, ferindo o princípio de separação de camadas.
- **Violação de Boas Práticas (Backend):** Disparo de `RuntimeException` generalizado.

### 3. Obsolescência
- **Falta de Tipagem Segura (Frontend):** Presença de `any` em retornos e Payloads (ex.: no `OrderService`), inviabilizando o superset do TypeScript.
- **Lombok vs Java Moderno (Backend):** Uso de classes padrão (com `@Data`) em DTOs em vez da sintaxe mais moderna e imutável de `records`.
- **Java Streams Antigos (Backend):** Uso de `Collectors.toList()` e laços manuais antiquados.



## 🚀 Execução do Plano de Intervenção

Atendendo à Dica de Prompt: _"Ao final, descreva brevemente o problema resolvido e a técnica aplicada."_

### Intervenções Aplicadas no Frontend

#### 1: Tratamento de Classe Gigante (Extração de Service)
- **Problema:** O componente `OrderCreateComponent` possuía múltiplas responsabilidades (formulário reativo, submissão via API, mapeamento para envio).
- **Técnica Aplicada:** Extração de Service (`OrderFormService`) / Separation of Concerns.
- **Prompt:** "Extract form logic and API mapping from OrderCreateComponent into a dedicated service. Ao final, descreva brevemente o problema resolvido e a técnica aplicada."
- **Solução Alcançada:** Foi criado o `OrderFormService` para assumir o controle total do `FormGroup` e do `FormArray` (adicionar/remover items, gerar payload). O componente `OrderCreateComponent` agora apenas delega funções, cumprindo o princípio da Responsabilidade Única (SRP).

#### 2: Refatoração Reativa e Prevenção de Memory Leak
- **Problema:** O código de exibição (`OrderListComponent`) e de salvamento (`OrderCreateComponent`) subscrevia em `Observables` via `.subscribe()`, sem implementar `ngOnDestroy` e/ou limpar o canal, gerando _memory leaks_.
- **Técnica Aplicada:** Reactive Refactor utilizando `takeUntilDestroyed()`.
- **Prompt:** "Replace manual subscriptions with takeUntilDestroyed() in OrderListComponent and OrderCreateComponent for cleanup. Ao final, descreva brevemente o problema resolvido e a técnica aplicada."
- **Solução Alcançada:** Adicionou-se a injeção do `DestroyRef` importando `@angular/core/rxjs-interop`. Todos os fluxos de `subscribe` passaram a ter encadeado o `.pipe(takeUntilDestroyed(this.destroyRef))`, assegurando que a assinatura morre no ciclo de vida do componente.

#### 3: Substituição de `any` por Tipagem Forte (Strong Typing)
- **Problema:** Em `order.service.ts`, métodos como `createOrder` adotavam o tipo genérico e frágil de `any[]` no payload e nos retornos, e `Page` não era tipado. 
- **Técnica Aplicada:** Strong Typing com novas Interfaces.
- **Prompt:** "Replace any casts with properly defined interfaces matching backend DTO structure in models.ts and Services. Ao final, descreva brevemente o problema resolvido e a técnica aplicada."
- **Solução Alcançada:** O arquivo compartilhado `models.ts` foi atualizado criando-se genéricos complexos de paginação `Page<Order>` e o DTO estrito `OrderItemRequest`. O serviço os adotou no lugar de `any`, garantindo intelisense e robustez contra inputs inválidos.


### Intervenções Aplicadas no Backend

#### 4: Migração para Java Records (Obsolescência)
- **Problema:** DTOs de Request e Response operavam como classes mutáveis com anotações pesadas relacionadas ao Lombok.
- **Técnica Aplicada:** Conversão para `Java Records` (Imutabilidade nativa).
- **Prompt:** "Converte todos os DTOs de orders para utilizar a sintaxe de Records do Java 14+ removendo dependências desnecessárias do Lombok. Ao final, descreva brevemente o problema resolvido e a técnica aplicada."
- **Solução Alcançada:** Arquivos como `OrderRequestDTO` e `OrderResponseDTO` passaram a ser Records imutáveis. Isso garantiu que os dados trafegados nas requisições da camada Controller e Service não sofressem efeitos colaterais.

#### 5: Mitigação de Feature Envy e Modelo Anêmico
- **Problema:** O cálculo financeiro dos pedidos era realizado integralmente dentro de `OrderServiceImpl`, vazando regras de negócio centrais e esvaziando as entidades de domínio `Order` e `OrderItem`.
- **Técnica Aplicada:** Delegação de Responsabilidade (Enriquecimento de Domínio).
- **Prompt:** "Move business logic calculations into Order and OrderItem entities instead of having them directly inside the Service layer. Ao final, descreva brevemente o problema resolvido e a técnica aplicada."
- **Solução Alcançada:** Métodos `calculateTotal()` inseridos em `Order` e `calculateSubTotal()` inserido em `OrderItem`. O Service agora apenas invoca o método principal delegando o encapsulamento do cálculo, resolvendo a Inveja de Dados (Feature Envy).

#### 6: Lógica de Controller e Exceptions Genéricas
- **Problema:** O endpoint `getAllOrders` mantinha filtros manuais de autorização ferindo isolamento de camada e disparava `RuntimeException` caso fosse violado.
- **Técnica Aplicada:** Extração via camada de Serviço e Domínio de Exceptions Customizadas.
- **Prompt:** "Move the database filter logic by Role from OrderController to OrderService and implement an OrderAccessDeniedException instead of generic RuntimeException. Ao final, descreva brevemente o problema resolvido e a técnica aplicada."
- **Solução Alcançada:** A lógica de validação visual do controller virou um metódo `findAllowedOrders` na interface e implementação de Service. Tratamos as exceções de segurança criando a exceção de domínio `OrderAccessDeniedException`, centralizada dinamicamente com suporte local no `GlobalExceptionHandler`. Adicionalmente os streams antigos (`Collectors.toList()`) foram atualizados para implementações `.toList()` modernas.



## 📚 Referências ao Livro ``Refatoração``

As refatorações aplicadas neste projeto encontram forte embasamento no catálogo clássico introduzido por **Martin Fowler** na sua obra _"Refatoração: Aperfeiçoando o Design de Códigos Existentes"_. Abaixo estão os mapeamentos diretos das técnicas imortais de Fowler com as soluções desenvolvidas no cenário atual:

1. **Move Function / Mover Função (Combate ao Feature Envy)**
   - **No Livro:** Quando um método se comunica mais com outra classe do que com a própria em que reside (Inveja de Dados), a função defensiva deve ser movida para onde os dados efetivamente residem.
   - **No Projeto:** Aplicado no Backend ao remover as iterações matemáticas expostas em `OrderServiceImpl` e transportá-las para `calculateTotal()` na entidade `Order` e `calculateSubTotal()` na entidade `OrderItem`.

2. **Extract Class / Extrair Classe (Tratamento de God Class)**
   - **No Livro:** Quando uma classe tenta cobrir regras não relacionadas – executando o trabalho de duas –, cria-se uma nova estrutura para delegar campos e metódos de responsabilidades complementares.
   - **No Projeto:** Aplicado no Frontend ao extrair a carga reativa intensa (`FormBuilder`, construção de modelo visual, etc.) contida em `OrderCreateComponent` para gerência autônoma em um serviço isolado (`OrderFormService`).

3. **Remove Setting Method / Remover Método de Configuração (Imutabilidade)**
   - **No Livro:** Se um campo ou objeto for delineado apenas na criação e nunca mais sofrer modificação vitalícia, removem-se os métodos "setters" garantindo blindagem do dado na estrutura.
   - **No Projeto:** Aplicado no Backend ao converter classes mutáveis ricas em anotações (que compunham as classes de transporte via `@Data` do Lombok) para a tipagem read-only com Java `records`, assegurando contratos imutáveis a estas transferências.

4. **Replace Error Code with Exception / Substituir Código de Erro Exagerado**
   - **No Livro:** Fowler indica lidar ativamente com as previsões de anomalia mapeando o domínio dos blocos impuros – parando de propagar status/regras complexas que terminam em erros cruéis.
   - **No Projeto:** Criação direta de `OrderAccessDeniedException` (e integração ao `GlobalExceptionHandler`), impedindo propagação aleatória de puras `RuntimeException` no vazamento do `OrderController`.



## 🔗 Anexos (Prompts Utilizados)

Os prompts brutos gerados durante este estudo de caso, assim como os planos pré-execução solicitados pela entrega, encontram-se documentados a seguir:
- **[Análise de Dívida Técnica (Prompt)](prompt-analise-codigo.md)**: Abordagem inicial para mapear God Classes, code smells e modelos anêmicos.
- **[Plano de Intervenção e Refatoração (Prompt)](prompt-refatoracao-codigo.md)**: Os comandos de IA definitivos que arquitetaram os componentes Angular e os Java Records.

---

## 🎯 Conclusão Prática: O Papel Humano na Codificação Assistida por IA

A experiência vivenciada nesta entrega confirmou que o uso de Inteligência Artificial na refatoração e geração de código atua como um **potente catalisador de produtividade**. Modificações massivas — como as transições de tipagem, a criação de classes de serviço e migrações para linguagens de design mais modernas — que tradicionalmente despenderiam horas de atuação manual, foram orquestradas com extrema agilidade providos os prompts assertivos.

Entretanto, uma lição crítica documentada durante as iterações foi de que **assistentes virtuais frequentemente não conseguem absorver e implementar completamente regras de negócio restritas (Edge Cases)**. Observou-se que mesmo com bons _prompts_, características primordiais da regra de negócio algumas vezes não são atendidas de primeira, ou sofrem da tentativa da IA em implementar saídas genéricas que falham em abranger as especificidades do domínio da aplicação elaborada. 

Este fenômeno prova concretamente que o conhecimento sólido sobre ``Arquitetura de Software e Engenharia de Requisitos continua absolutamente central``. Operar IAs na camada de programação não desobriga o desenvolvedor do conhecimento tático; ao contrário, exige mais proficiência na leitura e validação. É imensamente fácil induzir uma máquina a criar um software que compila de forma limpa, técnica e moderna, mas que silenciosamente não atinge os critérios de aceite estabelecidos, corrompendo as garantias do negócio real que sustenta a aplicação.