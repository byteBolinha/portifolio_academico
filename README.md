# API de Gestão Acadêmica - Unifacisa (Backend)

Esta é a API desenvolvida para o sistema de gerenciamento de documentos acadêmicos (Planners e Planos de Ensino), competências e cursos da Unifacisa. O sistema conta com integração nativa com Microsoft SSO e um controle de acesso granular (RBAC).

## Tecnologias Utilizadas

*   Node.js & Express: Core da aplicação.
*   MySQL: Banco de dados relacional.
*   JWT (JSON Web Token): Segurança e autenticação de rotas.
*   Microsoft Graph API: Autenticação via SSO, captura de cargos e foto de perfil.
*   Multer: Gerenciamento de upload de imagens (ícones de cursos e avatares).
*   Swagger: Documentação interativa da API.

## Funcionalidades Principais

*   Autenticação Inteligente: Login via Microsoft com atribuição automática de cargos baseada no jobTitle do Active Directory.
*   Captura de Identidade: Sincronização automática da foto de perfil da Microsoft para o sistema local.
*   RBAC (Controle Baseado em Roles): 
    *   ADMIN: Controle total do sistema e permissões.
    *   NITE: Gestão de cursos, competências e auditoria final.
    *   COORDINATOR: Validação pedagógica e revisão de documentos.
    *   TEACHER: Preenchimento de progresso e links de documentos.
*   Gestão de Documentos: Fluxo completo de status para Planners e Planos de Ensino (Em andamento -> Preenchido -> Validado -> Integrado).
*   Busca Global: Motor de busca para localização rápida de cursos e competências.

## Como Instalar

1.  Clonar o repositório e entrar na pasta portifolio_academico.
2.  Instalar dependências:
    ```bash
    npm install
    ```
3.  Configurar Variáveis de Ambiente:
    Crie um arquivo .env na raiz baseando-se no arquivo .env.example fornecido.

4.  Configurar Banco de Dados:
    Execute os scripts na ordem:
    *   src/database/schema.sql (Estrutura)
    *   src/database/feeding.sql (Dados iniciais)

5.  Iniciar o Servidor:
    ```bash
    npm start
    ```

## Documentação da API (Swagger)

Com o servidor rodando, acesse a documentação interativa para testar todos os endpoints:

Caminho: http://localhost:3000/api-docs

## Estrutura de Pastas

*   src/routes/: Definição de todos os endpoints da API.
*   src/models/: Lógica de banco de dados e queries SQL.
*   src/middleware/: Travas de segurança, autenticação e validação de curso.
*   uploads/: Armazenamento físico de ícones e fotos de perfil.

---
Desenvolvido para o projeto de Portfólio Acadêmico da Unifacisa.
