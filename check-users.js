// check-users.js
import { db } from "./src/lib/db/index.js";
import { users } from "./src/lib/db/schema.js";

async function check() {
  try {
    const result = await db.select().from(users);
    console.log(result);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

check();
