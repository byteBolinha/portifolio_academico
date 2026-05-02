USE estudos_sistemas;

INSERT INTO permissions (name_permissions) VALUES
('CREATE_COURSE'), #1 1
('DELETE_COURSE'), #2 1
('VALIDATE_COORDINATION'), #3 3
('COMPLETE_RM_INTEGRATION'), #4 2
('FILL_PLANNER'), #5 3
('FILL_TEACHING_PLAN'), #6 4
('RELEASE_CUSTOMIZATION'), #7 2+3
('VIEW_ALL'), # 8 1+2+3+4
('MANAGE_USERS'); #9 1
SELECT * FROM permissions;



INSERT INTO roles (name_roles) VALUES
('ADMIN'), #1
('NITE'), #2
('COORDINATOR'),#3
('TEACHER'); #4
SELECT * FROM roles;



INSERT INTO roles_permissions VALUES
(1,1),
(1,2),
(3,3),
(2,4),
(3,5),
(4,6),
(2,7),
(3,7),
(1,8),
(2,8),
(3,8),
(4,8),
(1,9);
SELECT * FROM roles_permissions;