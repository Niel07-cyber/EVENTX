output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
  description = "The address of your Docker Registry (The Garage)"
}

output "acr_username" {
  value = azurerm_container_registry.acr.admin_username
  sensitive = true
}

output "backend_app_name" {
  value = azurerm_linux_web_app.backend.name
}

output "frontend_app_name" {
  value = azurerm_linux_web_app.frontend.name
}

output "backend_url" {
  value = azurerm_linux_web_app.backend.default_hostname
}

output "frontend_url" {
  value = azurerm_linux_web_app.frontend.default_hostname
}