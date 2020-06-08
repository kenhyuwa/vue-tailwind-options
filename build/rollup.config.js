import vue from 'rollup-plugin-vue' // Menangani SFC .vue
import buble from 'rollup-plugin-buble' // Transpile / polyfill dengan dukungan peramban yang masuk akal
import commonjs from 'rollup-plugin-commonjs'
export default {
  input: 'src/wrapper.js', // Jalur relatif to package.json
  output: {
    name: 'VueTailwindOptions',
    exports: 'named',
    extractCSS: false,
    globals: {
      axios: 'axios',
    },
  },
  external: ['axios'],
  plugins: [
    commonjs(),
    vue({
      css: true, // Menyuntikkan css secara dinamis sebagai tag <style>
      compileTemplate: true, // Konversi secara eksplisit templat ke render function
    }),
    buble(), // Transpile ke ES5
  ],
}
