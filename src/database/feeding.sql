USE estudos_sistemas;

/*
 Alimentar as tabelas com permissões primarias entregando ao backend o mínimo para trabalhar com o
 RBAC.
 */
INSERT INTO permissions (name_permissions) VALUES
('READ_ALL'),                
('CRIAR_CURSO'),              
('CRIAR_COMPETENCIA'),      
('FLAG_PREENCHIDO'),         
('FLAG_AVALIADO_COORD'),     
('FLAG_AVALIADO_GESTAO'),    
('FLAG_CANVAS_INTEGRATION'),  
('MANAGE_LINKS_DRIVE'),      
('MANAGE_PERMISSIONS');

SELECT * FROM permissions;

INSERT INTO roles (name_roles) VALUES
('ADMIN'),        -- #1: Autoridade total e gestão de permissões 
('NITE'),         -- #2: Autoridade para todas as etapas e criação
('COORDINATOR'),  -- #3: Autoridade para preenchimento e coordenação
('TEACHER');      -- #4: Autoridade apenas para preenchimento

SELECT * FROM roles;

-- Permissões do TEACHER (#4)
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(4, 1), 
(4, 4); 

-- Permissões do COORDINATOR (#3)
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(3, 1),
(3, 3), 
(3, 4), 
(3, 5); 

-- Permissões do NITE (#2)
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(2, 1), 
(2, 2), 
(2, 3), 
(2, 4), 
(2, 5), 
(2, 6), 
(2, 7), 
(2, 8); 

-- Permissões do ADMIN (#1)
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(1, 1), 
(1, 2), 
(1, 3), 
(1, 4), 
(1, 5), 
(1, 6), 
(1, 7), 
(1, 8), 
(1, 9); 

SELECT * FROM roles_permissions;

-- Necessidades pontuais / Rafael.

INSERT INTO permissions (name_permissions) VALUES
('CRIAR_TIPO_DE_DOCUMENTO');
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(2, 10);

INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(1, 10);

INSERT INTO permissions (name_permissions) VALUES('LIBERAR_CUSTOMIZACAO');
INSERT INTO permissions (name_permissions) VALUES('DELET_DOCUMENT')

-- Mudar o nome da coluna para matrix_courses, pois deu conflito no back e no front / Lavinia.
ALTER TABLE courses
CHANGE matrix_courses VARCHAR(50);
