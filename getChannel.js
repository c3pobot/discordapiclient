'use strict'
const apiRequest = require('./apiRequest')
const ReportError = require('./reportError')
module.exports = async(chId)=>{
  try{
    if(!chId) return
    const obj = await apiRequest('channels/'+chId, 'GET', null, {"Content-Type": "application/json"})
    ReportError(obj, 'GetChannel', {chId: chId})
    return obj?.body
  }catch(e){
    throw(e)
  }
}
