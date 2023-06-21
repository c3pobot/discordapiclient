'use strict'
const FormData = require('form-data');
const Send = require('./nodeFetch')
const ReportError = require('/reportError')
const baseUrl = 'api/webhooks/'+process.env.DISCORD_CLIENT_ID
const SendMsg = async(token, msg2send, method = 'POST')=>{
  try{
    let url = baseUrl+'/'+token
    if(method === 'PATCH') url += '/messages/@original'
    if(typeof msg2send != 'object' && typeof msg2send == 'string') msg2send = {content: msg2send}
    if(!msg2send.content) msg2send.content = null
    if(!msg2send.components) msg2send.components = []
    const res = await Send(url, method, JSON.stringify(msg2send), {"Content-Type": "application/json"})
    if((res?.status !== 200 && res?.status) || res.error){
      if(res?.status > 300 && (res?.body?.embeds || res?.body?.content)){
        await Send(url, method, JSON.stringify({content: 'Your command was successful. however there was an error displaying the results. It may be that there is too much data to display'}), {"Content-Type": "application/json"})
      }
      return;
    }
    return res?.body
  }catch(e){
    console.error(e);
  }
}
const SendFile = async(token, msg2send, method = 'POST')=>{
  try{
    if(msg2send?.file && !msg2send.fileName) return
    let url = baseUrl+'/'+token, fileCount = 0
    if(method === 'PATCH') url += '/messages/@original'
    const tempObj = {content: msg2send.content || null}
    if(msg2send.components) tempObj.components = msg2send.components
    const form = new FormData()
    if(msg2send.files){
      for(let i in msg2send.files){
        if(msg2send.files[i].file && msg2send.files[i].fileName){
          form.append('file'+(+i + 1), msg2send.files[i].file, msg2send.files[i].fileName)
          count++
        }
      }
    }else{
      form.append('file', msg2send.file, msg2send.fileName)
      count++
    }
    if(count === 0) return;
    form.append('payload_json', JSON.stringify(tempObj))
    const res = await Send(url, method, form, {})
    return res?.body
  }catch(e){
    console.error(e);
  }
}
module.exports = async(token, msg2send, method = 'POST')=>{
  try{
    if(!token || !msg2send) return;
    if(msg2send?.file || msg2send?.files?.length > 0){
      return await SendFile(token, msg2send, method)
    }else{
      return await SendMsg(token, msg2send, method)
    }
  }catch(e){
    console.error(e);
  }
}
