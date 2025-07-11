#!/bin/bash

# ShortsHub.app Google Cloud Platform Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 ShortsHub.app Deployment Script${NC}"
echo -e "${BLUE}=====================================${NC}"

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-"your-project-id"}
REGION=${GCP_REGION:-"us-central1"}
DB_INSTANCE=${DB_INSTANCE:-"shortshub-db"}
BUCKET_NAME=${GCS_BUCKET_NAME:-"shortshub-storage"}

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install Node.js first.${NC}"
    exit 1
fi

# Set project
echo -e "${YELLOW}🔧 Setting up project: ${PROJECT_ID}${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required Google Cloud APIs...${NC}"
gcloud services enable \
    appengine.googleapis.com \
    cloudbuild.googleapis.com \
    sqladmin.googleapis.com \
    storage.googleapis.com \
    secretmanager.googleapis.com \
    run.googleapis.com

# Create App Engine app if not exists
if ! gcloud app describe &> /dev/null; then
    echo -e "${YELLOW}🏗️ Creating App Engine application...${NC}"
    gcloud app create --region=$REGION
fi

# Create Cloud SQL instance
echo -e "${YELLOW}🗄️ Setting up Cloud SQL...${NC}"
if ! gcloud sql instances describe $DB_INSTANCE &> /dev/null; then
    gcloud sql instances create $DB_INSTANCE \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-size=10GB \
        --storage-type=SSD \
        --backup-start-time=03:00 \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=04
fi

# Create database
gcloud sql databases create shortshub --instance=$DB_INSTANCE || echo "Database might already exist"

# Create database user
DB_PASSWORD=$(openssl rand -base64 32)
gcloud sql users create shortshub-user \
    --instance=$DB_INSTANCE \
    --password=$DB_PASSWORD || echo "User might already exist"

# Create Cloud Storage bucket
echo -e "${YELLOW}🪣 Setting up Cloud Storage...${NC}"
if ! gsutil ls gs://$BUCKET_NAME &> /dev/null; then
    gsutil mb -p $PROJECT_ID -l $REGION gs://$BUCKET_NAME
    gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
fi

# Store secrets
echo -e "${YELLOW}🔐 Storing secrets...${NC}"
echo -n "$DB_PASSWORD" | gcloud secrets create db-password --data-file=- || echo "Secret exists"
echo -n "$(openssl rand -base64 64)" | gcloud secrets create jwt-secret --data-file=- || echo "Secret exists"

# Get database connection string
CONNECTION_NAME=$(gcloud sql instances describe $DB_INSTANCE --format="value(connectionName)")
DATABASE_URL="postgresql://shortshub-user:$DB_PASSWORD@/$shortshub?host=/cloudsql/$CONNECTION_NAME"

# Run database migration
echo -e "${YELLOW}🔄 Running database migration...${NC}"
export DATABASE_URL=$DATABASE_URL
node database/migrate.js

# Install dependencies and build
echo -e "${YELLOW}🔨 Building application...${NC}"
npm install
npm run build

# Deploy to Google Cloud
echo -e "${YELLOW}🚀 Deploying to Google Cloud...${NC}"
gcloud app deploy --quiet

# Get app URL
APP_URL=$(gcloud app browse --no-launch-browser 2>&1 | grep -o 'https://[^"]*' | head -1)

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${BLUE}=====================================${NC}"
echo -e "${GREEN}🎉 ShortsHub.app is now live!${NC}"
echo -e "${BLUE}🌐 App URL: ${APP_URL}${NC}"
echo -e "${BLUE}🗄️ Database: ${DB_INSTANCE}${NC}"
echo -e "${BLUE}🪣 Storage: gs://${BUCKET_NAME}${NC}"

echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "1. Configure OAuth credentials in Google Cloud Console"
echo -e "2. Update environment variables with your API keys"
echo -e "3. Test the application functionality"
echo -e "4. Set up monitoring and alerts"
echo -e "5. Configure custom domain (optional)"