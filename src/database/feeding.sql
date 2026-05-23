USE estudos_sistemas;

INSERT INTO permissions (name_permissions) VALUES
('CREATE_USER'),
('READ_ALL'),
('CRIAR_CURSO'),
('UPDATE_CURSO'),
('DEACTIVATE_COURSE'),

('CRIAR_COMPETENCIA'),
('UPDATE_COMPETENCIA'),
('DEACTIVATE_COMPETENCIA'),

('CRIAR_TIPO_DE_DOCUMENTO'),
('UPDATE_TIPO_DOCUMENTO'),
('DEACTIVATE_TIPO_DOCUMENTO'),

('CRIAR_DOCUMENTO'),
('UPDATE_DOCUMENT'),
('DEACTIVATE_DOCUMENT'),

('FLAG_PREENCHIDO'),
('FLAG_VALIDADO_COORDENACAO'),
('FLAG_VALIDADO_GESTAO'),
('FLAG_MODELO_PRONTO'),
('FLAG_INTEGRADO_CANVAS'),

('MANAGE_LINKS_DRIVE'),

('ASSIGN_USER_COURSE'),

('MANAGE_PERMISSIONS'),
('DEACTIVATE_USER');

INSERT INTO roles (name_roles) VALUES
('ADMIN'),
('NITE'),
('COORDINATOR'),
('TEACHER');

INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 4, id_permissions
FROM permissions
WHERE name_permissions IN (
    'READ_ALL',
    'FLAG_PREENCHIDO'
);

INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 3, id_permissions
FROM permissions
WHERE name_permissions IN (
    'READ_ALL',
    'CRIAR_COMPETENCIA',
    'UPDATE_COMPETENCIA',
    'FLAG_PREENCHIDO',
    'FLAG_VALIDADO_COORDENACAO'
);

INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 2, id_permissions
FROM permissions
WHERE name_permissions IN (
    'READ_ALL',

    'CRIAR_CURSO',
    'UPDATE_CURSO',

    'CRIAR_COMPETENCIA',
    'UPDATE_COMPETENCIA',

    'CRIAR_TIPO_DE_DOCUMENTO',
    'UPDATE_TIPO_DOCUMENTO',

    'CRIAR_DOCUMENTO',
    'UPDATE_DOCUMENT',

    'FLAG_PREENCHIDO',
    'FLAG_VALIDADO_COORDENACAO',
    'FLAG_VALIDADO_GESTAO',
    'FLAG_MODELO_PRONTO',
    'FLAG_INTEGRADO_CANVAS',

    'MANAGE_LINKS_DRIVE',

    'ASSIGN_USER_COURSE'
);

INSERT INTO roles_permissions (roles_id, permissions_id)
SELECT 1, id_permissions
FROM permissions;

INSERT INTO document_types (
    name_documentType
) VALUES
('planner'),
('planner_educacional'),
('mapa_avaliativo'),
('plano_ensino');

INSERT INTO courses (
    name_courses,
    launch_date_courses,
    course_icon_url
) VALUES
(
    'Análise e Desenvolvimento de Sistemas',
    NOW(),
    'https://example.com/icons/ads.png'
),
(
    'Ciência da Computação',
    NOW(),
    'https://example.com/icons/cc.png'
);

INSERT INTO audit_logs (
    table_name,
    record_id,
    action_type,
    new_data
)
VALUES
(
    'system',
    0,
    'CREATE',
    JSON_OBJECT(
        'message',
        'Sistema inicializado com seed padrão'
    )
);