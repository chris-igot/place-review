import { Request, Response } from "express";
import {
    Client,
    PlaceAutocompleteResult,
} from "@googlemaps/google-maps-services-js";
import Place from "../entities/Place";
import { AppDataSource } from "../data-source";
import User from "../entities/User";
import FavoriteRef from "../entities/FavoriteReference";
import { DeleteResult } from "typeorm";

const detailFields = ["formatted_address", "name", "place_id"];

const client = new Client({});

export async function getAutocompleteResult(req: Request, res: Response) {
    const search = req.query.search as string;
    let result: PlaceAutocompleteResult[];
    let errorMessage: any;
    let status = 200;

    if (search && typeof search === "string") {
        await client
            .placeAutocomplete({
                params: {
                    input: search,
                    key: process.env.GOOGLEAPI_KEY,
                },
            })
            .then(async (response) => {
                result = response.data.predictions;
            })
            .catch((e) => {
                errorMessage = e.response.data.error_message;
                console.log(e.response.data.error_message);
                status = 500;
            });
    } else {
        status = 422;
    }

    if (status === 200) {
        res.status(status);
        res.send(result);
    } else if (status === 500) {
        res.status(status);
        res.send(errorMessage);
    } else {
        res.sendStatus(status);
    }
}

export async function getPlaceDetails(req: Request, res: Response) {
    const placeId = req.params.placeId as string;
    let output: Place;
    let errorMessage: any;
    let status = 200;

    if (placeId) {
        const dbPlace = await AppDataSource.getRepository(Place)
            .createQueryBuilder("places")
            .leftJoinAndSelect("places.tags", "tags")
            .where({ placeId })
            .getOne();

        if (dbPlace) {
            output = dbPlace;
        } else {
            await client
                .placeDetails({
                    params: {
                        place_id: placeId,
                        key: process.env.GOOGLEAPI_KEY,
                        fields: detailFields,
                    },
                })
                .then(async (response) => {
                    const place = new Place();
                    const googleResult = response.data.result;

                    place.placeId = googleResult.place_id;
                    place.address = googleResult.formatted_address;
                    place.name = googleResult.name;
                    place.tags = [];

                    output = await AppDataSource.manager.save(place);
                })
                .catch((e) => {
                    errorMessage = e.response.data.error_message;
                    console.log(e.response.data.error_message);
                    status = 500;
                });
        }
    } else {
        status = 422;
    }

    if (status === 200) {
        res.send(output);
    } else if (status === 500) {
        res.status(status);
        res.send(errorMessage);
    } else {
        res.sendStatus(status);
    }
}

export async function getPlace(req: Request, res: Response) {
    const placeId = req.params.placeId as string;
    let status = 200;
    let result: Place;

    if (placeId) {
        const dbPlace = await AppDataSource.getRepository(Place)
            .createQueryBuilder("places")
            .leftJoinAndSelect("places.tags", "tags")
            .where({ placeId })
            .getOne();

        if (dbPlace) {
            result = dbPlace;
        } else {
            status = 404;
        }
    }

    if (status === 200) {
        res.send(result);
    } else {
        res.sendStatus(status);
    }
}

export async function addToFavorites(req: Request, res: Response) {
    const placeId = req.params.placeId as string;
    const userId = req.session.user.id as string;
    let status = 200;
    let result: Place;

    if (placeId) {
        const dbPlace = await AppDataSource.getRepository(Place).findOneBy({
            placeId,
        });
        const dbUser = await AppDataSource.getRepository(User)
            .createQueryBuilder("users")
            .where({ id: userId })
            .getOne();

        if (dbPlace && dbUser) {
            const newFavRef = new FavoriteRef();

            newFavRef.place = dbPlace;
            newFavRef.user = dbUser;

            await AppDataSource.manager.save(newFavRef);
        } else {
            status = 404;
        }
    }

    res.sendStatus(status);
}

export async function removeFromFavorites(req: Request, res: Response) {
    const placeId = req.params.placeId as string;
    const userId = req.session.user.id as string;
    let status = 200;
    let result: DeleteResult;

    if (placeId) {
        result = await AppDataSource.createQueryBuilder()
            .delete()
            .from(FavoriteRef)
            .where("placeId = :placeId", { placeId })
            .andWhere("userId = :userId", { userId })
            .execute();

        if (result.affected && result.affected === 0) {
            status = 404;
        }
    }

    res.sendStatus(status);
}
