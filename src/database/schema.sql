#aquela parada de remover usuario, ou permitir marcar como concluido a integra��o do RM.

CREATE TABLE permissions (
    id_permissions INT AUTO_INCREMENT PRIMARY KEY,
    name_permissions VARCHAR(50)
);

CREATE TABLE roles(
    id_roles INT AUTO_INCREMENT PRIMARY KEY,
    name_roles VARCHAR(50)
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
    name_courses VARCHAR(255),
    matrix_courses VARCHAR(50),
    created_at_courses TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    course_icon_url VARCHAR(300)

);

CREATE TABLE users(
    id_users INT PRIMARY KEY AUTO_INCREMENT,
    microsoft_id VARCHAR(255) UNIQUE, #microsoft usa um UUID.
    roles_id INT,
    avatar_users VARCHAR(500), #validar se o avatar enviado da microsoft é link

    name_users VARCHAR(255) NOT NULL,
    email_users VARCHAR(255) NOT NULL UNIQUE,
    created_at_users TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_role FOREIGN KEY (roles_id) REFERENCES roles(id_roles)
);

CREATE TABLE user_courses(
    user_id   INT,
    course_id INT,
    PRIMARY KEY (user_id, course_id),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id_users) ON DELETE CASCADE ,
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses (id_courses) ON DELETE CASCADE
);

CREATE TABLE competency(
    id_competency INT AUTO_INCREMENT PRIMARY KEY,
    name_competency VARCHAR(255) NOT NULL,
    course_id INT NOT NULL,
    code_competency VARCHAR(10) NOT NULL,
    matriz_competency VARCHAR(50) NOT NULL, 

    CONSTRAINT fk_competency_course FOREIGN KEY (course_id) REFERENCES courses(id_courses) ON DELETE CASCADE
);
CREATE TABLE document_types (
    id_documentType INT AUTO_INCREMENT PRIMARY KEY,
    name_documentType VARCHAR(30)
);

CREATE TABLE academic_documents(
    id_academicD INT AUTO_INCREMENT PRIMARY KEY,
    name_academicD VARCHAR(150),
    competency_id INT NOT NULL,
    id_documentType INT NOT NULL,-- faz sentido para mim colocar uma tabela separada, e se o planner no futuro mudar de nome?

    matriz VARCHAR(20),      -- Ex: 'Matriz - 62'
    trimestre ENUM('1ª Trimestre', '2ª Trimestre', '3ª Trimestre', '4ª Trimestre'),

    flag_liberado_customizar BOOLEAN DEFAULT FALSE,
    flag_preenchido BOOLEAN DEFAULT FALSE,
    flag_validacao_coordenacao BOOLEAN DEFAULT FALSE,
    flag_integrado_rm BOOLEAN DEFAULT FALSE,
    flag_disponivel_canva BOOLEAN DEFAULT FALSE,

    drive_link VARCHAR(500), -- Link do arquivo no Google Drive/OneDrive

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_document_competency FOREIGN KEY (competency_id) REFERENCES competency(id_competency) ON DELETE CASCADE,
    CONSTRAINT fk_document_type FOREIGN KEY (id_documentType) REFERENCES document_types(id_documentType) ON DELETE CASCADE
);

# THE GREAT ROLLBACK

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