const lambda = require('aws-sdk/clients/lambda')
const workerFunctionNames = ['workerOne', 'workerTwo', 'workerThree', 'workerFour', 'workerFive', 'workerSix', 'workerSeven', 'workerEight']

const duration = hrstart => {
  const hrend = process.hrtime(hrstart) 
  return Math.floor(hrend[0]*1000 + hrend[1]/1000000)
}
/**
 * main function that invokes 8 worker functions in parallel and captures execution time
 * 
 * @param {*} event 
 */
const handle = async (event) => {
  console.log(`${process.env.FUNCTION_NAME}`)
  const threads = event.threads || 8

  const totalstart = process.hrtime() // capture overall starttime

  const Lambda = new lambda()

  // Make an array `threads` in size and fill with workerFunctionNames
  const workerNames = Array.from({ length: threads }, (x, i) => workerFunctionNames[i % workerFunctionNames.length])

  const res = await Promise.all(
    workerNames.map(async (name, threadId) => {
      const workerstart = process.hrtime()  // capture individual worker starttime

      // invoke worker
      const res = await Lambda.invoke({ 
        FunctionName: process.env.FUNCTION_PREFIX + name,
        Payload: JSON.stringify({
          threadId
        })
      }).promise()

      const ret = {
        ...JSON.parse(res.Payload),
        runtime: `${duration(workerstart)}ms`
      }
      return ret
    })
  )

  console.log(`res: ${JSON.stringify(res, null, 2)}`) // write worker results to console
  console.log(`aggregate runtime: ${duration(totalstart)}ms`)  // write overall runtime to console.

  return {
    workers: res,
    aggregateRuntime: `${duration(totalstart)}ms`
  }
}
module.exports = { handle }