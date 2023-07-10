'use strict'
const fetch = require('node-fetch')
const path = require('path')
const headers2get = ['x-ratelimit-bucket', 'x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-ratelimit-reset-after']
let discordUrl = process.env.DISCORD_PROXY || 'https://discord.com'
discordUrl += '/api'
let defaultHeaders
if(!process.env.DISCORD_PROXY && process.env.BOT_TOKEN) defaultHeaders = { "Authorization": "Bot "+process.env.BOT_TOKEN }
console.log('Using '+discordUrl+' for discordAPI calls...')
const parseResponse = async(res)=>{
  try{
    if(res){
      if (res?.status?.toString().startsWith('5')) {
        throw('Bad status code '+res.status)
      }
      let body, headers = {}

      if (res?.status === 204) {
        body = null
      } else if (res?.headers?.get('Content-Type')?.includes('application/json')) {
        body = await res?.json()
      } else {
        body = await res?.text()
      }
      if(res.headers){
        for(let i in headers2get){
          headers[headers2get[i]] = await res.headers?.get(headers2get[i])
        }
      }
      return {
        status: res?.status,
        body: body,
        headers: headers
      }
    }
  }catch(e){
    throw(e);
  }
}
const Send = async(uri, method, body, headers)=>{
  try{
    if(defaultHeaders) headers = { ...headers,...defaultHeaders }
    const res =  await fetch(path.join(discordUrl, uri), {
      headers: headers,
      method: method,
      body: body,
      timeout: 60000,
      compress: true
    })
    return await parseResponse(res)
  }catch(e){
    if(e?.name){
      return {error: e.name, message: e.message, type: e.type}
    }else{
      if(e?.status) return await parseResponse(e)
    }
  }
}
module.exports = Send
