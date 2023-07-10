'use strict'
const log = require('./logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
const Cmds = {}
Cmds.apiRequest = require('./apiRequest')
Cmds.GetGuild = require('./getGuild')
Cmds.GetGuildMember = require('./getGuildMember')
Cmds.SendMsg = require('./sendMsg')
Cmds.WebHookMsg = require('./webHookMsg')
module.exports = Cmds
