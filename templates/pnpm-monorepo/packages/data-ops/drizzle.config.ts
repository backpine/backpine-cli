import type { Config } from "drizzle-kit";

const config: Config = {
  out: "src/drizzle",
  dialect: "mysql",

  dbCredentials: {
    url: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/studio?sslaccept=strict`,
  },
  tablesFilter: ["!_cf_KV"],
};

export default config satisfies Config;
