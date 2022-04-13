# cam-viewer
HTML and JS display for Mobotix cameras running in Chrome kiosk.

## Motivation
$600 AUD for a Mobotix ThinClient? No thanks.

## How to use
This repo will NOT play in your browser. Browser must already be basic auth authenticated to access camera image in iframe. Cors needs to be disabled for request to work.
I used this with [chilipie-kiosk](https://github.com/jareware/chilipie-kiosk) with Chrome extension for basic auth and cors disabled flag added to .xsession.

Add camera IP's to config.js in array.
