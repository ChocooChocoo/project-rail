import "dotenv/config";

import mariadb from "mariadb";

import { randomUUID } from "node:crypto";

const users = [
  {
    name: "Olivia Rhye",
    username: "oliviarhye",
    email: "olivia.rhye@weblabs.studio",
    avatar: "",
    role: "administrator",
  },
  { name: "Phoenix Baker", username: "phoenixbaker", email: "phoenix.baker@weblabs.studio", avatar: "", role: "admin" },
  { name: "Lana Steiner", username: "lanasteiner", email: "lana.steiner@acme.inc", avatar: "", role: "admin" },
  {
    name: "Demi Wilkinson",
    username: "demiwilkinson",
    email: "demi.wilkinson@weblabs.studio",
    avatar: "",
    role: "admin",
  },
  { name: "Candice Wu", username: "candicewu", email: "candice.wu@sandbox.dev", avatar: "", role: "user" },
  { name: "Natali Craig", username: "natalicraig", email: "natali.craig@acme.inc", avatar: "", role: "user" },
  { name: "Drew Cano", username: "drewcano", email: "drew.cano@weblabs.studio", avatar: "", role: "user" },
  { name: "Orlando Diggs", username: "orlandodiggs", email: "orlando.diggs@acme.inc", avatar: "", role: "user" },
  { name: "Andi Lane", username: "andilane", email: "andi.lane@sandbox.dev", avatar: "", role: "user" },
  { name: "Kate Morrison", username: "katemorrison", email: "kate.morrison@weblabs.studio", avatar: "", role: "admin" },
];

const now = new Date();
const rows = users.map((user) => [
  randomUUID(),
  user.name,
  user.username,
  user.email,
  user.avatar,
  user.role,
  now,
  now,
]);

const dbUrl = new URL(process.env.DATABASE_URL);
const pool = mariadb.createPool({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1),
});

try {
  const conn = await pool.getConnection();
  await conn.batch(
    "INSERT IGNORE INTO `User` (id, name, username, email, avatar, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    rows,
  );
  const [{ total }] = await conn.query("SELECT COUNT(*) AS total FROM `user`");
  console.log(`Seeded ${users.length} users (${total} total in table).`);
  await conn.release();
} finally {
  await pool.end();
}
