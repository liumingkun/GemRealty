CALL build_backend.cmd

CALL push_backend.cmd

setlocal enabledelayedexpansion

:: Read .env file and build comma-separated string
set "ENV_VARS="
for /f "usebackq tokens=*" %%a in ("../backend/.env") do (
    if "!ENV_VARS!"=="" (
        set "ENV_VARS=%%a"
    ) else (
        set "ENV_VARS=!ENV_VARS!,%%a"
    )
)

echo %ENV_VARS%

gcloud run deploy gemrealty-backend ^
  --image northamerica-northeast2-docker.pkg.dev/double-freehold-202807/gemrealty-dockers/gemrealty-backend:v0.0.2 ^
  --add-volume=name=sessions-bucket,type=cloud-storage,bucket=gemrealty-session ^
  --add-volume-mount=volume=sessions-bucket,mount-path=/app/sessions ^
  --add-volume=name=data-bucket,type=cloud-storage,bucket=gemrealty-data ^
  --add-volume-mount=volume=data-bucket,mount-path=/app/app/data ^
  --port=8080 ^
  --platform=managed ^
  --ingress=all ^
  --region=northamerica-northeast2 ^
  --set-env-vars="%ENV_VARS%" ^
  --allow-unauthenticated

endlocal
