import { hash as hashBcrypt, compare as compareBcrpyt } from "bcrypt";

const saltOrRounds = 10;

export const hash = async (string: string): Promise<string> => {
  return await hashBcrypt(string, saltOrRounds);
};

export const compare = async (raw: string, hash: string) => {
  return await compareBcrpyt(raw, hash);
};
