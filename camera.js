export class Camera {
    constructor(camObj) {
        this.host = camObj.host;
        this.options = camObj.options;
    }

    calcOffset(img, c) {
        var wrh = img.width / img.height;
        let newWidth = c.width;
        let newHeight = newWidth / wrh;
        if (newHeight > c.height) {
            newHeight = c.height;
            newWidth = newHeight * wrh;
        }

        let xOffset = newWidth < c.width ? ((c.width - newWidth) / 2) : 0;
        let yOffset = newHeight < c.height ? ((c.height - newHeight) / 2) : 0;
        return { "x": xOffset, "y": yOffset }
    }
}

export class Mobotix extends Camera {
    constructor(camObj) {
        super(camObj)
    }

    get snapshotUrl() {
        return this.buildUrl()
    }

    buildUrl() {
        let uri = "http://" + this.host + "/cgi-bin/image.jpg"
        if (this.options) {
            uri += "?"
            if (this.options.lens) uri += "camera=" + this.options.lens + "&";
        }

        uri += "rand=" + new Date().getTime();
        return uri
    }

    drawImage(canvas) {
        var img = new Image()
        img.onload = function () {
            offset = this.calcOffset(img, canvas);
            ctx.drawImage(img, offset.x, offset.y)
        }
        img.src = this.buildUrl()
    }
}

export class Hikvision extends Camera {
    constructor(camObj) {
        super(camObj)
    }

    get snapshotUrl() {
        return this.buildUrl()
    }

    buildUrl() {
        let uri = "http://" + this.host + "/ISAPI/Streaming/channels/1/picture?"
        if (this.options) {
            uri += "?"
            if (this.options.lens) uri += "camera=" + this.options.lens + "&";
        }

        uri += "rand=" + new Date().getTime();
        return uri
    }

    drawImage(canvas) {
        var img = new Image()
        img.onload = function () {
            offset = this.calcOffset(img, canvas);
            ctx.drawImage(img, offset.x, offset.y)
        }
    }
}