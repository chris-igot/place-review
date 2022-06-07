import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Place from "../entities/Place";
import TagRef from "../entities/TagReference";
import Tag from "../entities/Tag";
import { CLIENT_RENEG_LIMIT } from "tls";

export async function addTag(req: Request, res: Response) {
    const tagName = req.query.tag as string;
    const placeId = req.params.placeId as string;
    let status = 200;

    if (tagName && placeId) {
        const dbPlace = await AppDataSource.getRepository(Place)
            .createQueryBuilder("places")
            .leftJoinAndSelect("places.tags", "tags")
            .where({ placeId })
            .getOne();

        let dbTag = await AppDataSource.getRepository(Tag).findOneBy({
            name: tagName,
        });

        if (!dbTag) {
            const newTagName = new Tag();
            newTagName.name = tagName;
            dbTag = await AppDataSource.manager.save(newTagName);
        }

        if (dbPlace) {
            if (!dbPlace.tags) {
                dbPlace.tags = [];
            }

            dbPlace.tags.push(dbTag);
            await AppDataSource.manager.save(dbPlace);
        } else {
            status = 404;
        }
    } else {
        status = 422;
    }

    res.sendStatus(status);
}

export async function getTagRef(req: Request, res: Response) {
    const tagName = req.params.tag as string;
    const placeId = req.params.placeId as string;
    let status = 200;
    let result: TagRef;

    console.log({ tagName, placeId });

    if (tagName && placeId) {
        let dbTagRef = await AppDataSource.getRepository(TagRef)
            .createQueryBuilder("tagRefs")
            .leftJoinAndSelect("tagRefs.votes", "votes")
            .andWhere("tagRefs.tagName = :tagName", { tagName })
            .andWhere("tagRefs.placeId = :placeId", { placeId })
            .getOne();
        console.log(dbTagRef);
        if (dbTagRef) {
            result = dbTagRef;
        } else {
            status = 404;
        }
    } else {
        status = 422;
    }

    if (status === 200) {
        res.send({ placeId, tagName, voteCount: result.voteCount });
    } else {
        res.sendStatus(status);
    }
}

export async function getAllTags(req: Request, res: Response) {
    const results = await AppDataSource.getRepository(Tag)
        .createQueryBuilder("tags")
        .orderBy("name", "ASC")
        .getMany();

    res.send(results);
}
