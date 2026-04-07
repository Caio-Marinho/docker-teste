# Projeto Docker Teste

Este é um projeto de teste para Docker que demonstra a integração de um frontend, backend, banco de dados MySQL e um proxy reverso Nginx usando `docker-compose`.

## O que é este projeto?

- Um exemplo simples de aplicação em contêineres.
- Backend em Flask que expõe uma API de usuários em `/users`.
- Frontend estático que consome a API e exibe os usuários.
- Banco de dados MySQL para armazenar os usuários.
- Nginx como proxy reverso para atender o frontend e encaminhar chamadas `/api/` ao backend.

## Funcionalidades

- Criação de usuários via formulário no frontend.
- Listagem de usuários retornados pela API `/api/users`.
- Lista de tarefas local no frontend para demonstração de interação no navegador.
- Configuração de múltiplos serviços dockerizados.

## Como usar

1. Abra um terminal no diretório do projeto.
2. Certifique-se de que o Docker Engine esteja em execução antes de rodar qualquer comando.
   - No Windows, abra o Docker Desktop e aguarde até o ícone indicar que o Docker está pronto.
   - No Linux, use `sudo systemctl start docker` se necessário.

> ⚠️ O `docker-compose` só funcionará se o Docker já estiver ativo.

3. Execute o comando abaixo para iniciar todos os serviços com Docker Compose:

```bash
docker-compose up --build
```

4. Acesse `http://localhost` no navegador.
5. Use o formulário para criar novos usuários e veja a lista de usuários atualizada.

> ⚠️ Este projeto está sendo testado pelo Nginx como proxy reverso. Se quiser expor externamente depois, você pode usar `ngrok` ou outra ferramenta.

## Parar e limpar recursos Docker

- Parar os containers e a rede:

```bash
docker-compose down
```

- Parar e remover containers, redes, volumes e imagens criadas pelo Compose:

```bash
docker-compose down --volumes --rmi all
```

- Limpar espaço adicional do Docker (use com cuidado, pois remove imagens e volumes não utilizados):

```bash
docker system prune -a --volumes
```

## Instalação do Docker

- Windows: instale o Docker Desktop em `https://www.docker.com/get-started`

- Linux (Debian/Ubuntu):

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable --now docker
```

- Linux (Fedora/CentOS/RHEL): substitua o gerenciador de pacotes e instale `docker` e `docker-compose-plugin` com `dnf`.

> ⚠️ Lembre-se: o comando exato depende da sua distribuição Linux. O exemplo acima vale para Debian/Ubuntu.

## Tecnologias usadas

- Docker
- Docker Compose
- Python
- Flask
- MySQL
- Nginx
- HTML / JavaScript

## Autor

- [Caio Marinho](https://github.com/Caio-Marinho)
