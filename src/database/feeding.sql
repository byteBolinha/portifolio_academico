USE estudos_sistemas;

/*
 Alimentar as tabelas com permissões primarias entregando ao backend o mínimo para trabalhar com o
 RBAC.
 */
INSERT INTO permissions (name_permissions) VALUES
('LISTAR_COURSES'), #1 1
('REMOVER_COURSES'), #2 1
('CRIAR_COURSES'), #3 2
('COMPLETE_RM_INTEGRATION'), #4 1
('FILL_PLANNER'), #5 2
('FILL_TEACHING_PLAN'), #6 3
('RELEASE_CUSTOMIZATION'), #7 1+2
('VIEW_ALL'), # 8 1+2+3
('MANAGE_USERS'); #9 1
SELECT * FROM permissions;


INSERT INTO roles (name_roles) VALUES
('NITE'), #1
('COORDINATOR'),#2
('TEACHER'); #3
SELECT * FROM roles;

SELECT * FROM roles_permissions;