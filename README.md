3. The required MinIO bucket is created automatically by the compose init helper (`minio-init`). You do not need to run `aws s3 mb` manually. The `minio-init` service runs once and creates the `ivendor-bucket`.

If you prefer to create it manually, you can use the MinIO console at http://localhost:9001 (username `minioadmin`, password `minioadmin`) or the AWS CLI with the MinIO endpoint:

```powershell
# Create bucket 'ivendor-bucket' on local MinIO (optional)
aws --endpoint-url http://localhost:9000 s3 mb s3://ivendor-bucket
```
I-Vendor Starter Repo

This repository is a minimal, runnable starter for the I-Vendor production system. It includes:

- Postgres docker-compose for local development
- Backend (Node + Express) with a few endpoints
- DB migrations (Postgres DDL)
- Seed SQL for roles and permissions
- OpenAPI skeleton for core endpoints
- OPA policy example for verification authorization

This starter is intentionally small to get you running quickly. Extend services into microservices and replace mocked areas (presigned URLs, OCR calls) with production integrations.

Prerequisites

- Docker & Docker Compose
- Node 18+ and npm

Quick start

1. Start Postgres with Docker Compose

```powershell
cd "d:/College/IEDC/Hackathon at KITS/I-Vender/I-Vender/ivendor-starter"
docker compose up -d
```

2. Run migrations and seeds

The backend will automatically apply the initial migration on first start. Seeds are applied automatically if you run the provided seed SQL (optional). To apply seeds manually you can still use `psql` or Adminer.

Optional (manual seed step):

```powershell
# Apply seed data (optional)
psql "postgresql://ivendor:ivendor@localhost:5432/ivendor" -f backend/src/seed/seed_roles.sql
```

3. Install and run backend

```powershell
cd backend
npm install
npm start
```

4. API will be available at: http://localhost:4000/api/v1
Health: http://localhost:4000/health

What to build next

- Implement full auth (Keycloak/Auth0) integration
- Replace mocked presigned URLs with real S3 signed URLs
- Add OCR worker, Kafka (or RabbitMQ), verification service
- Add frontend scaffold (React + Vite)
- Add CI/CD manifests (GitHub Actions + ArgoCD)

Files created

- docker-compose.yml (Postgres + Adminer)
- backend/* (server, migrations, seed)
- openapi.yaml
- policy/verification.rego

If you want, I can now scaffold the frontend (React + Vite) and expand the OpenAPI spec into full coverage.
