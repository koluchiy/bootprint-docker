Small package to build documentation from swagger.

Build on top of [node.js](https://nodejs.org/en/), [bootprint](https://github.com/bootprint/bootprint-openapi) and [html-minifier](https://github.com/kangax/html-minifier)

# Examples

##Local run
`git clone git@github.com:koluchiy/bootprint-docker.git`
`npm i`
`node run.js -s https://example.com/swagger.json`

This command creates not minified docs inside `tmp` folder and minified `out.html` inside current folder.
You can path filesystem or web link for your swagger.json through option `-s`.
You can specify folder for unminified result through option `-tmp`.

##Docker

`mkdir result`
`docker run -v ${PWD}/result:/tmp/bootprint -u $(id -u):$(id -g) koluchiy/docker-bootprint -s https://example.com/swagger.json`

This command put result of building docs in your local folder `result`.
Folder `result` will contain html, css and js files, building with `bootprint` and file `out.html` will contain minimized and concated result of bootprint.