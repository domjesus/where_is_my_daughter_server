output "droplet_ip" {
  value = digitalocean_droplet.web.ipv4_address
}

output "whereismydaughter_ip" {
  value = digitalocean_droplet.whereismydaughter.ipv4_address
}

output "whereismydaughter_urn" {
  value = digitalocean_droplet.whereismydaughter.urn
}

output "schedule_manager_project_id" {
  value = data.digitalocean_project.schedule_manager.id
}
