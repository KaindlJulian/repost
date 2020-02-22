export interface BotStatus {
  status: string;
  monit: {
    memory: number;
    cpu: number;
  };
  env: {
    uptime: number;
    instances: number;
  };
}
