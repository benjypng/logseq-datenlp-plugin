[[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

> This README has not been completely updated. Feel free to ask around Discord for a feature request!

# Overview

This super simple plugin uses NLP to parse your content for dates and times so that they can be easily tracked through your yournal pages.

## Simple Parsing

![](/screenshots/demo.gif)

## Complex Parsing with Scheduled and Deadline options

![](/screenshots/demo2.gif)

## Auto Inline Parsing

As per the video, use `%enable auto-parsing%` to turn on auto parsing (off by default) and `%disable auto-parsing%` to turn it off.

Or, you can just use the hotkey combination `a p` to toggle auto-parsing on and off.

![](/screenshots/demo3.gif)

## Semi-auto Inline Parsing

Like auto inline-parsing, but this time the parsing is triggered only if the date/time language is prefixed with an `@`, `%` or `^`. Without the prefix, the block will not auto-parse. The available prefixes are:

-   `@` is to simply parse the date
-   `%` converts it to a scheduled item
-   `^` converts it to a deadline item

You can use the hotkey combination `s p` to toggle semi-auto-parsing on and off. See the video below for instructions:

![](/screenshots/demo6.gif)

## Using the Command Palette

Use `Ctrl + Shift + p` for Windows or `Cmd + Shift + p` for Mac. Then type `@goto` and select the first option that comes up. You will be presented with a search box to enter the day or date you want to go to.

![](/screenshots/demo5.gif)

## Changing languages

Currently, the following languages are supported:

4. German: `de`
3. French: `fr`
1. Japanese: `ja`
2. Dutch: `nl`
6. Portuguese: `pt`
5. Russion: `ru`
7. Chinese: `zh`

Add the following line inside the plugin settings, and change the language accordingly:

```
    {
        "lang": "ja"
    }
```

![](/screenshots/demo4.gif)

# Installation

If the plugin is not available in the marketplace, you can load it manually by downloading the [latest release here](https://github.com/hkgnp/logseq-datenlp-plugin/releases) and manually loading it into Logseq.

# Credits

[SherlockJS](https://github.com/neilgupta/Sherlock)

[Chrono](https://github.com/wanasit/chrono)

Darwis once again for his out of the box thinking
