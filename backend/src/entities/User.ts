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
import FavoriteRef from "./FavoriteReference";

@Entity({ name: "users" })
@Unique(["name", "disambiguator"])
export default class User extends BaseUser {
    @Column()
    disambiguator: number;

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    @OneToMany(() => FavoriteRef, (favRef) => favRef.user)
    favoriteRefs: FavoriteRef[];

    favoritePlaces: Place[];

    @BeforeInsert()
    async createDisambiguator() {
        this.disambiguator = crypto.randomInt(100_000);
    }
}
