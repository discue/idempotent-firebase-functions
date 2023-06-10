#!/bin/bash

export NODE_ENV='ci'
export FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
export FIRESTORE_EMULATOR_HOST=localhost:9999
export FIREBASE_CONFIG='{ "projectId": "demo-test", "storageBucket": "demo-test.appspot.com" }'
export NODE_ENV='ci'

npm run test