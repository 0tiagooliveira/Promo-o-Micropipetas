# Guia de Implantação e Deploy em VPS Self-Hosted - Ionlab Promo

Este documento descreve os passos para instalar e rodar a aplicação **Ionlab Promo & Painel Administrativo de Tracking** em uma VPS própria (Ubuntu/Debian) utilizando Docker Compose ou PM2 + Nginx + PostgreSQL.

---

## Opção 1: Deploy Rápido via Docker Compose (Recomendado)

### 1. Requisitos na VPS
- Docker e Docker Compose instalados (`sudo apt update && sudo apt install docker.io docker-compose-plugin`)

### 2. Passos de Deploy
```bash
# Clone seu repositório no seu servidor VPS
git clone <URL_DO_SEU_REPOSITORIO> /var/www/ionlab-promo
cd /var/www/ionlab-promo/vps

# Inicie os contêineres da aplicação e banco PostgreSQL
docker compose up -d --build

# Verifique o status dos serviços
docker compose ps
```

---

## Opção 2: Deploy Nativo via PM2, Nginx e PostgreSQL

### 1. Instalação de Dependências no Ubuntu/Debian
```bash
# Instalar Node.js 20 LTH, PM2 e Nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx postgresql postgresql-contrib
sudo npm install -g pm2 tsx
```

### 2. Configurar Banco de Dados PostgreSQL
```bash
# Acessar o postgres
sudo -u postgres psql

# Criar banco de dados e usuário
CREATE DATABASE ionlab_promo;
CREATE USER ionlab_user WITH PASSWORD 'SuaSenhaSegura123!';
GRANT ALL PRIVILEGES ON DATABASE ionlab_promo TO ionlab_user;
\q

# Executar a estrutura das tabelas
psql -U ionlab_user -d ionlab_promo -f vps/postgres_schema.sql
```

### 3. Build e PM2 Server
```bash
cd /var/www/ionlab-promo
npm install
npm run build

# Iniciar aplicação com PM2
pm2 start vps/ecosystem.config.cjs
pm2 save
pm2 startup
```

### 4. Configurar Nginx e Certificado SSL Gratuito (Certbot)
```bash
# Copiar arquivo de Nginx
sudo cp vps/nginx.conf /etc/nginx/sites-available/ionlab-promo
sudo ln -s /etc/nginx/sites-available/ionlab-promo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Instalar Certbot para HTTPS Gratuito
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d promo.ionlab.com.br
```

---

## Recursos do Sistema e APIs de Tracking Ativas
- **Página Principal (Loja):** `https://promo.ionlab.com.br/`
- **Painel Administrativo:** Acessível via botão "Painel Tracking Admin" no topo ou via footer.
- **Roteamento de Vendedores por DDD:** Atribuição dinâmica baseada nos DDDs brasileiros.
- **Modo de Teste:** Alternador de um clique para direcionar alertas apenas para `marketing.ionlab@gmail.com`.
