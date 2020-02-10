# process manager

probably stay with pm2 (https://pm2.keymetrics.io/docs/usage/pm2-api/)
maybe switch to adios: https://github.com/elliotttf/adios
use cluster without library https://nodejs.org/api/cluster.html

# endpoints

- bot stats by name or all (GET /bot/(:name))
- yeet up new bot (POST /bot {... bot config (script input(args, env_vars)) ...})
- stop/restart/delete bot (POST /bot/:name {"action": ...}) (... also, we dont care about PUT and DELETE. fuck those)
  maybe also an action to send message to a bot directly, eg. change schedule on the fly

- pm2 dump (GET /dump)
- get logs (GET /log)
- flush/rotate logs (POST /log {"action": ...})

# bot

inputs

- reddit urls
- post schedule
- instagram credentials

exposed functions

- change post schedule
