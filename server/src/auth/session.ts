import config from "config";
import session, { MemoryStore, Store, SessionOptions } from "express-session";
import * as constructor_session from "express-session";
import MySQLStoreMeta, { MySQLStore as MySQLStoreType, Options as MySqlStoreOptions } from "express-mysql-session";

import { session_options_schema } from "@/common/config_schema";

function get_mysql_session_store(): MySQLStoreType {
  const MySQLStore = MySQLStoreMeta(constructor_session);
  const options = config.get("mysql.session") as MySqlStoreOptions;
  return new MySQLStore(options);
}

function get_memory_session_store(): MemoryStore {
  return new MemoryStore();
}

function get_session_store(): Store {
  if (process.env.NODE_ENV !== "production") {
    return get_memory_session_store();
  }

  return get_mysql_session_store();
}

const sessionStore = get_session_store();

const session_options = session_options_schema.parse(config.get("session")) as SessionOptions;
session_options.store = sessionStore;

export default session(session_options);
