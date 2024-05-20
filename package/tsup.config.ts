import { Options } from "tsup";

const common: Options = {
  entry: ["./src/**/*.{ts,tsx,js,jsx}", "./src/style/global.css"],
  bundle: false,
  clean: true,
  minify: false,
  sourcemap: true,
  legacyOutput: true,
  external: ["dotenv"]
};

const esm: Options = {
  ...common,
  format:'esm',
};

export default esm;