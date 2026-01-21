The build is failing because the `@hookform/resolvers` package is missing from your `node_modules` directory. This is causing the error: `Failed to resolve import "@hookform/resolvers/zod"`.

To fix this, you need to install the project's dependencies. Please run one of the following commands in your terminal:

```bash
yarn install
```

or

```bash
npm install
```

This will download and install the missing packages, and should resolve the build error.
