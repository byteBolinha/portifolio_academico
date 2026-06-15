SET NAMES 'utf8mb4';
USE estudos_sistemas;

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
('DELET_DOCUMENT'),
('MANAGE_PERMISSIONS'),
('CRIAR_TIPO_DE_DOCUMENTO'),
('ASSIGN_USER_COURSE'),
('DEACTIVE_USER'),
('DELETE_COURSE');

INSERT INTO roles (name_roles) VALUES
('ADMIN'),
('NITE'),
('COORDINATOR'),
('TEACHER');

-- Permissões do ADMIN (Role 1) - Todas
INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 1, id_permissions FROM permissions;

-- Permissões do NITE (Role 2)
INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 2, id_permissions FROM permissions WHERE name_permissions NOT IN ('MANAGE_PERMISSIONS', 'DEACTIVE_USER', 'DELETE_COURSE');

-- Permissões do COORDINATOR (Role 3)
INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 3, id_permissions FROM permissions WHERE name_permissions IN ('READ_ALL', 'CRIAR_COMPETENCIA', 'EM_PREENCHIMENTO', 'FLAG_PREENCHIDO', 'FLAG_AVALIADO_COORD', 'NECESSITA_REVISAO');

-- Permissões do TEACHER (Role 4)
INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 4, id_permissions FROM permissions WHERE name_permissions IN ('READ_ALL', 'EM_PREENCHIMENTO', 'FLAG_PREENCHIDO');

INSERT INTO document_types (name_documentType) VALUES
('Planner'),
('Plano de Ensino');
