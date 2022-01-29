# Setup for Typescript Eslint and Prettier

Automate TypeScript, ESLint and Prettier in one go.

## Unique Step

Run the following script from the main directory of your project:

```powershell
wget https://raw.githubusercontent.com/manukempo/setup-typescript-eslint-prettier/main/setup-typescript-eslint-prettier.js && node setup-typescript-eslint-prettier.js && rm setup-typescript-eslint-prettier.js
```

This will:

- Download the setup file (`setup-typescript-eslint-prettier.js`) in your current working directory
- Create the configuration files:
  - `.vscode/settings.json`
  - `.eslintrc.json`
  - `.prettierrc.json`
- Install all the dev dependencies for ESLint and Prettier in your project (`package.json`)
- Remove the setup file from your directory
