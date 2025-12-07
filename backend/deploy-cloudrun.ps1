# Deploy to Google Cloud Run
# Run this script after building the container image

$PROJECT_ID = gcloud config get-value project
$IMAGE = "gcr.io/$PROJECT_ID/english-qa-backend"

Write-Host "Deploying to Cloud Run..." -ForegroundColor Green
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "Image: $IMAGE" -ForegroundColor Cyan

gcloud run deploy english-qa-backend `
  --image $IMAGE `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --port 8080 `
  --memory 512Mi `
  --cpu 1 `
  --min-instances 0 `
  --max-instances 10 `
  --set-env-vars "NODE_ENV=production"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful!" -ForegroundColor Green
    Write-Host "`nGetting service URL..." -ForegroundColor Yellow
    $URL = gcloud run services describe english-qa-backend --region us-central1 --format="value(status.url)"
    Write-Host "Your service is available at: $URL" -ForegroundColor Cyan
    Write-Host "`nTest it with: curl $URL/api/health" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Deployment failed. Check the error messages above." -ForegroundColor Red
}

