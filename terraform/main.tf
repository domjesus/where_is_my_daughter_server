terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_ssh_key" "default" {
  name       = "laravel-app-key"
  public_key = var.ssh_public_key
}

resource "digitalocean_droplet" "web" {
  image    = "ubuntu-24-04-x64"
  name     = "laravel-php84-web"
  region   = var.region
  size     = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.default.fingerprint]

  user_data = <<-EOF
              #!/bin/bash
              export DEBIAN_FRONTEND=noninteractive
              apt-get update
              apt-get install -y software-properties-common
              add-apt-repository -y ppa:ondrej/php
              apt-get update
              apt-get install -y php8.4 php8.4-fpm php8.4-sqlite3 php8.4-xml php8.4-curl php8.4-mbstring unzip nginx

              # Setup Nginx
              cat > /etc/nginx/sites-available/default <<'NGINX'
              server {
                  listen 80;
                  listen [::]:80;
                  server_name _;
                  root /var/www/html/public;

                  add_header X-Frame-Options "SAMEORIGIN";
                  add_header X-Content-Type-Options "nosniff";

                  index index.php;

                  charset utf-8;

                  location / {
                      try_files $uri $uri/ /index.php?$query_string;
                  }

                  location = /favicon.ico { access_log off; log_not_found off; }
                  location = /robots.txt  { access_log off; log_not_found off; }

                  error_page 404 /index.php;

                  location ~ \.php$ {
                      fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
                      fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
                      include fastcgi_params;
                  }

                  location ~ /\.(?!well-known).* {
                      deny all;
                  }
              }
              NGINX

              systemctl restart nginx
              EOF
}

# ── WhereIsMyDaughter droplet ────────────────────────────────────────────────

resource "digitalocean_ssh_key" "whereismydaughter" {
  name       = "whereismydaughter-key"
  public_key = var.ssh_public_key
}

resource "digitalocean_droplet" "whereismydaughter" {
  image    = "ubuntu-22-04-x64"
  name     = "WhereIsMyDaughter"
  region   = var.region
  size     = "s-1vcpu-1gb"
  ssh_keys = [digitalocean_ssh_key.whereismydaughter.fingerprint]
}

data "digitalocean_project" "schedule_manager" {
  name = "ScheduleManager"
}

resource "digitalocean_project_resources" "whereismydaughter" {
  project   = data.digitalocean_project.schedule_manager.id
  resources = [digitalocean_droplet.whereismydaughter.urn]
}
