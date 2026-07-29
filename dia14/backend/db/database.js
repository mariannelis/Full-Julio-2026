const fs = require("fs/promises");
const path = require("path");

const databasePath = path.join(__dirname, "users.json");

async function readUsers() {
  const content = await fs.readFile(databasePath, "utf8");
  return JSON.parse(content);
}

async function writeUsers(users) {
  await fs.writeFile(
    databasePath,
    JSON.stringify(users, null, 2),
    "utf8"
  );
}

function generateUserId(users) {
  const ids = users.map((user) => Number(user.id) || 0);
  return Math.max(0, ...ids) + 1;
}

module.exports = {
  readUsers,
  writeUsers,
  generateUserId
};