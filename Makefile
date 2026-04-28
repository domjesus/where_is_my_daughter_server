# Docker Compose Makefile

DC := docker compose

.PHONY: help up down restart shell build dev install test migrate fresh log

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start the application in detached mode
	$(DC) up -d

down: ## Stop the application
	$(DC) down

restart: down up ## Restart the application

shell: ## Open a shell in the app container
	$(DC) exec -it app sh

build: ## Build frontend assets for production
	$(DC) exec node npm run build

dev: ## Start the Vite development server
	$(DC) up node -d

install: ## Install composer and npm dependencies
	$(DC) run --rm app composer install
	$(DC) run --rm node npm install --legacy-peer-deps

test: ## Run the application tests
	$(DC) exec app php artisan test

migrate: ## Run database migrations
	$(DC) exec app php artisan migrate

fresh: ## Reset the database and run migrations
	$(DC) exec app php artisan migrate:fresh --seed

log: ## View the application logs
	$(DC) logs -f

mock-data: ## Send mock localization data via curl
	@curl -X POST http://localhost:8080/localizations/data \
		-H "Content-Type: application/json" \
		-H "Accept: application/json" \
		-d '{"latitude": "-23.550520", "longitude": "-46.633308", "source": "mobile", "is_home": false}'
	@echo "\nMock data sent successfully!"
