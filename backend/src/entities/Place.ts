import { Entity, PrimaryColumn } from "typeorm";
import BaseTimeStamp from "./_BaseTimeStamp";

@Entity({ name: "places" })
export default class Place extends BaseTimeStamp {
    @PrimaryColumn()
    place_id: string;
}
