echo "Starting Release for Environment '$ENV'"

# ----------- STAGING & REVIEW APPS --------------
if [ "$ENV" = 'dev' ]; then
  echo "=========== Development Release =============="
  echo "----------- Set up DB Schema -----------------"
  npm run db:setup:heroku
  npm run db:reset-hard
  echo "----------- Seed DB with sample users --------"
  npm run db:seed
  echo "=========== DONE ============================="
fi

# ----------- PRODUCTION -------------------------
if [ "$ENV" = 'production' ]; then
  echo "=========== Production Release ==============="
  echo "----------- Run Migrations -----------------"
  echo "TODO: Enable Prisma based migrations"
  # npm run db:deploy-migrations
  echo "=========== DONE ============================="
fi

echo "Finished Release"
