import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export default abstract class BaseTimeStamp {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
