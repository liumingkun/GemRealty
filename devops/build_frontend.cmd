CD ..\frontend\gemrealty

REM load env vars from .env file
for /f "tokens=1* delims==" %%A in (.env) do (
    set "%%A=%%B"
)

REM Check if required variables are set
if "%VITE_GOOGLE_MAPS_API_KEY%"=="" (
    echo ERROR: VITE_GOOGLE_MAPS_API_KEY is not set.
    echo Please edit .env file and set the variable.
    pause
    exit /b 1
)

REM build image
podman build -t gemrealty-frontend:v0.0.2 --force-rm --build-arg VITE_GOOGLE_MAPS_API_KEY=%VITE_GOOGLE_MAPS_API_KEY% .
podman tag gemrealty-frontend:v0.0.2 northamerica-northeast2-docker.pkg.dev/double-freehold-202807/gemrealty-dockers/gemrealty-frontend:v0.0.2
REM podman image prune -f

CD ..\..\devops