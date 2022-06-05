import { BeforeInsert, PrimaryColumn, Unique } from "typeorm";
import { randomBase64 } from "../utilities/random";
import BaseTimeStamp from "./_BaseTimeStamp";

@Unique(["id"])
export default abstract class BaseAppEntity extends BaseTimeStamp {
    @PrimaryColumn({ length: 64 })
    id: string;

    @BeforeInsert()
    async createId() {
        this.id = await randomBase64(32);
    }
}
