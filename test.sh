#!/bin/bash

export NODE_ENV='ci'
export FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
export FIRESTORE_EMULATOR_HOST=localhost:9999

npm run test