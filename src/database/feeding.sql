USE estudos_sistemas;

/*
 Alimentar as tabelas com permissões primarias entregando ao backend o mínimo para trabalhar com o
 RBAC.
 */
INSERT INTO permissions (name_permissions) VALUES
('READ_ALL'),
('CRIAR_CURSO'),
('CRIAR_COMPETENCIA'),

('EM_PREENCHIMENTO'),
('FLAG_PREENCHIDO'),
('FLAG_AVALIADO_COORD'),
('NECESSITA_REVISAO'),
('FLAG_AVALIADO_GESTAO'),
('LIBERAR_CUSTOMIZACAO'),
('FLAG_CANVAS_INTEGRATION'),
('RM_INTEGRATE'),

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
(4, 1), -- READ_ALL
(4, 4), -- EM_PREENCHIMENTO
(4, 5); -- FLAG_PREENCHIDO

-- Permissões do COORDINATOR (#3)
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(3, 1), -- READ_ALL
(3, 4), -- EM_PREENCHIMENTO
(3, 5), -- FLAG_PREENCHIDO
(3, 6), -- FLAG_AVALIADO_COORD
(3, 7);  -- NECESSITA_REVISAO


-- Permissões do NITE (#2)
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(2, 1),  -- READ_ALL
(2, 2),  -- CRIAR_CURSO
(2, 3),  -- CRIAR_COMPETENCIA
(2, 4),  -- EM_PREENCHIMENTO
(2, 5),  -- FLAG_PREENCHIDO
(2, 6),  -- FLAG_AVALIADO_COORD
(2, 7),  -- NECESSITA_REVISAO
(2, 8),  -- FLAG_AVALIADO_GESTAO
(2, 9),  -- LIBERAR_CUSTOMIZACAO
(2, 10), -- FLAG_CANVAS_INTEGRATION
(2, 11); -- RM_INTEGRATE

-- Permissões do ADMIN (#1)
INSERT INTO roles_permissions (roles_id, permissions_id) VALUES
(1, 1),   -- READ_ALL
(1, 2),   -- CRIAR_CURSO
(1, 3),   -- CRIAR_COMPETENCIA
(1, 4),   -- EM_PREENCHIMENTO
(1, 5),   -- FLAG_PREENCHIDO
(1, 6),   -- FLAG_AVALIADO_COORD
(1, 7),   -- NECESSITA_REVISAO
(1, 8),   -- FLAG_AVALIADO_GESTAO
(1, 9),   -- LIBERAR_CUSTOMIZACAO
(1, 10),  -- FLAG_CANVAS_INTEGRATION
(1, 11),  -- RM_INTEGRATE
(1, 12),  -- MANAGE_LINKS_DRIVE
(1, 13);  -- MANAGE_PERMISSIONS

SELECT * FROM roles_permissions;

INSERT INTO document_types (name_documentType)
VALUES
('Planner'),
('Plano de Ensino');

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
