'use strict'
const apiRequest = require('./apiRequest')
const ReportError = require('./reportError')
module.exports = async(sId, dId)=>{
  try{
    if(!sId || !dId) return;
    const res = await apiRequest('guilds/'+sId+'/members/'+dId, 'GET', null, {"Content-Type": "application/json"})
    ReportError(res, 'GetGuildMember', {sId: sId, dId: dId})
    return res?.body
  }catch(e){
    console.error(e)
  }
}
