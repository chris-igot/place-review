import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import User from "./User";
import BaseTimeStamp from "./_BaseTimeStamp";

@Entity({ name: "pointsOfInterests" })
export default class POI extends BaseTimeStamp {
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
