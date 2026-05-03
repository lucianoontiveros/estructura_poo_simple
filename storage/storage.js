import fs from "fs";

const DB_PATH = "./db.json";

const guardarDB = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

const cargarDB = () => {
  if (!fs.existsSync(DB_PATH)) return null;
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
};

export { cargarDB, guardarDB };
