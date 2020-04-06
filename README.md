# RUN
`yarn install` then `yarn start`

# Usage
* gcs: `/resize/gcs/{bucket}/{encodeURIComponent('your/img/path.png')}/?w=&h=`
* general: host on server `/resize/uri/{encodeURIComponent(https://path/to/image.png)}/?w=&h=`

## available params
| param  | desc                                                         | required |
| :----- | :----------------------------------------------------------- | :------: |
| w      | width,numeric                                                |    v     |
| h      | height,numeric                                               |    v     |
| q      | quality,0 ~ 100                                              |          |
| fit    | fit, `cover|contain|fill|inside|outside`, default: `contain` |          |
| format | format, string, `webp|jpg|jpeg|gif|png`, lowercase           |          |

## note
php use `rawurlencode` as `encodeURIComponent`
## Production
`yarn install --production`
## reference
* [sharp.js official doc](https://sharp.pixelplumbing.com/)
