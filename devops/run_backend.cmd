podman network create gemrealty-net
podman stop gemrealty-backend
podman rm gemrealty-backend
podman run -d --name gemrealty-backend --network gemrealty-net -p 8000:8000 --env-file backend\.env --mount type=bind,source=C:\Users\liumi\Projects\GemRealty\backend\sessions,target=/app/sessions gemrealty-backend:v0.0.2
