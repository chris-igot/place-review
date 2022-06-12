import { Entity, JoinColumn, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import Place from "./Place";
import User from "./User";

@Entity("favoriteRefs")
@Unique(["userId", "placeId"])
export default class FavoriteRef {
    @PrimaryColumn()
    userId: string;

    @PrimaryColumn()
    placeId: string;

    @ManyToOne(() => User, (user) => user.favoriteRefs)
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Place, (place) => place.favoriteRefs)
    @JoinColumn({ name: "placeId" })
    place: Place;

    toJSON() {
        delete this.userId;

        return this;
    }
}
