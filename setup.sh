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
  mkdir ~/.ssh
  
  # We could dynamically retrieve the key like this:
  # ssh-keyscan -v -H -t  rsa github.com  >> ~/.ssh/known_hosts
  # But as long as Github does not change it's key, it is more secure to just pin it here statically
  # That prevent's MitM attacks between AWS and Github (yeah, very likely that those attackers would target corona school)
  echo '|1|nJBTgCBhxtu/n/+UpWS7ttBoiys=|rQxqxeiZRNiTSzHMhbR8HrfoBS4= ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==' >> ~/.ssh/known_hosts
  cat ~/.ssh/known_hosts


  echo '> Cloning the secret asset repo into it'
  ssh-agent bash -c 'ssh-add - <<< "${SECRET_ASSETS_KEY}"; git clone "${SECRET_ASSETS_REPOSITORY}" .'

  echo '> These files are now there:'
  ls -R
else
  echo '> No Asset repository set in ENV, skipping step'
fi

echo ' -------------- Setup.sh ended successfully -------------- '
