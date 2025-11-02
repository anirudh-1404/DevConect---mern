import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  console.log("salt", salt);
  const hashed = await bcrypt.hash(password, salt);
  console.log("pass", hashed);
  return hashed;
};
