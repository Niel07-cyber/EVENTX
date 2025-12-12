# ☁️ EventX - Cloud Event Management Platform

**Course:** Cloud Computing - Junia  
**Project:** Group Project  
**Date:** December 12, 2025

## 📖 Project Objective

**EventX** is a fully functional, cloud-native event management platform designed to demonstrate modern cloud architecture principles. The application allows users to view events, check ticket availability, and enables administrators to manage the platform via a secure dashboard.

The primary goal of this project was to design, deploy, and document a multi-tier application hosted on Microsoft Azure, with the entire infrastructure defined as code (IaC).

---

## 🏗️ Architecture & Technologies

This project utilizes a **Microservices-style architecture** deployed via Docker containers on Azure App Services.

- **Frontend:** React (Vite) + TypeScript (Served via Nginx)
- **Backend:** Node.js + Express
- **Database:** Azure SQL Database (MSSQL)
- **Infrastructure:** Terraform (IaC)
- **Container Registry:** Azure Container Registry (ACR)
- **Orchestration:** Azure Web Apps for Containers (Linux)

### ⚠️ Note on CI/CD & Student Limitations

While the infrastructure is fully automated via Terraform, a fully automated CI/CD pipeline (using GitHub Actions to deploy infrastructure) was **not implemented**.

**Reason:** We are operating under **Azure Student Subscription** restrictions. Creating a **Service Principal (SP)** with the necessary `Owner` or `Contributor` role assignments required for Terraform to modify resources remotely is restricted/disabled on our student accounts. Therefore, deployment is handled via local Terraform execution and Docker CLI, as documented below.

### Cloud Resources Used

1.  **Resource Group:** Logical container for all resources.
2.  **Azure Container Registry (ACR):** Stores the Docker images for Frontend and Backend.
3.  **App Service Plan (B1):** Linux compute resources hosting the containers.
4.  **Web App (Frontend):** Hosts the React client.
5.  **Web App (Backend):** Hosts the Node.js API.
6.  **Azure SQL Server & Database:** Persists application data.
7.  **Virtual Firewall:** Secures the database to allow access only from Azure services and authorized IPs.

---

## 🚀 Deployment Guide

**⚠️ IMPORTANT FOR EVALUATION:** This project is designed to be re-deployed from a fresh environment. Please follow these steps strictly.

### 1. Prerequisites

Ensure you have the following installed:

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Must be running)
- [Node.js](https://nodejs.org/) (For local database initialization)
- [Git](https://git-scm.com/downloads)

### 2. Clone & Prepare Repository

1.  **Clone the repository:**

    ```bash
    git clone <YOUR_GITHUB_REPO_URL>
    cd <YOUR_REPO_DIRECTORY>
    ```

2.  **Setup Environment Variables:**
    The project includes example configuration files. You need to create the real configuration files for the Client, Server, and Terraform.

    - **Frontend (`frontend/.env`):**

      ```bash
      cp frontend/.env.example frontend/.env
      ```

      _Content:_

      ```env
      VITE_API_URL="your_backend_api_url_here/api"  # You will update this after Terraform runs
      ```

    - **Backend (`backend/.env`):**

      ```bash
      cp backend/.env.example backend/.env
      ```

      _Content:_

      ```env
      PORT=3001
      NODE_ENV=development
      FRONTEND_URL="your_frontend_url_here"

      # Azure SQL Database Credentials (Update these after Terraform runs)
      DB_SERVER="your_database_server.database.windows.net"
      DB_USER="sqladmin"
      DB_PASSWORD="your database password"
      DB_NAME="appdb"
      ```

    - **Terraform (`terraform/terraform.tfvars`):**

      ```bash
      cp terraform/terraform.tfvars.example terraform/terraform.tfvars
      ```

      _Content (Fill this with your real Azure details):_

      ```hcl
      subscription_id    = "YOUR_SUBSCRIPTION_ID"
      project_name       = "juniafullstack"
      location           = "UK South"
      sql_admin_password = "YourStrongPassword123!"
      smtp_user          = "your_email@gmail.com"  # Optional
      smtp_pass          = "your_app_password"     # Optional
      ```

### 3. Infrastructure Setup (Terraform)

1.  **Login to Azure:**

    ```bash
    az login
    ```

2.  **Deploy Infrastructure:**
    Navigate to the `terraform` directory and apply the configuration.

    ```bash
    cd terraform
    terraform init
    terraform apply
    ```

    - Type `yes` when prompted.
    - **Wait** approx. 5-10 minutes.

3.  **Save Outputs:**
    Once finished, keep the terminal open. You will need the **Outputs** (Registry Login Server, Backend URL, etc.) for the next steps.

---

### 4. Build & Publish Containers

The infrastructure is ready, but the apps are empty. We must build the code and push it to the Azure Registry.

⚠️ **IMPORTANT:** Docker Desktop must be running before executing these commands. Start Docker Desktop on your machine.

**1. Login to Registry:**
Use the `acr_login_server` name from the Terraform outputs (e.g., `juniafullstackreg12345`):

````bash
az acr login --name <REGISTRY_NAME_ONLY>

**2. Configure & Build Frontend:**
The Frontend needs to know where the Backend lives **before** it is built.

- Open `frontend/.env` locally.
- Update `VITE_API_URL` using the **Backend URL** from Terraform outputs:

  ```env
  # Example: [https://juniafullstack-api-12345.azurewebsites.net/api](https://juniafullstack-api-12345.azurewebsites.net/api)
  VITE_API_URL=https://<BACKEND_URL_FROM_OUTPUTS>/api
````

- Build and push the frontend:

  ```bash
  cd ../frontend
  # Note: Use the full login server URL (e.g., juniafullstackreg12345.azurecr.io)
  docker build --no-cache -t <ACR_LOGIN_SERVER>/junia-frontend:latest .
  docker push <ACR_LOGIN_SERVER>/junia-frontend:latest
  ```

**3. Build & Push Backend:**

```bash
cd ../backend
docker build -t <ACR_LOGIN_SERVER>/junia-backend:latest .
docker push <ACR_LOGIN_SERVER>/junia-backend:latest
```

**4. Activate the Deployment:**

- Go to the [Azure Portal](https://portal.azure.com).
- Find the **Backend Web App** and click **Restart**.
- Find the **Frontend Web App** and click **Restart**.
- **Wait 1-2 minutes** for containers to pull and start.

---

### 4. Database Initialization

The database is currently empty. You must run the seed script to create tables and default users.

1.  **Whitelist Your IP:**

    - Go to Azure Portal > SQL Server > Networking.
    - Click **"Add your client IPv4 address"** > **Save**.

2.  **Configure Local Script:**

    - Open `backend/.env`.
    - Update `DB_SERVER` to match your new Azure SQL Server (from Terraform outputs).
    - Set `DB_USER` to `sqladmin` (default admin user).
    - Set `DB_PASSWORD` to match the password you defined in `terraform/terraform.tfvars`.

3.  **Run Initialization:**

        ```bash
        cd ../backend
        npm install
        node src/database/init.js
        ```

        - **Success Message:** `

    Initializing MSSQL database...
    ✅ Connected to MSSQL database
    ✅ Users table checked/created
    ✅ Events table checked/created
    ✅ Ticket requests table checked/created
    ✅ Seeded 3 events
    ✅ Seeded default admin user (admin/admin)
    ✅ Database initialized successfully!
    `

---

### 5. Usage Guide

Once deployed, you can access the platform via the **Frontend URL** (provided in Terraform outputs).

- **Public Access:** View the list of available events on the homepage.
- **Admin Access:** Click "Login" to access dashboard features.
  - **User:** `admin`
  - **Password:** `admin`

---

## 🔧 Troubleshooting

- **CORS Errors:** If you see "Network Error" or CORS issues, the Terraform automation usually handles this by setting `FRONTEND_URL`. If it persists, restart the Backend App in the Azure Portal to ensure it picks up the variable.
- **White Screen / 404:** Ensure you rebuilt the Frontend image _after_ updating the `.env` file with the correct Backend URL.
- **Database Connection Failed:** Ensure your current IP address is added to the SQL Server Firewall in the Azure Portal.

---

**Contributors:**

- Godfred Mireku Owusu
- Othniel Nii Aryee
- Michael Agyei-Kane
- Obed Kani
- Kamdem Samira
