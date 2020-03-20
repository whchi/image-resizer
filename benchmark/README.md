1. install wrk
```sh
brew install wrk
```
2. get imglist
```sh
node getimg.js
```
3. run test
```sh
# run resizer : change test.lua to read all
# run general : change test.lua to read simpleall.json
wrk -t5 -c5 -d10s --timeout 2s  -s ./test.lua --latency http://localhost:3000
```
