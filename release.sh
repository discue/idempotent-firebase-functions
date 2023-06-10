#!/bin/bash

set -x

./update-docs.sh

git add README*.*md
git commit -m "chore(docs): update readme"