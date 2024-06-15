import backups from './backups.mjs';
import tables from './tables.mjs';
import '../shared/default.e2d3b28e.mjs';
import '../Auxiliar/logger.mjs';

const routes = {
  home: [
    {
      url: "/",
      method: "ANY",
      auth: false,
      code(ctx) {
        ctx.send(200, {
          tables: ctx.server.util.getTables(),
          backups: ctx.server.util.getBackups()
        });
      }
    }
  ],
  tables,
  backups
};

export { routes };
