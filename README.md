# Up & running
* develop
`npm i` && `npm start:dev`
* production 
`npm ci` && `npm start`

# General Usage
* gcs:
```
/resize/gcs/<bucket>/<encodeURIComponent('your/img/path.png')>/?w=&h=
```
* uri: host on server
```
/resize/uri/<encodeURIComponent(https://path/to/image.png)>/?w=&h=
```

## available params
| param  | desc                                                             | required |
| :----- | :--------------------------------------------------------------- | :------: |
| w      | width,numeric                                                    |    v     |
| h      | height,numeric                                                   |    v     |
| q      | quality,0 ~ 100                                                  |          |
| fit    | fit, `cover\|contain\|fill\|inside\|outside`, default: `contain` |          |
| format | format, string, `webp\|jpg\|jpeg\|gif\|png`, lowercase           |          |

## note
php use `rawurlencode` as `encodeURIComponent`

* request, neither of them are optional
```json
{
  "hosts":["example.com", "test.com"],
  "buckets": ["bucket1", "bucket2"]
}
```
## get
same as add but using GET

# reference
* [sharp.js official doc](https://sharp.pixelplumbing.com/)
