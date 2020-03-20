# RUN
`yarn install` then `yarn start`

# preformance test
1. install wrk
```sh
brew install wrk
```
2. get imglist
```sh
cd test && node getimg.js
```
3. run test
```sh
# run resizer : change test.lua to read all
# run general : change test.lua to read simpleall.json
wrk -t5 -c5 -d10s --timeout 2s  -s ./test.lua --latency http://localhost:3000
```

# Usage
* gcs: `/resize/gcs/{bucket}/{encodeURIComponent('your/img/path.png')}/?w=&h=`
* general: host on server `/resize/uri/{encodeURIComponent(https://path/to/image.png)}/?w=&h=`

## available params
| param | desc                                                       | required |
| :---- | :--------------------------------------------------------- | :------: |
| w     | width,numeric                                              |    v     |
| h     | height,numeric                                             |    v     |
| q     | quality,0 ~ 100                                            |          |
| fit   | fit, `cover|contain|fill|inside|outside`, default: `cover` |          |

## note
php use `rawurlencode` as `encodeURIComponent`

## reference
* [sharp.js official doc](https://sharp.pixelplumbing.com/)
