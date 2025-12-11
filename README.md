**Follow this process**

## 🚀 Deployment Guide

Follow these steps to deploy the entire stack (Infrastructure + App) to Azure using Terraform and Docker.

### 1. Prerequisites

Ensure you have the following installed and running:

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Terraform](https://developer.hashicorp.com/terraform/install)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be running)

### 2. Infrastructure Setup (Terraform)

1.  **Login to Azure:**

    ```bash
    az login
    ```

2.  **Prepare Secrets:**
    Create a file named `terraform/terraform.tfvars` (do not commit this file) and add your specific configuration:

    ```hcl
    subscription_id    = "YOUR_AZURE_SUBSCRIPTION_ID"
    sql_admin_password = "YourStrongPassword123!"
    location           = "West Europe"
    ```

3.  **Initialize & Apply:**
    Navigate to the `terraform` folder and run:

    ```bash
    cd terraform
    terraform init
    terraform apply
    ```

    - Type `yes` when prompted.
    - **Wait** 5-10 minutes for completion.

4.  **Save Outputs:**
    After Terraform finishes, **copy the Outputs** printed in the terminal (Registry Login Server, Backend URL, Frontend URL). You will need these for the next steps.

---

### 3. Build & Deploy Docker Images

1.  **Login to the Registry:**
    Use the `acr_login_server` name from the Terraform outputs (only the name part, e.g., `juniareg12345`):

    ```bash
    az acr login --name <REGISTRY_NAME_ONLY>
    ```

2.  **Build & Push Backend:**

    ```bash
    cd ../server

    # Replace <ACR_LOGIN_SERVER> with the full URL from terraform output (e.g., juniareg.azurecr.io)
    docker build -t <ACR_LOGIN_SERVER>/junia-backend:latest .
    docker push <ACR_LOGIN_SERVER>/junia-backend:latest
    ```

3.  **Build & Push Frontend:**

    - First, create or update `client/.env` with your **Backend URL**:
      ```env
      VITE_API_URL=https://<BACKEND_APP_NAME>.azurewebsites.net
      ```
    - Then build and push:
      ```bash
      cd ../client
      docker build -t <ACR_LOGIN_SERVER>/junia-frontend:latest .
      docker push <ACR_LOGIN_SERVER>/junia-frontend:latest
      ```

4.  **Restart Web Apps:**
    Go to the [Azure Portal](https://portal.azure.com), find your Backend and Frontend Web Apps, and click **Restart** to ensure they pull the new images immediately.

---

### 4. Initialize Database

Since the database is brand new, it has no tables. You must run the seed script to create them.

1.  Go to the **Azure Portal** and navigate to your **Backend Web App**.
2.  On the left menu, select **Development Tools** > **SSH**.
3.  Click **Go** to open the terminal window.
4.  Run the initialization script:
    ```bash
    node src/init.js
    ```
5.  You should see the message: `✅ Database initialized successfully!`

---

### 5. Verification

- **Backend:** Visit `https://<BACKEND_APP_NAME>.azurewebsites.net/api/events` and check if you see JSON data.
- **Frontend:** Visit `https://<FRONTEND_APP_NAME>.azurewebsites.net` and verify the website loads and displays events.
