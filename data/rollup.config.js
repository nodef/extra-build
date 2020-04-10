import ts from 'rollup-plugin-ts';
export default {
  input: 'src/index.ts',
  output: {
    dir: '.',
    format: 'es'
  },
  plugins: [ts({})]
};
