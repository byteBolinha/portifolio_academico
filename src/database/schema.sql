-- aquela parada de remover usuario, ou permitir marcar como concluido a integração do RM.

CREATE TABLE permissions (
    id_permissions INT AUTO_INCREMENT PRIMARY KEY,
    name_permissions VARCHAR(50) UNIQUE
);

CREATE TABLE roles(
    id_roles INT AUTO_INCREMENT PRIMARY KEY,
    name_roles VARCHAR(50) UNIQUE
);

CREATE TABLE roles_permissions(
    roles_id INT,
    permissions_id INT,
    PRIMARY KEY(roles_id, permissions_id),

    CONSTRAINT fk_roles FOREIGN KEY (roles_id) REFERENCES roles(id_roles),
    CONSTRAINT fk_permissions FOREIGN KEY (permissions_id) REFERENCES permissions(id_permissions)
);

CREATE TABLE courses(
    id_courses INT AUTO_INCREMENT PRIMARY KEY,
    name_courses VARCHAR(255) NOT NULL,
    launch_date_courses TIMESTAMP,
    created_at_courses TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at_courses TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    active TINYINT(1) DEFAULT 1,
    deactivated_at TIMESTAMP NULL,

    course_icon_url VARCHAR(300)
);

CREATE TABLE users(
    id_users INT PRIMARY KEY AUTO_INCREMENT,
    microsoft_id VARCHAR(255) NOT NULL UNIQUE, -- microsoft usa um UUID.
    roles_id INT,
    avatar_users VARCHAR(500), -- validar se o avatar enviado da microsoft é link

    name_users VARCHAR(255) NOT NULL,
    email_users VARCHAR(255) NOT NULL UNIQUE,
    created_at_users TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at_users TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    active TINYINT(1) DEFAULT 1,
    deactivated_at TIMESTAMP NULL,
    deactivated_reason VARCHAR(255),
    last_login TIMESTAMP NULL,

    CONSTRAINT fk_role FOREIGN KEY (roles_id) REFERENCES roles(id_roles)
);

CREATE TABLE user_courses(
    user_id   INT,
    course_id INT NOT NULL,

    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INT,

    PRIMARY KEY (user_id, course_id),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id_users) ON DELETE CASCADE ,
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses (id_courses) ON DELETE CASCADE,
    CONSTRAINT fk_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id_users)
);

CREATE TABLE competency(
    id_competency INT AUTO_INCREMENT PRIMARY KEY,
    name_competency VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    code_competency VARCHAR(10) NOT NULL,

    created_by INT,
    updated_by INT,

    active TINYINT(1) DEFAULT 1,
    created_at_competency TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at_competency TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_competency_course FOREIGN KEY (course_id) REFERENCES courses(id_courses) ON DELETE CASCADE,
    CONSTRAINT fk_competency_created_by FOREIGN KEY (created_by) REFERENCES users(id_users),
    CONSTRAINT fk_competency_updated_by FOREIGN KEY (updated_by) REFERENCES users(id_users)
);

CREATE TABLE document_types (
    id_documentType INT AUTO_INCREMENT PRIMARY KEY,
    name_documentType VARCHAR(30) NOT NULL,

    created_by INT,
    updated_by INT,

    active TINYINT(1) DEFAULT 1,
    created_at_documentType TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at_documentType TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_document_type_created_by FOREIGN KEY (created_by) REFERENCES users(id_users),
    CONSTRAINT fk_document_type_updated_by FOREIGN KEY (updated_by) REFERENCES users(id_users)
);

CREATE TABLE academic_documents(
    id_academicD INT AUTO_INCREMENT PRIMARY KEY,
    name_academicD VARCHAR(150) NOT NULL,
    competency_id INT NOT NULL,
    id_documentType INT NOT NULL,-- faz sentido para mim colocar uma tabela separada, e se o planner no futuro mudar de nome?

    created_by INT,

    matriz VARCHAR(20),      -- Ex: 'Matriz - 62'
    trimestre ENUM('1ª Trimestre', '2ª Trimestre', '3ª Trimestre', '4ª Trimestre'),

    -- ▼ Flags de Controle Paralelo/Opcional
    flag_sagah BOOLEAN DEFAULT FALSE,  -- Checagem de conteúdo opcional (SAGAH)
    flag_midias BOOLEAN DEFAULT FALSE, -- Checagem de conteúdo opcional (MIDIAS)

    -- ▼ Esteira de Validação Principal (Em ordem de aprovação)
    flag_preenchido BOOLEAN DEFAULT FALSE,
    flag_validado_coordenacao BOOLEAN DEFAULT FALSE,
    flag_validado_gestao BOOLEAN DEFAULT FALSE,
    flag_modelo_pronto BOOLEAN DEFAULT FALSE,
    flag_integrado_canvas BOOLEAN DEFAULT FALSE,

    workflow_status ENUM(
        'PENDENTE',
        'EM_PREENCHIMENTO',
        'VALIDADO_COORDENACAO',
        'VALIDADO_GESTAO',
        'MODELO_PRONTO',
        'INTEGRADO_CANVAS',
        'FINALIZADO'
    ) DEFAULT 'PENDENTE',

    drive_link VARCHAR(500), -- Link do arquivo no Google Drive/OneDrive

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    active TINYINT(1) DEFAULT 1,

    updated_by INT,

    CONSTRAINT fk_created_by_user FOREIGN KEY (created_by) REFERENCES users(id_users),
    CONSTRAINT fk_updated_by_user FOREIGN KEY (updated_by) REFERENCES users(id_users),
    CONSTRAINT fk_document_competency FOREIGN KEY (competency_id) REFERENCES competency(id_competency) ON DELETE CASCADE,
    CONSTRAINT fk_document_type FOREIGN KEY (id_documentType) REFERENCES document_types(id_documentType) ON DELETE CASCADE
);

CREATE TABLE audit_logs(
    id_audit INT AUTO_INCREMENT PRIMARY KEY,

    table_name VARCHAR(100),
    record_id INT,

    action_type ENUM(
        'CREATE',
        'UPDATE',
        'DEACTIVATE'
    ),

    old_data JSON,
    new_data JSON,

    user_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
    FOREIGN KEY (user_id)
    REFERENCES users(id_users)
);

CREATE INDEX idx_documents_competency ON academic_documents(competency_id);
CREATE INDEX idx_documents_workflow ON academic_documents(workflow_status);
CREATE INDEX idx_documents_active ON academic_documents(active);
CREATE INDEX idx_competency_course ON competency(course_id);
CREATE INDEX idx_courses_active ON courses(active);
CREATE INDEX idx_users_email ON users(email_users);
CREATE INDEX idx_users_microsoft ON users(microsoft_id);
CREATE INDEX idx_users_active ON users(active);

--  THE GREAT ROLLBACK

/*
DROP TABLE IF EXISTS academic_documents;
DROP TABLE IF EXISTS document_types;
DROP TABLE IF EXISTS competency;
DROP TABLE IF EXISTS user_courses;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS roles_permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
 */