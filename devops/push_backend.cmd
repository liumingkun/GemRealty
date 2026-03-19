ECHO Starting push at %DATE% %TIME%

gcloud auth print-access-token | podman login -u oauth2accesstoken --password-stdin https://northamerica-northeast2-docker.pkg.dev
podman push northamerica-northeast2-docker.pkg.dev/double-freehold-202807/gemrealty-dockers/gemrealty-backend:v0.0.2

ECHO Finished push at %DATE% %TIME%
