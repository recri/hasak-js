# hasak-js
A controller for Hasak keyers.

Hasak-js is a web application which can run on any device which runs a web browser.  It will
only work on web browsers which support the Web MIDI API, such as Google Chrome.  It can 
control any keyer which is plugged into a USB port on the device.  It can be installed
on the device so it is available even when disconnected from the internet.

[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)

## startup
Hasak-js finds hasak keyers by their MIDI handles. 

For each keyer found it displays the MIDI handle, the keyer speed (WPM),
master level (%), sidetone level (%), sidetone frequency (Hz), and a gear
icon.

The displayed values can be manipulated by grabbing and dragging or 
by hovering and mousewheeling.

The gear icon opens a more detailed configuration for the selected keyer.

Hasak-js may also present a simulated keyer to allow you to check it out without
keyer hardware.

## detailed configuration
The detailed configuration is structured as tree of cards which are organized to
expose the most useful details.
