
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "../server/graph/schema.graphqls",
  documents: "lib/**/*.graphql",
  generates: {
    "lib/graph/generated/": {
      preset: "client",
      plugins: []
    },
  }
};

export default config;
