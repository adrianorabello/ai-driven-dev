

# 📦 Sistema de Gestão de Pedidos


# Integrantes do Grupo 
| RM            | NOME                        | 
| ------------- | -------------------         | 
| RM362208      | Adriano Rabello             | 
| RM365052      | Francielli Manchini Tateo   | 
| RM364993      | Fábio Ivo Silva             | 
| RM365124      | Renato Magri Trevine        | 
| RM362550      | Rafael Gava Yokoyama        | 



## 📌 Visão Geral

Este projeto descreve a **arquitetura de um Sistema de Gestão de Pedidos**, cujo objetivo é servir como base para implementação em aulas práticas de engenharia de software.

O sistema permite o cadastro, acompanhamento e gerenciamento de pedidos, aplicando boas práticas de separação de camadas, organização de responsabilidades e comunicação via API REST.

---

## 🎯 Funcionalidades Principais

- Autenticação de usuários
- Cadastro e gerenciamento de usuários
- Criação de pedidos
- Atualização do status dos pedidos
- Consulta de pedidos (por usuário ou geral)
- Visualização de histórico de pedidos
- Geração de relatórios simples

---

## 👥 Tipos de Usuários e Permissões

### 🔑 Administrador
- Gerenciar usuários
- Visualizar todos os pedidos
- Alterar status de qualquer pedido
- Acessar relatórios

### 👤 Usuário
- Criar pedidos
- Consultar seus próprios pedidos
- Atualizar pedidos enquanto estiverem em status inicial

### 👀 Usuário Leitura
- Visualizar pedidos
- Não possui permissão de criação ou edição

---

## 🧩 Entidades Principais e Relacionamentos

- Usuário
- Perfil
- Pedido
- ItemPedido

Relacionamentos:
- Um Usuário pode possuir um ou mais Perfis
- Um Usuário pode criar vários Pedidos
- Um Pedido pode conter vários Itens de Pedido

---

## 🔌 Endpoints da API (Principais Rotas REST)

- POST /auth/login
- GET /users
- POST /users
- GET /orders
- POST /orders
- PUT /orders/{id}
- PATCH /orders/{id}/status

---

## 🛠️ Tecnologias Sugeridas

- Frontend: Framework SPA
- Backend: Framework Web REST
- Banco de Dados: Banco Relacional
- Autenticação: JWT
- Infraestrutura: Containers
- Versionamento: Git

--- 

## 🔄 Fluxos Principais

### Fluxo de Criação de Pedido
1. Usuário acessa o sistema pelo frontend
2. Frontend envia requisição para a API
3. Backend valida e processa a requisição
4. Pedido é persistido no banco de dados
5. Backend retorna confirmação ao frontend

---


## 🏗️ Diagrama de Arquitetura

O diagrama abaixo representa a arquitetura em camadas do sistema:

[![Diagrama de Arquitetura](images/arquitetura.png)](https://lucid.app/lucidspark/617099a9-93be-4423-a33d-23178b70531f/edit?invitationId=inv_dbbd9274-23c0-42ef-861e-a9aef0048ab1&page=0_0#)




