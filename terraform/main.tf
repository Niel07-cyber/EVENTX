# 1. Random Integer (To ensure unique names globally)
resource "random_integer" "ri" {
  min = 10000
  max = 99999
}

# 2. Resource Group (The "Box" for all resources)
resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-rg"
  location = var.location
}

# 3. Azure Container Registry (The "Garage" for Docker images)
resource "azurerm_container_registry" "acr" {
  name                = "${var.project_name}reg${random_integer.ri.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true # Key: Allows the Web Apps to log in easily
}

# 4. SQL Server (Logical Server)
resource "azurerm_mssql_server" "sqlserver" {
  name                         = "${var.project_name}-sql-${random_integer.ri.result}"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = "sqladmin"
  administrator_login_password = var.sql_admin_password
}

# 5. SQL Database (The actual DB)
resource "azurerm_mssql_database" "sqldb" {
  name      = "appdb"
  server_id = azurerm_mssql_server.sqlserver.id
  sku_name  = "Basic"
}

# 6. SQL Firewall (Allow Azure services to talk to DB)
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sqlserver.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# 7. App Service Plan (The Hardware/Computer for both apps)
resource "azurerm_service_plan" "asp" {
  name                = "${var.project_name}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1" # B1 is "Basic" - good for Docker
}

# 8. Backend Web App (Docker)
resource "azurerm_linux_web_app" "backend" {
  name                = "${var.project_name}-api-${random_integer.ri.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.asp.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      # This points to the image you WILL upload later
      docker_image_name        = "junia-backend:latest"
      docker_registry_url      = "https://${azurerm_container_registry.acr.login_server}"
      docker_registry_username = azurerm_container_registry.acr.admin_username
      docker_registry_password = azurerm_container_registry.acr.admin_password
    }
  }

  app_settings = {
    # DATABASE CREDENTIALS INJECTION
    "DB_SERVER" = azurerm_mssql_server.sqlserver.fully_qualified_domain_name
    "DB_USER"   = "sqladmin"
    "DB_PASS"   = var.sql_admin_password
    "DB_NAME"   = azurerm_mssql_database.sqldb.name
    
    # PORT MATCHING (Your Dockerfile exposes 3001)
    "WEBSITES_PORT" = "3001"
  }
}

# 9. Frontend Web App (Docker)
resource "azurerm_linux_web_app" "frontend" {
  name                = "${var.project_name}-client-${random_integer.ri.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.asp.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      # This points to the image you WILL upload later
      docker_image_name        = "junia-frontend:latest"
      docker_registry_url      = "https://${azurerm_container_registry.acr.login_server}"
      docker_registry_username = azurerm_container_registry.acr.admin_username
      docker_registry_password = azurerm_container_registry.acr.admin_password
    }
  }

  app_settings = {
    # PORT MATCHING (Nginx listens on 80)
    "WEBSITES_PORT" = "80"
  }
}