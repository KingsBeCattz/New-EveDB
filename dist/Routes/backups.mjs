import { l as lodashExports } from '../shared/default.e2d3b28e.mjs';
import { logger } from '../Auxiliar/logger.mjs';

const backups = [
  {
    url: "/backups/",
    method: "ANY",
    auth: false,
    code(ctx) {
      ctx.send(200, ctx.server.util.getBackups());
    }
  },
  {
    url: "/backups/get/",
    method: "GET",
    auth: false,
    code(ctx) {
      const { key, table, id } = ctx.querys;
      const data = ctx.server.util.getBackups()[id];
      if (!data)
        return ctx.send(404, "Backup not found");
      if (!table) {
        ctx.send(200, data);
      }
      if (table) {
        if (key) {
          ctx.send(200, {
            table,
            key,
            value: lodashExports.get(data[table], key) ?? null
          });
        } else {
          ctx.send(200, {
            table,
            data: data[table] ?? null
          });
        }
      }
    }
  },
  {
    url: "/backups/create/",
    method: "POST",
    auth: false,
    code(ctx) {
      try {
        ctx.send(200, {
          success: true,
          id: ctx.server.util.createBackup(true)
        });
      } catch (e) {
        logger.error("backup create", String(e));
        ctx.send(500, {
          success: false,
          id: null
        });
      }
    }
  },
  {
    url: "/backups/restore/",
    method: "POST",
    auth: false,
    code(ctx) {
      const { table, id, key } = ctx.body;
      try {
        if (!id)
          throw new Error("No backup ID provided");
        if (!table) {
          const success = ctx.server.util.restoreBackup(id);
          if (!success)
            throw new Error("Unexpected error while backuping");
          ctx.send(200, {
            success,
            id
          });
        } else {
          if (!key) {
            const success = ctx.server.util.restoreBackup(id, table);
            if (!success)
              throw new Error("Unexpected error while backuping");
            ctx.send(200, {
              success,
              id,
              table
            });
          } else {
            const success = ctx.server.util.restoreBackup(id, table, key);
            if (!success)
              throw new Error("Unexpected error while backuping");
            ctx.send(200, {
              success,
              id,
              table,
              key
            });
          }
        }
      } catch (e) {
        logger.error("backup restore", String(e));
        ctx.send(500, {
          success: false,
          id: id || null,
          table: table || null,
          key: key || null
        });
      }
    }
  },
  {
    url: "/backups/delete/",
    method: "DELETE",
    auth: false,
    code(ctx) {
      const { table, id, key } = ctx.body;
      try {
        const backups = ctx.server.util.getBackups();
        if (!id)
          throw new Error("No backup ID provided");
        const backup = backups[id];
        if (!backup)
          throw new Error("Invald ID");
        if (!table) {
          ctx.server.util.deleteBackup(id);
          ctx.send(200, {
            success: true,
            id
          });
        } else {
          if (!key) {
            const success = ctx.server.util.deleteBackup(id, table);
            if (!success)
              throw new Error("Unexpected error while deleting a backup");
            ctx.send(200, {
              success,
              id,
              table
            });
          } else {
            const success = ctx.server.util.deleteBackup(id, table, key);
            if (!success)
              throw new Error("Unexpected error while deleting a backup");
            ctx.send(200, {
              success,
              id,
              table,
              key
            });
          }
        }
      } catch (e) {
        logger.error("backup delete", String(e));
        ctx.send(500, {
          success: false,
          id: id || null,
          table: table || null,
          key: key || null
        });
      }
    }
  }
];

export { backups as default };
