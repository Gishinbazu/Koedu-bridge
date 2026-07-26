// scripts/setPassword.ts
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.model";

async function run() {
  await mongoose.connect("TON_MONGODB_URI_ICI");

  const email = "koeduagent@gmail.com";
  const plain = "Koedu123!";

  const hash = await bcrypt.hash(plain, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hash },
    { new: true }
  );

  console.log("Updated user:", user);
  await mongoose.disconnect();
}

run().catch(console.error);
