# This script will run after Typescript was compiled into the ./built folder
# It will only be run inside Heroku's build, not with 'npm run build'

echo ' -------------- Setup.sh started           -------------- '

# If a private repo is available to get the secret assets from, replace the /built/assets folder
if  ! [[ -z "${SECRET_ASSETS_REPOSITORY}" ]]; then
  cd ./built/assets
  rm ./*
  ssh-agent bash -c 'ssh-add - <<< "${SECRET_ASSETS_KEY}"; git clone "${SECRET_ASSETS_REPOSITORY}"'
fi

echo ' -------------- Setup.sh ended successfully -------------- '