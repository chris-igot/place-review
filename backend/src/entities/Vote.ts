import { Max, Min } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import TagRef from "./TagReference";
import User from "./User";
import BaseAppEntity from "./_BaseAppEntity";

@Entity({ name: "votes" })
export default class Vote extends BaseAppEntity {
    @Column()
    @Min(-1)
    @Max(1)
    value: number;

    @ManyToOne(() => User, (user) => user.votes)
    user: User;

    @ManyToOne(() => TagRef, (tagRef) => tagRef.votes)
    tagRef: TagRef;

    forTag() {
        this.value = 1;
    }

    againstTag() {
        this.value = -1;
    }

    neutral() {
        this.value = 0;
    }
}
