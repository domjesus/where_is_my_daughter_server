variable "do_token" {
  description = "DigitalOcean API Token"
  sensitive   = true
}

variable "region" {
  description = "DigitalOcean region"
  default     = "nyc3"
}

variable "ssh_public_key" {
  description = "Public SSH key content for the WhereIsMyDaughter droplet (used in CI via TF_VAR_ssh_public_key)"
  sensitive   = true
  default     = ""
}
