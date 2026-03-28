# 📘 Plano de Refatoração e Execução

## 🎯 Objetivo do Documento

Este documento descreve um **plano estruturado de refatoração de software**, baseado em uma análise prévia de dívida técnica do código.

O objetivo principal é:

- Melhorar a qualidade do código
- Corrigir problemas arquiteturais
- Aplicar boas práticas de engenharia de software
- Modernizar o projeto com técnicas atuais

## 🧠 O que este "prompt" está fazendo?

Este prompt atua como um **guia de execução de refatoração**, semelhante ao trabalho de um Engenheiro de Software Sênior.

Ele organiza o trabalho documentando as intervenções realizadas. Para cada problema encontrado, ele registra três partes principais:

### 1. Problema:
Explica claramente o que está errado ou acoplado no código (Ex: Classe ProcessadorPedido está fazendo validação, cálculo e salvamento).

### 2. Técnica Aplicada:
Define qual técnica de refatoração foi utilizada para resolver o problema, como:

- Extração de Service
- Implementação de Pattern Strategy
- Conversão para Records
- Separation of Concerns
- Tipo em vez de Uso de `any`

### 3. Prompt de Refatoração:
O comando utilizado na IDE ou agente de IA para transformar o código de forma automatizada.

## 💡 Dica de Prompt Utilizada

Para garantir a melhor documentação pela Inteligência Artificial durante a aplicação do plano, sempre é incluído no **Prompt de Refatoração**:
> "Ao final, descreva brevemente o problema resolvido e a técnica aplicada."


## 🚀 Tipos de Problemas Tratados

Este plano cobre problemas reais comuns encontrados:

### Code Smells
- Métodos muito longos ou classes com múltiplas responsabilidades.
- Lógica de domínio fora das entidades (Feature Envy).
- Código Duplicado.

### Violação de Padrões
- Lógica de banco de dados e de autorização no Controller.
- Uso de exceções genéricas ao invés de exceções de domínio estruturadas.

### Obsolescência
- Substituição do uso de bibliotecas datadas.
- Aplicação de `records` e Streams modernas do Java (ex.: substituindo loops manuais).
- Angular: Correção de Memory leaks com `takeUntilDestroyed` na substituição de resources manuais.
