import { EntityManager, getConnection } from "typeorm";
import { User } from "./entities/user";

const createHandler = (templateClass: Function) => {
  return {
    get: (target: any, prop: string) => {
      try {
        const repo: any = getConnection().getRepository(templateClass);

        return repo[prop];
      } catch (e) {
        return null;
      }
    },
  };
};

export const transaction = async (
  cb: (manager: EntityManager) => Promise<void>
) => {
  const m = getConnection().manager;

  return await m.transaction(cb);
};

export const entities = [User];
