const emulator = require('./emulators-runner')
const admin = require('firebase-admin')

before('Init Admin App', function () {
    admin.initializeApp()
})
before('Start Emulator', function () {
    this.timeout(60_000) // it's real slow sometimes on windows
    return emulator.start()
})
after(emulator.stop)