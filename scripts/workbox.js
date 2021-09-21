const { generateSW } = require('workbox-build')

generateSW({
  swDest: './build/service-worker.js',
  globDirectory: './build',
  globPatterns: ['**/*.{js,css,html,svg}']
}).then(({ count, size }) => {
  console.log(`Generated service worker, which will precache ${count} files, totaling ${size} bytes.`)
})
