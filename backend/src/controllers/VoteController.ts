import { Request, Response } from "express";
import { CLIENT_RENEG_LIMIT } from "tls";
import { Equal } from "typeorm";
import { AppDataSource } from "../data-source";
import Place from "../entities/Place";
import TagRef from "../entities/TagReference";
import User from "../entities/User";
import Vote from "../entities/Vote";

export async function castVote(req: Request, res: Response) {
    const tagName = req.params.tagName as string;
    const voteText = req.params.voteText as string;
    const placeId = req.params.placeId as string;
    const userId = req.session.user.id as string;
    let status = 200;

    if (tagName && voteText && placeId && userId) {
        const dbTag = await AppDataSource.getRepository(TagRef).findOneBy({
            tagName,
            placeId,
        });

        const dbUser = await AppDataSource.getRepository(User).findOneBy({
            id: userId,
        });

        if (dbTag && dbUser) {
            const oneMonthMs = 2592000000; //1000 * 3600 * 24 * 30
            const oldVote = await AppDataSource.getRepository(Vote)
                .createQueryBuilder("votes")
                .where("votes.userId = :userId", { userId })
                .andWhere("votes.tagRefTagName = :tagName", { tagName })
                .andWhere("votes.tagRefPlaceId = :placeId", { placeId })
                .orderBy("votes.createdAt", "DESC")
                .getOne();
            let canVote = true;

            if (oldVote) {
                const now = new Date();
                const offsetTZMs = now.getTimezoneOffset() * 60000;
                canVote =
                    now.valueOf() - oldVote.createdAt.valueOf() + offsetTZMs >=
                    oneMonthMs;
            }

            if (canVote) {
                const newVote = new Vote();

                newVote.user = dbUser;
                newVote.tagRef = dbTag;

                switch (voteText) {
                    case "for":
                        newVote.forTag();
                        break;
                    case "against":
                        newVote.againstTag();
                        break;
                    case "neutral":
                        newVote.neutral();
                        break;

                    default:
                        status = 418;
                        break;
                }

                const newVote2 = await AppDataSource.manager.save(newVote);
            } else {
                status = 403;
            }
        } else {
            status = 404;
        }
    } else {
        status = 422;
    }

    res.sendStatus(status);
}
