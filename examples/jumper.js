/*
 * Jumping is fun. Riding pigs is even funnier!
 *
 * Learn how to make your bot interactive with this example.
 *
 * This bot can move, jump, ride vehicles, attack nearby entities and much more.
 */
const mineflayer = require('..')

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node jumper.js <host> <port> [<name>] [<password>]')
  process.exit(1)
}

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4] ? process.argv[4] : 'jumper',
  password: process.argv[5]
})

let target = null

bot.on('move', (lastPos) => {
  console.log(`I moved from ${JSON.stringify(lastPos)} to ${JSON.stringify(bot.entity.position)}`)
  console.log(`I have ${bot.entity.velocity.toString()} velocity`)
  console.log(`I am on the ground: ${bot.entity.onGround}`)
  // console.log(bot.entity)
});

bot.on('forcedMove', () => {
  console.log('I am being forced to move')
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  target = bot.players[username].entity
  let entity
  switch (message) {
    case 'forward':
      bot.setControlState('forward', true)
      break
    case 'back':
      bot.setControlState('back', true)
      break
    case 'left':
      bot.setControlState('left', true)
      break
    case 'right':
      bot.setControlState('right', true)
      break
    case 'sprint':
      bot.setControlState('sprint', true)
      break
    case 'stop':
      bot.clearControlStates()
      break
    case 'jump':
      bot.setControlState('jump', true)
      bot.setControlState('jump', false)
      break
    case 'jump a lot':
      bot.setControlState('jump', true)
      break
    case 'stop jumping':
      bot.setControlState('jump', false)
      break
    case 'attack':
      entity = bot.nearestEntity()
      if (entity) {
        bot.attack(entity, true)
      } else {
        bot.chat('no nearby entities')
      }
      break
    case 'mount':
      entity = bot.nearestEntity((entity) => { return entity.name === 'minecart' })
      if (entity) {
        bot.mount(entity)
      } else {
        bot.chat('no nearby objects')
      }
      break
    case 'dismount':
      bot.dismount()
      break
    case 'move vehicle forward':
      bot.moveVehicle(0.0, 1.0)
      break
    case 'move vehicle backward':
      bot.moveVehicle(0.0, -1.0)
      break
    case 'move vehicle left':
      bot.moveVehicle(1.0, 0.0)
      break
    case 'move vehicle right':
      bot.moveVehicle(-1.0, 0.0)
      break
    case 'tp':
      bot.entity.position.y += 10
      break
    case 'pos':
      bot.chat(bot.entity.position.toString())
      break
    case 'yp':
      bot.chat(`Yaw ${bot.entity.yaw}, pitch: ${bot.entity.pitch}`)
      break
  }
})

bot.once('spawn', () => {
  // keep your eyes on the target, so creepy!
  setInterval(watchTarget, 50)

  function watchTarget () {
    if (!target) return
    bot.lookAt(target.position.offset(0, target.height, 0), true)
  }
})

bot.on('mount', () => {
  bot.chat(`mounted ${bot.vehicle.displayName}`)
})

bot.on('dismount', (vehicle) => {
  bot.chat(`dismounted ${vehicle.displayName}`)
})
