# 1. Random Integer
resource "random_integer" "ri" {
  min = 10000
  max = 99999
}

# 2. Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-rg"
  location = var.location
}

# 3. Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "${var.project_name}reg${random_integer.ri.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

# 4. SQL Server
resource "azurerm_mssql_server" "sqlserver" {
  name                         = "${var.project_name}-sql-${random_integer.ri.result}"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = "sqladmin"
  administrator_login_password = var.sql_admin_password # Secured via variable
}

# 5. SQL Database
resource "azurerm_mssql_database" "sqldb" {
  name                 = "appdb"
  server_id            = azurerm_mssql_server.sqlserver.id
  sku_name             = "Basic"
  storage_account_type = "Local"
}

# 6. Firewall Rule
resource "azurerm_mssql_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sqlserver.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# 7. App Service Plan
resource "azurerm_service_plan" "asp" {
  name                = "${var.project_name}-plan"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# 8. Backend Web App
resource "azurerm_linux_web_app" "backend" {
  name                = "${var.project_name}-api-${random_integer.ri.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.asp.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      docker_image_name        = "junia-backend:latest"
      docker_registry_url      = "https://${azurerm_container_registry.acr.login_server}"
      docker_registry_username = azurerm_container_registry.acr.admin_username
      docker_registry_password = azurerm_container_registry.acr.admin_password
    }
  }

  app_settings = {
    # Database Settings
    "DB_SERVER" = azurerm_mssql_server.sqlserver.fully_qualified_domain_name
    "DB_USER"   = "sqladmin"
    "DB_PASS"   = var.sql_admin_password
    "DB_NAME"   = azurerm_mssql_database.sqldb.name
    
    # App Settings
    "WEBSITES_PORT" = "3001"
    "NODE_ENV"      = "production"
    "FRONTEND_URL" = "https://${var.project_name}-client-${random_integer.ri.result}.azurewebsites.net"
    # Email Settings (Injected from tfvars)
    "SMTP_HOST"     = "smtp.gmail.com"
    "SMTP_PORT"     = "587"
    "SMTP_SECURE"   = "false"
    "SMTP_USER"     = var.smtp_user
    "SMTP_PASS"     = var.smtp_pass
    "FROM_EMAIL"    = "EventX Admin <${var.smtp_user}>"
  }
}

# 9. Frontend Web App
resource "azurerm_linux_web_app" "frontend" {
  name                = "${var.project_name}-client-${random_integer.ri.result}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.asp.location
  service_plan_id     = azurerm_service_plan.asp.id

  site_config {
    application_stack {
      docker_image_name        = "junia-frontend:latest"
      docker_registry_url      = "https://${azurerm_container_registry.acr.login_server}"
      docker_registry_username = azurerm_container_registry.acr.admin_username
      docker_registry_password = azurerm_container_registry.acr.admin_password
    }
  }

  app_settings = {
    "WEBSITES_PORT" = "80"
    # Points to the Backend App created above
    "VITE_API_URL"  = "https://${azurerm_linux_web_app.backend.default_hostname}"
  }
}