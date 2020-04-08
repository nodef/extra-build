import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    dir: '.',
    format: 'cjs',
    exports: 'named'
  },
  plugins: [commonjs()]
};
