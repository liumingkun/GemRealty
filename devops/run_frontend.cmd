REM podman build -t gemrealty-frontend:v0.0.2 frontend/gemrealty
podman stop gemrealty-frontend
podman rm gemrealty-frontend
podman run -d --name gemrealty-frontend --network gemrealty-net -p 8080:8080 gemrealty-frontend:v0.0.2
