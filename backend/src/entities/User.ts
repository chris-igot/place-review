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
import POI from "./POI";

@Entity({ name: "users" })
@Unique(["name", "disambiguator"])
export default class User extends BaseUser {
    @Column()
    disambiguator: number;

    @OneToMany(() => POI, (poi) => poi.owner)
    ownedPOI: POI[];

    @BeforeInsert()
    async createDisambiguator() {
        this.disambiguator = crypto.randomInt(100_000);
    }
}
