import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export default abstract class BaseTimeStamp {
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
