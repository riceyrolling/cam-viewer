var currentCamera;
var errCount = 0;

var c = document.getElementById("stream");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

async function updateImage() {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.src = currentCamera + "&" + new Date().getTime();

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
            errCount = 0;
            resolve()
        }
    })
}

function nextCamera(config) {
    let currentPos = config.cameras.indexOf(currentCamera)
    if (currentPos == config.cameras.length - 1) {
        // On last camera
        currentCamera = config.cameras[0]
    } else {
        currentCamera = config.cameras[currentPos + 1]
    }
}

async function startStream(config) {
    currentCamera = config.cameras[0]

    setInterval(function() { nextCamera(config) }, 4000)
    
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

fetch("./config.json").then(res => res.json())
.then(out =>
    startStream(out))