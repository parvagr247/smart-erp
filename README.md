# SmartERP - Production Deployment Guide & Configuration Architecture

SmartERP is an enterprise-grade ERP application built on **React (Vite) / TailwindCSS** (Frontend) and **Spring Boot / PostgreSQL / Redis** (Backend). 

This guide details local running, environment configuration, container orchestration, and VM deployment guidelines.

---

## 1. Directory Structure

```text
smart-erp/
├── docker-compose.yml           # Root orchestrator
├── README.md                    # Root documentation
├── smart-erp-backend/           # Spring Boot application
│   ├── .env.example             # Env template for local/compose setup
│   ├── Dockerfile               # Multi-stage Java 21 image
│   └── src/                     
└── smart-erp-frontend/          # React Vite application
    ├── .env.example             # Env template for Vite build
    ├── Dockerfile               # Node compile + Nginx static server image
    ├── nginx.conf               # React routing and reverse-proxy configs
    └── src/
```

---

## 2. Environment Configurations

Both applications retrieve parameters strictly from their respective `.env` files.

### Backend Configurations (`smart-erp-backend/.env`)
Create a `.env` in `smart-erp-backend/` based on `smart-erp-backend/.env.example`:
- `SERVER_PORT`: Default API port (e.g., `9521`).
- `DATABASE_URL`: JDBC url (e.g., `jdbc:postgresql://localhost:5432/smarterp` for local development).
- `DATABASE_USERNAME` / `DATABASE_PASSWORD`: Database credentials.
- `JWT_SECRET`: Base64 key string for signing session JSON Web Tokens.
- `REDIS_HOST` / `REDIS_PORT`: Redis host connection.

### Frontend Configurations (`smart-erp-frontend/.env`)
Create a `.env` in `smart-erp-frontend/` based on `smart-erp-frontend/.env.example`:
- `VITE_API_BASE_URL`: Base API endpoint (e.g., `http://localhost:9521/api/v1` for local running).
- `VITE_ENABLE_KEYBOARD_MODE`: Enable keyboard accessibility triggers.

*Note: Never commit `.env` files to git repositories. Only the `.env.example` templates remain tracked.*

---

## 3. Local Development (No Docker)

### Step A: Infrastructure Setup
Ensure you have a local PostgreSQL instance running (with database name `smarterp`) and a Redis server running on `localhost:6379`.

### Step B: Run Spring Boot Backend
1. Copy `smart-erp-backend/.env.example` to `smart-erp-backend/.env` and adjust database credentials.
2. In `smart-erp-backend/`:
   ```bash
   # Build the project
   mvn clean install
   # Run application
   mvn spring-boot:run
   ```

### Step C: Run React Frontend
1. Copy `smart-erp-frontend/.env.example` to `smart-erp-frontend/.env`.
2. In `smart-erp-frontend/`:
   ```bash
   # Install dependencies
   npm install
   # Launch hot-reload dev server
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 4. Multi-Container Orchestration (Docker Compose)

Launch the entire service ecosystem (Frontend, Backend, PostgreSQL database, and Redis cache) using a single command:

1. Create `smart-erp-backend/.env` and `smart-erp-frontend/.env` with appropriate values.
2. Run in the root directory:
   ```bash
   docker compose up -d --build
   ```
3. Docker Compose will:
   - Configure PostgreSQL container with volume persistence.
   - Configure Redis container.
   - Compile and build Spring Boot JAR, then spin it up on the container network.
   - Build frontend assets, bundle Nginx, and expose Port `80` (accessible at `http://localhost`).

---

## 5. Google Cloud VM Production Deployment

Follow these guidelines to deploy SmartERP on a single Google Cloud Platform Ubuntu Virtual Machine:

### Step 1: VM Provisioning & Firewall Configuration
1. Spin up an **e2-medium** or **e2-standard-2** VM instance with **Ubuntu 22.04 LTS**.
2. Configure GCP firewall rules to allow ports `80` (HTTP) and `443` (HTTPS) inbound traffic.

### Step 2: Install Docker Ecosystem
Run the following commands on the Ubuntu shell:
```bash
sudo apt update && sudo apt upgrade -y
# Install Docker
sudo apt install docker.io -y
sudo systemctl enable --now docker
# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 3: Setup Application
1. Clone the project repository on the VM.
2. Populate the production `.env` files:
   - Run `nano smart-erp-backend/.env` and specify strong database passwords and a random 256-bit JWT secret.
   - Run `nano smart-erp-frontend/.env` and set `VITE_API_BASE_URL` to your production domain name (e.g. `https://yourdomain.com/api/v1` or public IP).
3. Start the containers:
   ```bash
   sudo docker-compose up -d --build
   ```

### Step 4: Reverse Proxy & HTTPS Certification (Certbot)
To secure the application with SSL:
1. Install Nginx on the host OS as a reverse proxy:
   ```bash
   sudo apt install nginx -y
   ```
2. Create site config `/etc/nginx/sites-available/smarterp`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:80;  # Redirects to Frontend Container
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```
3. Enable configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/smarterp /etc/nginx/sites-enabled/
   sudo systemctl restart nginx
   ```
4. Obtain Free Let's Encrypt certificates:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 6. CI/CD Integration (Jenkins Ready)

In a production environment, Jenkins can automate pull requests, image rebuilds, and rolling updates.

### Sample Declarative Jenkinsfile
Add this workflow to your Jenkins project config:
```groovy
pipeline {
    agent any

    stages {
        stage('Pull Changes') {
            steps {
                git branch: 'main', url: 'git@github.com:your-repo/smart-erp.git'
            }
        }
        
        stage('Environment Audit') {
            steps {
                // Ensure production .env files are populated on the build agent
                sh 'test -f smart-erp-backend/.env || echo "Backend .env missing!"'
                sh 'test -f smart-erp-frontend/.env || echo "Frontend .env missing!"'
            }
        }

        stage('Docker Rebuild & Deploy') {
            steps {
                // Perform a zero-downtime rolling update via docker-compose
                sh 'docker-compose down'
                sh 'docker-compose up -d --build'
            }
        }
    }
}
```
