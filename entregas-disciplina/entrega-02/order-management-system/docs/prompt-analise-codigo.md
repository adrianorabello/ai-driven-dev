# Análise de código e refatoração 

## 🎯 Objetivo do Prompt

Este prompt orienta uma Inteligência Artificial a atuar como um **Arquiteto de Software**, especializado em:

- Qualidade de código
- Refatoração
- Arquitetura de software

O objetivo é analisar o projeto e gerar um **relatório de dívida técnica**, focando em violações de SOLID e acoplamento excessivo.

## 💡 Dica de Prompt Utilizada

> "Aja como um Arquiteto de Software. Analise meu projeto e gere um relatório de dívida técnica, focando em violações de SOLID e acoplamento excessivo."

## 🧠 Contexto

O projeto analisado faz parte de uma entrega acadêmica ou prática (**entrega-02**), podendo conter:

- Implementações incompletas
- Atalhos técnicos
- Inconsistências

## 🔍 O que a IA deve fazer

A IA deve realizar uma **análise profunda do código-fonte** e escanear o projeto para listar:

### 1️⃣ Code Smells (Problemas de Código)

Detectar problemas como:

- Métodos muito longos
- Classes com responsabilidades múltiplas (God Class)
- Código duplicado
- Alto acoplamento / baixa coesão
- Feature Envy
- Primitive Obsession
- Shotgun Surgery
- Código morto (dead code)

**📌 Para cada problema:**
- **Localização:** arquivo / classe / método  
- **Descrição:** explicação do problema  
- **Impacto:** legibilidade, manutenção, escalabilidade  
- **Sugestão de refatoração:** como corrigir  

### 2️⃣ Violações de Padrões e Arquitetura

Identificar problemas como:

- Lógica de banco de dados ou negócios dentro do Controller
- Forte acoplamento entre camadas  
- Violações dos princípios SOLID  
- Falta de separação de responsabilidades  
- Uso incorreto ou ausência de padrões (Strategy, Factory, Repository, etc.)

**📌 Para cada violação:**
- **Localização**  
- **Descrição**  
- **Princípio ou padrão violado**  
- **Correção sugerida**  

### 3️⃣ Obsolescência

Detectar práticas obsoletas:

- Uso de loops manuais onde caberia Java Streams
- Bibliotecas antigas ou APIs depreciadas  
- Falta de imutabilidade  
- Não uso de recursos modernos (records, Optional, streams, lambdas)

**📌 Para cada caso:**
- **Localização**  
- **Descrição**  
- **Alternativa moderna**  

---

## ⚙️ Instruções importantes

- Priorizar problemas de alto impacto e acoplamento excessivo 
- Ser específico e acionável  
- Utilizar boas práticas da indústria  
- Referenciar técnicas de refatoração de Martin Fowler (quando aplicável)  

## 🚀 Etapa Final

Após a análise:

- Gerar o relatório final  
- Disponibilizar como arquivo Markdown (.md) ou PDF (.pdf).