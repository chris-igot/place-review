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

@Entity({ name: "users" })
@Unique(["name", "disambiguator"])
export default class User extends BaseUser {
    @Column()
    disambiguator: number;

    @BeforeInsert()
    async createDisambiguator() {
        this.disambiguator = crypto.randomInt(100_000);
    }
}
