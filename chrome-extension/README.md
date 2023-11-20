# Cortex Devtool

## Development

### Prerequites

Install fswatch:
`brew install fswatch`

Install the [Chrome extension loader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)

install the project:

`yarn install`

Build it for the first time, so the html and js files can be readable by Chrome with:

`yarn build`

Activate the developer mode on Install the [chrome://extensions/](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) (top right switch)

load the unload extension from `dist`

## Developing

The process for developing a Chrome extension can be really exhausting and repetitive,

run `yarn dev` to rebuild the Chrome extension whenever any file changes
run `yarn refresh` to listen to any change in the build folder and reload automatically the extension

You still will have to manually close and reopen the Chrome devtools panel each time though
