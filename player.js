import {Mobotix, Hikvision} from './camera.js'
var currentCamera;
var errCount = 0;

var c = document.getElementById("stream");
var ctx = c.getContext("2d");

async function updateImage() {
    return new Promise((resolve, reject) => {
        var img = new Image();

        img.onload = function () {
            var wrh = img.width / img.height;
            var newWidth = c.width;
            var newHeight = newWidth / wrh;
            if (newHeight > c.height) {
                newHeight = c.height;
                newWidth = newHeight * wrh;
            }

            var xOffset = newWidth < c.width ? ((c.width - newWidth) / 2) : 0;
            var yOffset = newHeight < c.height ? ((c.height - newHeight) / 2) : 0;
            ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
            resolve()
            errCount = 0;
        }

        img.src = currentCamera.snapshotUrl
    })
}

async function streamManager(configFile) {

    // Prepare camera objects
    var streams = []
    configFile.cameras.forEach(camera => {
        switch(camera.type) {
            case "mobotix": streams.push(new Mobotix(camera));
            break;

            case "hikvision": streams.push(new Hikvision(camera));
            break;
        }
    });

    setTimeout(startPlayer,1000) // wait for first camera to be selected and start player

    for (;;) {
        for (let index = 0; index < streams.length; index++) {
            currentCamera = streams[index]
            await new Promise(resolve =>
                setTimeout(
                  () => resolve(),
                  4000)
            )
        }
    }

}

async function startPlayer() {
    for (;;) {
        let timeout = new Promise((res) => setTimeout(() => {
            errCount++
            console.error("ERROR: Timeout won race")
            if (errCount > 10) {
                location.reload()
            }
            res("p1")
        }, 5000));
        let imageJob = updateImage();
        await Promise.race([timeout, imageJob])
    }
}

window.onload = function() {
    fetch("./config.json").then(res => res.json())
    .then(out =>
        streamManager(out))
}

async function updateScreenSize(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}
setInterval(updateScreenSize,10000)