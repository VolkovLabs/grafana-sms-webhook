import esbuild from 'rollup-plugin-esbuild';

export default [
  {
    input: 'src/index.ts',
    plugins: [esbuild()],
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: ['dotenv', 'express', 'twilio', 'body-parser', 'winston'],
  },
];
