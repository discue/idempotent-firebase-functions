const globals = require('globals')
const js = require("@eslint/js")

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node
            }
        },
        rules: {
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                }
            ],
            "semi": [
                "error",
                "never"
            ],
            "quotes": [
                "error",
                "single",
                {
                    "allowTemplateLiterals": true
                }
            ]
        }
    }
]
