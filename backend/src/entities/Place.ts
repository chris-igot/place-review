import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import User from "./User";
import BaseTimeStamp from "./_BaseTimeStamp";

@Entity({ name: "places" })
export default class Place extends BaseTimeStamp {
    @PrimaryColumn()
    place_id: string;

    @ManyToOne(
        () => User,
        (user) => {
            user.ownedPOI;
        }
    )
    owner: User;
}
