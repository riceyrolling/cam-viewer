var currentCamera = cameras[0]
var c = document.getElementById("stream");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

async function updateImage() {
    var img = new Image();

    img.src = "http://" + currentCamera + "/cgi-bin/image.jpg?" + new Date().getTime();
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

        updateImage()
    }
}

async function nextCamera() {
    let currentPos = cameras.indexOf(currentCamera)
    if (currentPos == cameras.length-1) {
        // On last camera
        currentCamera = cameras[0]
    } else {
        currentCamera = cameras[currentPos+1]
    }
}

updateImage()

setInterval(nextCamera,4000)