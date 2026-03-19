CD ..\backend

podman build -t gemrealty-backend:v0.0.2 --force-rm .
podman tag gemrealty-backend:v0.0.2 northamerica-northeast2-docker.pkg.dev/double-freehold-202807/gemrealty-dockers/gemrealty-backend:v0.0.2
REM podman image prune -f

CD ..\devops