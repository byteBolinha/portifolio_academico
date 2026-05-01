# Por hora esse arquivo vai ser nosso dossie!

Estou buscando estruturar conformes alguns links abaixos e conceitos:

1. [RBAC 0Auth](https://auth0.com/pt/intro-to-iam/what-is-role-based-access-control-rbac);

2. connection pool; Evitar fechar e abrir conexões com o banco, então fazemos uma pool; [leia mais aqui](https://www.geeksforgeeks.org/node-js/how-to-use-connection-pooling-with-mysql-in-nodejs/)

A diferença primordial (2) é que teriamos que fechar e abrir conexão por requisição, com a POOL não. 

## Contexto
Estava sofrendo e estou um pouco para as questões de permissões, então estava procurando soluções rápidas e fácil de "tercerizar isso ao usuário". 

Nesse caso o que o RBAC faz é **CONTROLE DE ACESSO BASEADO EM FUNÇÕES**. Leiam o link (1) para estarmos no mesmo pé de igualdade de conhecimento. 

Swagger iniciado(apenas para lembrar de fazer), o grupo do front vai ter uma facilidade grande em desenvolver puxando as rotas documentadas. [swagger aqui](./src/config/swagger.js)

**Microsoft tem seu próprio JWT pelo SSO**, porém ainda planejo criar o nosso, em minha percepção faz sentido e é mais flexível.

Lógica de usuário é meio abstrato, possivelmente pela falta de experiência.