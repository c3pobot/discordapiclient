'use strict'
const fetch = require('node-fetch')
const path = require('path')
const ReportError = require('/reportError')
const headers2get = ['x-ratelimit-bucket', 'x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'x-ratelimit-reset-after']
const discordUrl = process.env.DISCORD_PROXY || 'https://discord.com'
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
    console.error(e);
  }
}
const Send = async(uri, method, body, headers)=>{
  try{
    const res =  await fetch(path.joind(discordUrl, uri), {
      headers: headers,
      method: method,
      body: body,
      timeout: 60000,
      compress: true
    })
    return await parseResoponse(res)
  }catch(e){
    if(e?.name){
      return {error: e.name, message: e.message, type: e.type}
    }else{
      if(e?.status) return await parseResoponse(e)
    }
  }
}
module.exports = Send
