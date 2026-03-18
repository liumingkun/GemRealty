CD frontend\gemrealty

REM load env vars from .env file
for /f "tokens=1* delims==" %%A in (.env) do (
    set "%%A=%%B"
)

REM print env vars
echo %VITE_GOOGLE_MAPS_API_KEY%

REM build image
podman build -t gemrealty-frontend:v0.0.2 --force-rm --build-arg VITE_GOOGLE_MAPS_API_KEY=%VITE_GOOGLE_MAPS_API_KEY% .
CD ..\..