#!/bin/sh -eu
build_and_deploy() {
    PROJECT=$1;
    echo "Building an Deploy application for project $PROJECT"
    cp .env.$PLATFORM_ENVIRONMENT .env
    CI=false npm run build:$BUILD_ENVIRONMENT
    aws s3 sync build s3://$S3_BUCKET --delete
    # aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    
}

build_and_deploy $@ 