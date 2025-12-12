output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "acr_username" {
  value     = azurerm_container_registry.acr.admin_username
  sensitive = true
}


output "backend_url" {
  value = azurerm_linux_web_app.backend.default_hostname
}

output "sql_server_fqdn" {
  value = azurerm_mssql_server.sqlserver.fully_qualified_domain_name
}


output "frontend_url" {
  value = azurerm_linux_web_app.frontend.default_hostname
}