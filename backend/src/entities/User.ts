import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    Unique,
} from "typeorm";
import BaseUser from "./_BaseUser";
import crypto from "crypto";
import Place from "./Place";
import Vote from "./Vote";

@Entity({ name: "users" })
@Unique(["name", "disambiguator"])
export default class User extends BaseUser {
    @Column()
    disambiguator: number;

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    @BeforeInsert()
    async createDisambiguator() {
        this.disambiguator = crypto.randomInt(100_000);
    }
}
