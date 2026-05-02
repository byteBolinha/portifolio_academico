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
    data_lancamento_courses DATE,
    lancado_no_sistema_courses DATE DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE users(
    id_users INT PRIMARY KEY AUTO_INCREMENT,
    microsoft_id VARCHAR(255) UNIQUE, #microsoft usa um UUID.
    roles_id INT,

    name_users VARCHAR(255) NOT NULL,
    email_users VARCHAR(255) NOT NULL UNIQUE,
    created_at_users TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_role FOREIGN KEY (roles_id) REFERENCES roles(id_roles)
);

CREATE TABLE user_courses(
    user_id   INT,
    course_id INT,
    PRIMARY KEY (user_id, course_id),

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id_users),
    CONSTRAINT fk_course FOREIGN KEY (course_id) REFERENCES courses (id_courses)
);