#!/bin/bash

export NODE_ENV='ci'
export FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
export FIREBASE_CONFIG='{ "projectId": "demo-dsq" }'
export FIRESTORE_EMULATOR_HOST=localhost:9999
export GCLOUD_PROJECT=demo-dsq

npm run test