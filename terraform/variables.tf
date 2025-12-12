variable "subscription_id" {
  type        = string
  description = "Azure Subscription ID"
}

variable "project_name" {
  type        = string
  description = "Base name for resources"
  default     = "juniafullstack"
}

variable "location" {
  type        = string
  description = "Azure Region"
  default     = "France Central"
}

variable "sql_admin_password" {
  type        = string
  description = "Password for SQL Server"
  sensitive   = true
}

variable "smtp_user" {
  type        = string
  description = "Email address for sending mails"
  sensitive   = true
}

variable "smtp_pass" {
  type        = string
  description = "App password for the email"
  sensitive   = true
}