const fetch = require('node-fetch')


/**
 * Simple worker that makes an http call to httpbin and returns my ip address
 */
const handle = async (event) => {
  console.log(`worker[${process.env.FUNCTION_NAME}]`)
  
  try {
    const result = await fetch(`https://httpbin.org/ip`)
    let { origin } = await result.json()

    return { origin, worker: process.env.FUNCTION_NAME, threadId: event.threadId }
  } catch (err) {
    console.error(`calling httpbin.org`)
    return { error: err.message }
  }
}
module.exports = { handle }