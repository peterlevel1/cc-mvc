import builtIn from 'rollup-plugin-node-builtins';

export default {
  input: 'src/index.js',
  output: {
    file: 'cc-mvc.js',
    format: 'umd',
    name: 'MVC',
    globals: '$'
  },
  plugins: [
    builtIn(),
  ]
};
