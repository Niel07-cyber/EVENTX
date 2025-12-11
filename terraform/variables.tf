variable "subscription_id" {
  description = "The Azure Subscription ID"
  type        = string
}

variable "location" {
  description = "The Azure Region"
  type        = string
  default     = "France Central"
}

variable "project_name" {
  description = "The name prefix for your resources"
  type        = string
  default     = "juniafullstack" 
}

variable "sql_admin_password" {
  description = "Password for the SQL Database"
  type        = string
  sensitive   = true
}