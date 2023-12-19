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
  mkdir ~/.ssh
  
  # We could dynamically retrieve the key like this:
  # ssh-keyscan -v -H -t  rsa github.com  >> ~/.ssh/known_hosts
  # But as long as Github does not change it's key, it is more secure to just pin it here statically
  # That prevent's MitM attacks between AWS and Github (yeah, very likely that those attackers would target Lern-Fair)
  # (also see https://github.blog/2023-03-23-we-updated-our-rsa-ssh-host-key/)
  echo '|1|fwQK5SvLPS1AEmJZR4Ss1rg0qI0=|Je4c6JrODqP4tOT7aCvRJiutMnk= ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl' >> ~/.ssh/known_hosts
  echo '|1|6EZqAv3eaCuVEbyDEM1K3Rnvq78=|sy03Rjaq3aXlBOrg8jwqH/JtCsM= ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=' >> ~/.ssh/known_hosts
  echo '|1|Q/XxfRqMgNOOfi+O3F5QrU1jEZQ=|/7mdLiGbwbUOEChYuMm8GmH1UQ4= ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=' >> ~/.ssh/known_hosts
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
