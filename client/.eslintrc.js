module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-typescript",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "project": "./tsconfig.json"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
		],
		"no-tabs": "off",
		"react/jsx-indent": ["error", "tab"],
		"react/jsx-indent-props": ["error", "tab"],
		"import/prefer-default-export": "off",
		"@typescript-eslint/indent": ["error", "tab"],
		"arrow-parens": "off",
		"max-len": ["error", 140],
		"react/jsx-one-expression-per-line": "off",
		"react/prop-types": "off",
		"react/require-default-props": "off",
		"react/jsx-props-no-spreading": "off"
    }
};
