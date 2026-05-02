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

## tabela de permissões que eu estou trabalhando:
Lembrar que cada um em seu curso, objeto referenciando o curso. O sistema não tem ainda, mas tem que ter uma estrutura de salvar e adicionar vários cursos por vez. Explicar para o demandante o que é preciso para que seja feita uma fast config, ou seja, entrou usou o sistema e pode configurar (quase exportar tudo uma única vez).

| Ação | admin | nite | coordenador | professor |
|---|---|---|---|---|
|preencher planner|sim|não|sim|não|
|preencher planner(ensino)|sim|não|não|sim|
|validar coordenação|sim|não|sim|não|
|marcar canvas/rm|sim|sim|não|não|
|liberar para customizar|sim|sim|sim|não|
|ver tudo|sim|sim|sim|sim|
|gerenciar usuarios|sim|não|não|não|
|criar curso|sim|não|não|não|
|remover curso|sim|não|não|não|