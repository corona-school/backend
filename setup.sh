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


  echo '> Cleaning up the assets folder:'
  ls -R ./assets
  rm -rf ./assets

  
  echo '> Etablishing trust to Github'
  
  # We could dynamically retrieve the key like this:
  # mkdir ~/.ssh
  # ssh-keyscan -v -H -t  rsa github.com  >> ~/.ssh/known_hosts
  # Or pin the key here statically, but for now trusting the connection to github is fine for our use case
  
  ssh -o StrictHostKeyChecking=no github.com
  cat ~/.ssh/known_hosts


  echo '> Cloning the secret asset repo into it'
  ssh-agent bash -c 'ssh-add - <<< "${SECRET_ASSETS_KEY}"; git clone "${SECRET_ASSETS_REPOSITORY}" ./assets' || { echo 'Failed to pull repository'; exit 1; }

  version=$( cat .certificate-version )
  echo "> Checking out version ${version}"
  git -C ./assets checkout $version

  echo '> These files are now there:'
  ls -R ./assets
else
  echo '> No Asset repository set in ENV, skipping step'
fi

echo ' -------------- Setup.sh ended successfully -------------- '
