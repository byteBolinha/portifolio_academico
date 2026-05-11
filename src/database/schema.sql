-- Criação do Banco de Dados (Descomente se precisar rodar do zero)
-- CREATE DATABASE IF NOT EXISTS estudos_sistemas;
-- USE estudos_sistemas;

-- ==========================================
-- 1. MÓDULO DE SEGURANÇA E ACESSO (RBAC)
-- ==========================================

CREATE TABLE permissions (
    id_permissions INT AUTO_INCREMENT PRIMARY KEY,
    name_permissions VARCHAR(50) NOT NULL
);

CREATE TABLE roles (
    id_roles INT AUTO_INCREMENT PRIMARY KEY,
    name_roles VARCHAR(50) NOT NULL
);

CREATE TABLE roles_permissions (
    roles_id INT,
    permissions_id INT,
    PRIMARY KEY(roles_id, permissions_id),
    CONSTRAINT fk_roles FOREIGN KEY (roles_id) REFERENCES roles(id_roles) ON DELETE CASCADE,
    CONSTRAINT fk_permissions FOREIGN KEY (permissions_id) REFERENCES permissions(id_permissions) ON DELETE CASCADE
);

CREATE TABLE users (
    id_users INT AUTO_INCREMENT PRIMARY KEY,
    microsoft_id VARCHAR(255) UNIQUE NOT NULL, -- UUID do SSO
    roles_id INT NOT NULL,
    name_users VARCHAR(255) NOT NULL,
    email_users VARCHAR(255) NOT NULL UNIQUE,
    created_at_users TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_role FOREIGN KEY (roles_id) REFERENCES roles(id_roles)
);

-- ==========================================
-- 2. MÓDULO ACADÊMICO BÁSICO
-- ==========================================

CREATE TABLE courses (
    id_courses INT AUTO_INCREMENT PRIMARY KEY,
    name_courses VARCHAR(255) NOT NULL,
    data_lancamento_courses DATE,
    lancado_no_sistema_courses TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela Associativa: Regra de "Cada um em seu curso"
CREATE TABLE user_courses (
    user_id INT,
    course_id INT,
    PRIMARY KEY (user_id, course_id),
    CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES users (id_users) ON DELETE CASCADE,
    CONSTRAINT fk_uc_course FOREIGN KEY (course_id) REFERENCES courses (id_courses) ON DELETE CASCADE
);

-- ==========================================
-- 3. MÓDULO DO PORTFÓLIO (PLANNER E PLANO DE ENSINO)
-- ==========================================

-- Agrupador visual que vimos nos protótipos (Ex: C02 - Programar em linguagem...)
CREATE TABLE competencies (
    id_competency INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    code VARCHAR(20) NOT NULL, 
    name_competency VARCHAR(255) NOT NULL,
    
    CONSTRAINT fk_competency_course FOREIGN KEY (course_id) REFERENCES courses(id_courses) ON DELETE CASCADE
);

-- Tabela central que guarda tanto o Planner quanto o Plano de Ensino
CREATE TABLE academic_documents (
    id_document INT AUTO_INCREMENT PRIMARY KEY,
    competency_id INT NOT NULL,
    
    -- Diferencia se a linha é um Planner ou Plano de Ensino
    document_type ENUM('PLANNER', 'PLANO_ENSINO') NOT NULL,
    
    -- Dados preenchidos no modal
    matriz VARCHAR(50),      -- Ex: 'Matriz - 62'
    trimestre VARCHAR(50),   -- Ex: '1º Trimestre'
    drive_link VARCHAR(500), -- Link do arquivo no Google Drive/OneDrive
    
    -- Máquina de Estados (Onde o documento está no processo)
    status_atual VARCHAR(50) DEFAULT 'EM_PREENCHIMENTO',
    
    -- Flags de Integração Canvas (Checkboxes do protótipo)
    flag_liberado_customizar BOOLEAN DEFAULT FALSE,
    flag_disponivel_canvas BOOLEAN DEFAULT FALSE,
    flag_integrado_rm BOOLEAN DEFAULT FALSE,
    
    -- Rastreabilidade temporal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_document_competency FOREIGN KEY (competency_id) REFERENCES competencies(id_competency) ON DELETE CASCADE
);

-- ==========================================
-- 4. MÓDULO DE SISTEMA E COMUNICAÇÃO
-- ==========================================

-- Notificações que aparecem na aba superior para coordenadores e professores
CREATE TABLE notifications (
    id_notification INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(255) NOT NULL, -- Ex: 'PLANNER Validado pelo coordenador - C02...'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id_users) ON DELETE CASCADE
);