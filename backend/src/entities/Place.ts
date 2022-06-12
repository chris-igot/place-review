import TagRef from "./TagReference";
import {
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
} from "typeorm";
import BaseTimeStamp from "./_BaseTimeStamp";
import Tag from "./Tag";
import FavoriteRef from "./FavoriteReference";

@Entity({ name: "places" })
export default class Place extends BaseTimeStamp {
    @PrimaryColumn()
    placeId: string;

    @OneToMany(() => TagRef, (tag) => tag.place)
    tagRefs: TagRef[];

    @ManyToMany(() => Tag)
    @JoinTable({
        name: "tagRefs",
        joinColumn: { name: "placeId", referencedColumnName: "placeId" },
        inverseJoinColumn: { name: "tagName", referencedColumnName: "name" },
    })
    tags: Tag[];

    @OneToMany(() => FavoriteRef, (favRef) => favRef.place)
    favoriteRefs: FavoriteRef[];
}
