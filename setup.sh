# This script will run after Typescript was compiled into the ./built folder
# It will only be run inside Heroku's build, not with 'npm run build'


echo ' -------------- Setup.sh started            -------------- '

# If a private repo is available to get the secret assets from, replace the /built/assets folder
echo 'STEP 1/1: Add secret assets repository'

if  ! test -z "${SECRET_ASSETS_REPOSITORY}"; then
  echo '> Asset repository set in ENV:'
  echo $SECRET_ASSETS_REPOSITORY
  
  echo '> Key to access it (KEEP THIS PRIVATE):'
  echo $SECRET_ASSETS_KEY

  cd ./assets

  echo '> Cleaning up the assets folder:'
  ls -R
  rm -r ./*

  
  echo '> Etablishing trust to Github'
  # Usually one would do this (and even that is bad as it allows MitM attacks) ...
  # ssh-keyscan -H -t rsa github.com  >> ~/.ssh/known_hosts
  # but as the heroku stack somehow rewrites ~ to not point to the users home, 
  # I have no idea were to write to, so I need to fall back to black magic
  # Github will refuse the connection, but at least by then the SSH Key is then added to the known hosts 
  ssh -o StrictHostKeyChecking=no github.com


  echo '> Cloning the secret asset repo into it'
  ssh-agent bash -c 'ssh-add - <<< "${SECRET_ASSETS_KEY}"; git clone "${SECRET_ASSETS_REPOSITORY}" .'

  echo '> These files are now there:'
  ls -R
else
  echo '> No Asset repository set in ENV, skipping step'
fi

echo ' -------------- Setup.sh ended successfully -------------- '