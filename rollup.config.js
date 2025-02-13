import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/hapio-ui-state-management.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/hapio-ui-state-management.esm.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    external: [
        'date-fns',
        'axios',
        'zustand',
        'zustand/middleware',
        'lodash.merge',
    ],
    plugins: [
        typescript({
            tsconfig: './tsconfig.json',
        }),
        json(),
        terser(),
    ],
};
