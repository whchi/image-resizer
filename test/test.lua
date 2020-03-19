local json = require "json"
function shuffle(paths)
    local j, k
    local n = #paths

    for i = 1, n do
      j, k = math.random(n), math.random(n)
      paths[j], paths[k] = paths[k], paths[j]
    end

    return paths
end

function load_request_objects_from_file(file)
    local data = {}
    local content

    -- Check if the file exists
    -- Resource: http://stackoverflow.com/a/4991602/325852
    local f=io.open(file,"r")
    if f~=nil then
      content = f:read("*all")

      io.close(f)
    else
      -- Return the empty array
      return lines
    end
    -- Translate Lua value to/from JSON
    data = json.decode(content)

    return shuffle(data)
end

requests = load_request_objects_from_file("./all.json")
-- requests = load_request_objects_from_file("./simpleall.json")

if #requests <= 0 then
    print("multiplerequests: No requests found.")
    os.exit()
end

print("multiplerequests: Found " .. #requests .. " requests")

counter = 1

request = function()
    -- Get the next requests array element
    local request_object = requests[counter]
    -- Increment the counter
    counter = counter + 1

    -- If the counter is longer than the requests array length then reset it
    if counter > #requests then
        counter = 1
    end
    -- Return the request object with the current URL path
    return wrk.format('GET', request_object)
end
-- wrk report to output CSV

-- local report = os.getenv('WRK_REPORT') or 'report.csv'
-- local output = assert(io.open(report, 'w+'))

-- local labels = {
-- 	'latency_min', 'latency_max','latency_mean', 'latency_stdev',
-- 	'latency_p50', 'latency_p90', 'latency_p95', 'latency_p99',
-- 	'rps', 'duration', 'requests', 'bytes',
-- 	'errors_connect',
-- 	'errors_read',
-- 	'errors_write',
-- 	'errors_status',
-- 	'errors_imeout'
-- }

-- done = function(summary, latency)
-- 	local errors = summary.errors
-- 	output:write(table.concat(labels, ','))
-- 	output:write('\n')
-- 	output:write(table.concat({
-- 		latency.min/1000, latency.max/1000, latency.mean/1000, latency.stdev,
-- 		latency:percentile(50)/1000, latency:percentile(90)/1000, latency:percentile(95)/1000, latency:percentile(99)/1000,
-- 		summary.requests/summary.duration*1000*1000, summary.duration, summary.requests, summary.bytes,
-- 		errors.connect, errors.read, errors.write, errors.status, errors.timeout,
-- 	},','))
-- 	output:write('\n')
-- end
-- local cnt = 0;
logfile = io.open("wrk.log", "w");
-- logerrfile = io.open("wrkerr.log", "w");
-- log304file = io.open("wrk304.log", "w")
response = function(status, headers, body)
    if status ~= 200 then
        logfile:write("status:" .. status .. ", header:" .. headers['Content-Type'] .. "\n");
    -- elseif status == 400 then
    --     logerrfile:write("status:" .. status .. ", content:" .. body .. "\n");
    -- else
    --     logfile:write("status:" .. status .. ", header:" .. headers['Content-Type'] .. "\n");
    end
end
