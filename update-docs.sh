#!/bin/bash

npx documentation build lib/idempotent-function-lease.js --external mongodb --markdown-toc false --format md --shallow --output README_IDEMPOTENT_FUNCTION_LEASE.md
npx documentation build lib/idempotent-functions.js --external mongodb --markdown-toc false --format md --shallow --output README_IDEMPOTENT_FUNCTIONS.md