SET NAMES 'utf8mb4';
CREATE DATABASE IF NOT EXISTS estudos_sistemas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE estudos_sistemas;

CREATE TABLE IF NOT EXISTS permissions (
    id_permissions INT AUTO_INCREMENT PRIMARY KEY,
    name_permissions VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS roles(
    id_roles INT AUTO_INCREMENT PRIMARY KEY,
    name_roles VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS roles_permissions(
    roles_id INT,
    permissions_id INT,
    PRIMARY KEY(roles_id, permissions_id),
    CONSTRAINT fk_roles FOREIGN KEY (roles_id) REFERENCES roles(id_roles),
    CONSTRAINT fk_permissions FOREIGN KEY (permissions_id) REFERENCES permissions(id_permissions)
);

CREATE TABLE IF NOT EXISTS courses(
    id_courses INT AUTO_INCREMENT PRIMARY KEY,
    name_courses VARCHAR(255),
    matrix_courses VARCHAR(50),
    course_icon_url VARCHAR(300),
    active TINYINT(1) DEFAULT 1,
    created_at_courses TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users(
    id_users INT PRIMARY KEY AUTO_INCREMENT,
    microsoft_id VARCHAR(255) UNIQUE,
    roles_id INT,
    avatar_users VARCHAR(500),
    name_users VARCHAR(255) NOT NULL,
    email_users VARCHAR(255) NOT NULL UNIQUE,
    active TINYINT(1) DEFAULT 1,
    created_at_users TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role FOREIGN KEY (roles_id) REFERENCES roles(id_roles)
);

CREATE TABLE IF NOT EXISTS user_courses(
    user_id INT,
    course_id INT,
    PRIMARY KEY (user_id, course_id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id_users) ON DELETE CASCADE,
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses (id_courses) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS competency(
    id_competency INT AUTO_INCREMENT PRIMARY KEY,
    name_competency VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    code_competency VARCHAR(10) NOT NULL,
    matriz_competency VARCHAR(50) NOT NULL,
    CONSTRAINT fk_competency_course FOREIGN KEY (course_id) REFERENCES courses(id_courses) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_types (
    id_documentType INT AUTO_INCREMENT PRIMARY KEY,
    name_documentType VARCHAR(30)
);

CREATE TABLE IF NOT EXISTS academic_documents(
    id_academicD INT AUTO_INCREMENT PRIMARY KEY,
    name_academicD VARCHAR(150),
    competency_id INT NOT NULL,
    id_documentType INT NOT NULL,
    matriz_competency VARCHAR(50),
    trimestre ENUM('1ª Trimestre', '2ª Trimestre', '3ª Trimestre', '4ª Trimestre', '1ª Semestre', '2ª Semestre'),
    flag_liberado_customizar BOOLEAN DEFAULT FALSE,
    flag_preenchido BOOLEAN DEFAULT FALSE,
    flag_validacao_coordenacao BOOLEAN DEFAULT FALSE,
    flag_integrado_rm BOOLEAN DEFAULT FALSE,
    flag_disponivel_canva BOOLEAN DEFAULT FALSE,
    flag_necessita_revisao BOOLEAN DEFAULT FALSE,
    flag_em_preenchimento BOOLEAN DEFAULT FALSE,
    drive_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_document_competency FOREIGN KEY (competency_id) REFERENCES competency(id_competency) ON DELETE CASCADE,
    CONSTRAINT fk_document_type FOREIGN KEY (id_documentType) REFERENCES document_types(id_documentType) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id_notification INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    competency_id INT NOT NULL,
    document_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id_users) ON DELETE CASCADE,
    CONSTRAINT fk_notification_competency FOREIGN KEY (competency_id) REFERENCES competency(id_competency) ON DELETE CASCADE,
    CONSTRAINT fk_notification_document FOREIGN KEY (document_id) REFERENCES academic_documents(id_academicD) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_log (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id INT,
    old_value JSON,
    new_value JSON,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id_users) ON DELETE CASCADE
);

CREATE INDEX idx_audit_user    ON audit_log (user_id);
CREATE INDEX idx_audit_entity  ON audit_log (entity, entity_id);
CREATE INDEX idx_audit_action  ON audit_log (action);
CREATE INDEX idx_audit_created ON audit_log (created_at);
