(function (){
  if ('performance' in window === false) {
      (window as any).performance = {}
  }

  Date.now = (Date.now || function () {
    return new Date().getTime()
  })

  if ('now' in window.performance === false) {

    let nowOffset = Date.now()

    if (performance.timing && performance.timing.navigationStart) {
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset
    }
  }
})()
