###
# Testing performance of outbound http requests from Lambdas in aggregate
#

# pre-requisites:
This service assumes you already have a VPC created in your target environment.
update the vpc.yml with your vpc settings.

# To deploy:
1. configure your vpc settings in vpc.{stage}.yml or vpc.yml
2. install node dependencies:
  npm i
3. deploy
  sls deploy -s {stage} -v
4. invoke with
  sls invoke -s {stage} -f aggregate -d '{"threads":2}'

There are 8 unique Lambda workers defined.
The `threads` argument will create an array of threads size and and fill it with the worker function names.
Then fire all instances in parallel using [].map

Here's an example result with 2 threads/workers:
{
    "workers": [
        {
            "origin": "35.163.142.178",
            "worker": "parallel-lambda-http-test-one-brett-workerOne",
            "threadId": 0,
            "runtime": "273ms"
        },
        {
            "origin": "35.163.142.178",
            "worker": "parallel-lambda-http-test-one-brett-workerTwo",
            "threadId": 1,
            "runtime": "216ms"
        }
    ],
    "aggregateRuntime": "273ms"
}

I've run it with 200 threads.


Variations:
1. If you want only the workers in a vpc, comment out the line under `aggregatorVpc:` in serverless.yml
2. If you want no lambdas in a vpc, then also comment ot the line under `workerVpc:` in serverless.yml

Ignore warnings displayed during deployment when vpc's are commented out.
