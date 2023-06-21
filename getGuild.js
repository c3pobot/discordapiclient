'use strict'
const apiRequest = require('./apiRequest')
const ReportError = require('./reportError')
module.exports = async(sId)=>{
  try{
    if(!sId) return;
    const res = await apiRequest('guilds/'+sId+'?with_counts=true', 'GET', null, {"Content-Type": "application/json"})
    ReportError(res, 'GetGuild', {sId: sId})
    return res?.body
  }catch(e){
    console.error(e)
  }
}
