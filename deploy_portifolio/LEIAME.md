# Explicação, bê-á-bá
Ele precisa do .env do backend aqui também para funcionar, estou executando e aplicando as funções diretamente no docker. Tanto o "seed" que chamei de feeding do banco, quanto outras funções!

Se for de sua vontade fazer o deploy em um servidor copie está pasta para fora dos arquivos do front-end e backend! Estou deixando aqui para salvar no github e caso haja futuros deploys (com o cloudflare (serviço gratuito)).

Algo como:

```
$HOME/
    Front-End/
    Back-End/
    Deploy/
``` 

Sendo o $HOME o diretório de **execução ou raiz**. 

## Como rodar o deploy 

O Docker já sobe tudo (Banco, Back, Front e o Túnel da Cloudflare). 

1. Lembre de colocar o `.env` aqui na pasta de deploy também.
2. Rode o comando:
   ```bash
   docker-compose up --build
   ```
3. O terminal vai gerar um link da Cloudflare (vai aparecer um `hash-aleatoria.trycloudflare.com`).
4. **Para ver o site:** acesse esse link direto.
5. **Para ver a documentação (Swagger):** coloque `/api-docs` no final do link.

O banco de dados também já é criado e populado sozinho pelo Docker.