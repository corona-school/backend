# ----------- STAGING & REVIEW APPS --------------
if [ \"$ENV\" = 'dev' ]; then
  echo "=========== Development Release =============="
  echo "----------- Set up DB Schema -----------------"
  npm run db:reset -- --force
  echo "----------- Seed DB with sample users --------"
  npm run db:seed
  echo "=========== DONE ============================="
fi

# ----------- PRODUCTION -------------------------
if [ \"$ENV\" = 'production' ]; then
  echo "=========== Development Release =============="
  echo "----------- Run Migrations -----------------"
  npm run db:deploy-migrations
  echo "=========== DONE ============================="
fi