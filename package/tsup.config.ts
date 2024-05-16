import { Options } from "tsup";

const common: Options = {
  entry: ["./src/**/*.{ts,tsx,js,jsx}", "./src/style/global.css"],
  bundle: false,
  clean: true,
  minify: false,
  sourcemap: true,
  legacyOutput: true,
};

const esm: Options = {
  ...common,
  format:'esm',
};

const cjs: Options = {
  ...common,
  format: 'cjs',
  outDir: "./dist/cjs"
};



export default [esm,cjs];