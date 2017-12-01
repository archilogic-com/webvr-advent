var sceneId = 'ce59ff59-2b1a-4642-825f-f0c2c53485cc'
var scene = document.querySelector('a-scene')
var user = document.getElementById('head')
var intro = document.getElementById('introPanel')
var teleporter = document.getElementById('teleporter')

io3d.scene.getAframeElements(sceneId).then(function (elements) {
  elements
    .filter(function (elem) { return !elem.hasAttribute('camera') })
    .forEach(function (elem) {
      elem.setAttribute('rotation', '0 0 0')
      elem.setAttribute('position', '1.5 0 -5.167')
      scene.appendChild(elem)
    })
})

document.getElementById('ground').addEventListener('click', function (evt) {
  // only teleport once the intro has been closed
  if (intro.getAttribute('visible')) return

  if (window.location.search.indexOf('teleporter') >= 0) {
    teleporter.setAttribute('scale', '1 1 1')
    teleporter.dispatchEvent(new CustomEvent('teleport'))
  }

  console.log('click ground', evt.detail.intersection.point)
  var targetPos = evt.detail.intersection.point
  setTimeout(function () { user.setAttribute('position', targetPos.x + ' 1.6 ' + targetPos.z) }, window.location.search.indexOf('teleporter') >= 0 ? 500 : 0)
})

document.getElementById('teleporterFadeOut').addEventListener('animationend', function () {
  teleporter.setAttribute('scale', '0 0 0')
})

document.getElementById('player1').addEventListener('click', function () {
  document.getElementById('day1').play()
})

var loadingMsgs = [
  'Decorating the Christmas tree...',
  'Singing Christmas songs...',
  'Lighting the fireplace...',
  'Baking cookies...'
], current = 0, loader = document.getElementById('loader')

function changeLoadingText() {
  loader.textContent = loadingMsgs[current]
  current = (current + 1) % loadingMsgs.length
  console.log('loader', current)
}

var loaderInterval = setInterval(changeLoadingText, 1500)

scene.addEventListener('model-loaded', function onLoaded(evt) {
  if(!evt.target.hasAttribute('io3d-data3d')) return

  document.body.removeChild(document.querySelector('section'))
  clearInterval(changeLoadingText)
  this.removeEventListener('model-loaded', onLoaded)
})