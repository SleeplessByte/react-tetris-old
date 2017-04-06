const runtime = require('offline-plugin/runtime')

runtime.install({
  // When an update is ready, tell ServiceWorker to take control immediately:
  onUpdateReady() {
    console.log('[offline] update ready')
    runtime.applyUpdate()
  },

  // Reload to get the new version:
  onUpdated() {
    console.log('[offline] updated')
    location.reload()
  }
})
