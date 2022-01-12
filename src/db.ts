import { Pool } from "pg";

const connectionString = 'postgres://lluoknwv:fPnMziQkoH5H_BKQkXGkVXimwpMgwCIt@kesavan.db.elephantsql.com/lluoknwv';

const db = new Pool({ connectionString });

export default db;