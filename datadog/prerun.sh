#!/usr/bin/env bash

DD_ENV=${DD_ENV:-dev}
DD_SERVICE=${SERVICE_NAME:-n/a}
DD_VERSION=${HEROKU_SLUG_COMMIT:-latest}
GIT_COMMIT=${HEROKU_SLUG_COMMIT:-main}

DD_TAGS="git.commit.sha:${GIT_COMMIT} git.repository_url:github.com/corona-school/backend service:${DD_SERVICE}"
