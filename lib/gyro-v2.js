// const acceleration = { x: 0, y: 0, z: 0}
// const deviceOrientation = { alpha: 0, beta: 0, gamma: 0 }

const gyro = { alpha: 0, beta: 0, gamma: 0, aX: 0, aY: 0, aZ: 0, accelerationIncludingGravity: { x: 0, y: 0, z: 0 } }

let showLog = false
let buttonEl = {}

let requestStatus = 'not yet requested'

let logElement = document.createElement('div')
logElement.style.background = "rgba(10, 20, 10, 0.7)"
logElement.style.color = "hotpink"
logElement.style.position = 'fixed'
logElement.style.bottom = '0px'
logElement.style.right = '0px'
logElement.style.padding = '0px'
logElement.style.pointerEvents = 'none'
logElement.style.width = '300px'

// document.body.appendChild(logElement)

const updateLog = () => {

    let params = Object.entries(gyro).map(
        ([key, value]) => {
            if (typeof value === 'number') return `${key} : ${value}
`
            if (typeof value === 'object') return `${key} : ${Object.entries(value).map(
                ([k, v]) => ` ${k} : ${v}
                `).join('')}`
            return null
        }).join('')

    logElement.innerText = `REQUEST STATUS: ${requestStatus}
${params}
`
    console.log(gyro)
}


const handleOrientation = (event) => {
    //deviceOrientation = event
    // update gamma, beta, alpha props
    // console.log(gyro, event)
    gyro.alpha = event.alpha / 100
    gyro.beta = event.beta / 100
    gyro.gamma = event.gamma / 100
    updateLog()
    // if(showLog)  updateLog()

}


const handleMotion = (event) => {
    // console.log('motion event')
    gyro.aX = event.acceleration.x
    gyro.ay = event.acceleration.y
    gyro.az = event.acceleration.z
    gyro.accelerationIncludingGravity = event.accelerationIncludingGravity
    // if(showLog) 
    updateLog()
    //deviceOrientation = event
    // update gamma, beta, alpha props
    // Object.assign( gyro, event )
}


// editor = document.getElementById('editor-container')
// b = document.createElement('button')
// b.innerText = 'request accelerometer permissions'
// b.style.position = 'fixed'
// editor.appendChild(b)


const requestPermissions = (el) => {
    buttonEl = el
    buttonEl.addEventListener('click', () => {
        if (window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === 'function') {
            // Handle iOS 13+ devices.

            window.DeviceMotionEvent.requestPermission()
                .then((state) => {
                    if (state === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation)
                        window.addEventListener("devicemotion", handleMotion)
                        buttonEl.style.opacity = 0
                        buttonEl.style.pointerEvents = 'none'
                        requestStatus = 'permission granted, listening to motion events'
                    } else {
                        requestStatus = 'permission denied'
                        console.warn('Request to access the orientation was rejected')
                    }
                })
                .catch((err) => {
                    requestStatus = `ERROR: ${err.message}`
                    console.error(err)
                });

        } else {
            requestStatus = 'no permission needed listening to motion events'

            // Handle regular non iOS 13+ devices.
            window.addEventListener('deviceorientation', handleOrientation)
            window.addEventListener("devicemotion", handleMotion)
            buttonEl.style.opacity = 0
            buttonEl.style.pointerEvents = 'none'
        }
        updateLog()
    })
    updateLog()
}




gyro.requestPermissions = requestPermissions

gyro.show = () => {
    showLog = true
    document.body.appendChild(logElement)
    // console.log('appending', logElement)
}
gyro.hide = () => {
    showLog = false
    document.body.removeChild(logElement)
}

updateLog()
// document.addEventListener('load', gyro.log
// gyro.log()
window.gyro = gyro

// export default gyro