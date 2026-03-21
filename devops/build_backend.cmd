CD ..\backend

podman build -t gemrealty-backend:v0.0.2 .
podman tag gemrealty-backend:v0.0.2 northamerica-northeast2-docker.pkg.dev/double-freehold-202807/gemrealty-dockers/gemrealty-backend:v0.0.2
podman image prune -f --filter "until=24h"

CD ..\devops