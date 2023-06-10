
<p align="center">
<a href="https://www.discue.io/" target="_blank" rel="noopener noreferrer"><img width="128" src="https://www.discue.io/icons-fire-no-badge-square/web/icon-192.png" alt="Vue logo">
</a>
</p>

<br/>
<div align="center">

[![GitHub tag](https://img.shields.io/github/tag/@discue/idempotent-firebase-functions?include_prereleases=&sort=semver&color=blue)](https://github.com/@discue/idempotent-firebase-functions/releases/)
[![Latest Stable Version](https://img.shields.io/npm/v/@discue/idempotent-firebase-functions.svg)](https://www.npmjs.com/package/@discue/idempotent-firebase-functions)
[![License](https://img.shields.io/npm/l/@discue/idempotent-firebase-functions.svg)](https://www.npmjs.com/package/@discue/idempotent-firebase-functions)
<br/>
[![NPM Downloads](https://img.shields.io/npm/dt/@discue/idempotent-firebase-functions.svg)](https://www.npmjs.com/package/@discue/idempotent-firebase-functions)
[![NPM Downloads](https://img.shields.io/npm/dm/@discue/idempotent-firebase-functions.svg)](https://www.npmjs.com/package/@discue/idempotent-firebase-functions)
<br/>
[![contributions - welcome](https://img.shields.io/badge/contributions-welcome-blue)](/CONTRIBUTING.md "Go to contributions doc")
[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-blue?logo=node.js&logoColor=white)](https://nodejs.org "Go to Node.js homepage")

</div>

# idempotent-firebase-functions

Because firebase does not guarentee firestore events get [triggered only once](https://cloud.google.com/functions/docs/calling/cloud-firestore#limitations), we need to ensure idempotency ourselves. This module provides helper functions to create [idempotent functions](https://cloud.google.com/blog/products/serverless/cloud-functions-pro-tips-building-idempotent-functions) easily. 

## Components
- [Function Lease](README_IDEMPOTENT_FUNCTION_LEASE.md)
- [Idempotent Function](README_IDEMPOTENT_FUNCTIONS.md)

## Example
### Examples

```javascript
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { idempotentFunction } from '@discue/idempotent-firebase-functions';
import handler from './handler.js'

const DOCUMENT_PATH = 'api_clients/{apiClientId}/queues/{queueId}/messages/{messageId}'
// handler function will only be called once per firebase event id
// effectively making it an idempotent function
export const written = onDocumentWritten(DOCUMENT_PATH, idempotentFunction(handler))
```

## Installation
```bash
npm install @discue/idempotent-firebase-functions
```

## Run E2E Tests

To run tests, run the following command

```bash
./test-e2e.sh
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

