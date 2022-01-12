import { Pool } from "pg";

const connectionString = 'CONECT_YOUR_DATABASE';

const db = new Pool({ connectionString });

export default db;
