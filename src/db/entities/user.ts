import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TrackedEntity } from "../common/tracked";
import { DEFAULT_SCHEMA } from "../../consts";

@Entity("TBL_USER", { schema: DEFAULT_SCHEMA })
export class User extends TrackedEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username: string;
}
