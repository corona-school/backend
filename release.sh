if [ "$ENV" = 'production' ]; then
    echo 'Production Deployment, running migrations'
    npx typeorm migration:run
else 
    echo 'Non-Productive Deployment, setting up DB with seeded data' 
    npm run db:setup:heroku
    npm run db:reset-hard
    npm run db:seed 
fi
