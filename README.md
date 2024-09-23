# hasak-js
[A controller for Hasak keyers.](https://hasak.elf.org)

Hasak-js is a web application which should run on any device which runs a web browser.
[At the moment it is only fully functional on desktop computer browsers.  The problem
with Android and ChromeOS browsers is being investigated.]

It requires a web browser which supports the Web MIDI API, such as Google Chrome.
But most modern browsers are based on Google's Chromium project and they work.

It will find any MIDI device which is plugged into a USB port on the device.  It can display
basic MIDI information about any device, but it will also detect and control any hasak based
keyer that it finds.

There is a problem with the tools shipped with KxStudio on Linux.  They somehow interfere with
hasak discovering or connecting to MIDI devices.  Stopping the jackd server supplied by KxStudio
will work around the problem.  There is no such problem running jackd on Ubuntu 24.04.

It can be installed on the device so it is available even when disconnected from the internet.

[![Built with open-wc recommendations](https://img.shields.io/badge/built%20with-open--wc-blue.svg)](https://github.com/open-wc)

## startup
Hasak-js finds the connected MIDI devices through the Web MIDI API. 

It constructs a menu which allows one of the devices to be selected for inspection.  Selecting
a device constructs a second menu for selecting which informational panels or controls should
be displayed for the device.

If the selected device is a hasak keyer, then by default a 'minimum' control panel is displayed.
The mininum controls set the keyer speed (WPM), master volume level (dB/10), sidetone volume level 
(dB/10), sidetone frequency (Hz), and switches for enabling analog inputs, hardware audio output, 
and swapping the paddles.

Each displayed numeric value can be manipulated by clicking on the value and clicking on the spinner
buttons, using the cursor up/down keys, or by editing the displayed number.

Keyboard traversal via Tab and Shift-Tab allows you to move between displayed values.  A space will
toggle the value of a switch.

