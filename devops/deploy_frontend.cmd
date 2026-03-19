CALL build_frontend.cmd

CALL push_frontend.cmd

setlocal enabledelayedexpansion

REM Deploy to Cloud Run
echo Deploying to Cloud Run...

REM Get the image name from the last push
set IMAGE_NAME=northamerica-northeast2-docker.pkg.dev/double-freehold-202807/gemrealty-dockers/gemrealty-frontend:v0.0.2
set BACKEND_URL=https://gemrealty-backend-lfl2ohixga-pd.a.run.app

REM Deploy to Cloud Run
gcloud run deploy gemrealty-frontend ^
  --image %IMAGE_NAME% ^
  --region northamerica-northeast2 ^
  --platform managed ^
  --allow-unauthenticated ^
  --set-env-vars BACKEND_URL=%BACKEND_URL% ^
  --project double-freehold-202807

if errorlevel 1 (
    echo ERROR: Cloud Run deployment failed.
    pause
    exit /b 1
)

echo.
echo Deployment completed successfully!

endlocal
