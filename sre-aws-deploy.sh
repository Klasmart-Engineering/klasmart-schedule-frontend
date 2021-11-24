#!/usr/bin/env bash

# script to build and deploy AWS based CMS frontends

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

# CHANGE ALLOWED TARGETS to deploy to a new region/environment combination
allowed_target_environment=("stage" "prod" "alpha" "sso" "loadtest" "onboarding")
allowed_target_region=("in" "pk" "global" "uk" "lk" "th")


script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)

usage() {
  cat <<EOF
Usage: $(basename "${BASH_SOURCE[0]}") [-h] [-v] -e environment -r region

Script description here.

Available options:

-h, --help      Print this help and exit
-v, --verbose   Print script debug info
-e, --env       Some flag description
-r, --region    Some param description
EOF
  exit
}

cleanup() {
  trap - SIGINT SIGTERM ERR EXIT
}

setup_colors() {
  if [[ -t 2 ]] && [[ -z "${NO_COLOR-}" ]] && [[ "${TERM-}" != "dumb" ]]; then
    NOFORMAT='\033[0m' RED='\033[0;31m' GREEN='\033[0;32m' ORANGE='\033[0;33m' BLUE='\033[0;34m' PURPLE='\033[0;35m' CYAN='\033[0;36m' YELLOW='\033[1;33m'
  else
    NOFORMAT='' RED='' GREEN='' ORANGE='' BLUE='' PURPLE='' CYAN='' YELLOW=''
  fi
}

msg() {
  echo >&2 -e "${1-}"
}

die() {
  local msg=$1
  local code=${2-1} # default exit status 1
  msg "$msg"
  exit "$code"
}

parse_params() {
  flag=0
  param=''

  while :; do
    case "${1-}" in
    -h | --help) usage ;;
    -v | --verbose) set -x ;;
    --no-color) NO_COLOR=1 ;;
    -e | --env)
      env="${2-}"
      shift
      ;; # example env
    -r | --region) # example named parameter
      region="${2-}"
      shift
      ;;
    -?*) die "Unknown option: $1" ;;
    *) break ;;
    esac
    shift
  done

  args=("$@")

  # check required region and arguments
  msg "${RED}"
  [[ -z "${region-}" ]] && die "Missing required parameter: target region (-r/--region)"
  [[ ! " ${allowed_target_region[@]} " =~ " ${region} " ]] && die "allowed target regions: ${allowed_target_region[*]}"
  [[ -z "${env-}" ]] && die "Missing required parameter: target environment (-e/--env)"
  [[ ! " ${allowed_target_environment[@]} " =~ " ${env} " ]] && die "allowed target environments: ${allowed_target_environment[*]}"
  msg "${NOFORMAT}"

  return 0
}

setup_colors
parse_params "$@"

allowed_target_environment=("stage" "prod" "alpha" "sso" "loadtest" "onboarding")
allowed_target_region=("in" "pk" "global" "uk" "lk" "th")

if [ $env == "prod" ] && [ $region == "in" ]
then
  S3_ENDPOINT=s3://klindia-prod-cms
  CLOUDFRONT_ID=E19MBPF4A4BIP
elif [ $env == "prod" ] && [ $region == "lk"  ]
then
  S3_ENDPOINT=s3://kllk-prod-cms
  CLOUDFRONT_ID=E2A48UEY4395EX
elif [ $env == "prod" ] && [ $region == "pk"  ]
then
  S3_ENDPOINT=s3://klpk-prod-cms
  CLOUDFRONT_ID=E3GNXZZ81A650V
elif [ $env == "prod" ] && [ $region == "uk"  ]
then
  S3_ENDPOINT=s3://kluk-prod-cms
  CLOUDFRONT_ID=E3R75DBF733GJG
elif [ $env == "prod" ] && [ $region == "th"  ]
then
  S3_ENDPOINT=s3://klth-prod-cms
  CLOUDFRONT_ID=E1FPUJB5P4J1LA
elif [ $env == "prod" ] && [ $region == "global"  ]
then
  S3_ENDPOINT=s3://klglobal-prod-cms
  CLOUDFRONT_ID=E2DJ8D8M02O8BG
elif [ $env == "stage" ] && [ $region == "global"  ]
then
  S3_ENDPOINT=s3://klglobal-stage-cms
  CLOUDFRONT_ID=E2F59COXFMVHPB
elif [ $env == "sso" ] && [ $region == "global"  ]
then
  S3_ENDPOINT=s3://klglobal-sso-cms
  CLOUDFRONT_ID=E1N9AS58TIUFD0
elif [ $env == "alpha" ] && [ $region == "global"  ]
then
  S3_ENDPOINT=s3://klglobal-alpha-cms
  CLOUDFRONT_ID=E1SZGP6UG9V8DB
fi

# script logic here
msg "${GREEN}Script for AWS builds${NOFORMAT}"
msg "${GREEN}Read parameters:${NOFORMAT}"
msg "- env: ${env}"
msg "- region: ${region}"

msg "copy config file to .env.production"
cp ./deploy/config/${region}/.env.${env} ./.env.production
msg "npm install and audit"
docker  run  -it --name cmsBuilder --rm --mount type=bind,source="$(pwd)",target=/app -w /app node:14 npm ci
msg "----------------------"
msg "npm build for ${env} in region ${region}"
docker  run  -it --name cmsBuilder --rm --mount type=bind,source="$(pwd)",target=/app -w /app node:14 npm run build
msg "----------------------"
msg "${GREEN}syncing current latest to backup${NOFORMAT}"
aws s3 sync ${S3_ENDPOINT}/latest ${S3_ENDPOINT}/$(date "+%Y%m%d")
msg "----------------------"
msg "${GREEN}syncing build to s3${NOFORMAT}"
#aws s3 sync build ${S3_ENDPOINT}/latest --delete
msg "${GREEN}creating cloudfront invalidation${NOFORMAT}"
aws cloudfront create-invalidation --paths "/*" --distribution-id ${CLOUDFRONT_ID}

