import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class TrackedEntity {
  @CreateDateColumn({ select: false })
  created?: Date;

  @UpdateDateColumn({ select: false })
  updated?: Date;

  @DeleteDateColumn({ select: false, nullable: true })
  deleted?: Date;
}
