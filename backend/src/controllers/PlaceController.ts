import { Request, Response } from "express";
import {
    Client,
    PlaceAutocompleteResult,
    PlaceData,
} from "@googlemaps/google-maps-services-js";
import Place from "../entities/Place";
import { AppDataSource } from "../data-source";
import { MetaData } from "metadata-scraper/lib/types";
import getWebsiteInfo from "../utilities/getWebsiteInfo";

const detailFields = [
    "adr_address",
    "business_status",
    "formatted_address",
    "geometry",
    "icon",
    "icon_mask_base_uri",
    "icon_background_color",
    "name",
    "place_id",
    "plus_code",
    "type",
    "url",
    "utc_offset",
    "vicinity",
    "formatted_phone_number",
    "international_phone_number",
    "opening_hours",
    "website",
    "price_level",
    "rating",
    "user_ratings_total",
];

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

                for (let i = 0; i < result.length; i++) {
                    const element = result[i];
                    let newPlace = new Place();
                    newPlace.place_id = element.place_id;

                    try {
                        newPlace = await AppDataSource.manager.save(newPlace);
                    } catch (e) {
                        console.log(e);
                    }
                }
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
    const place_id = req.params.place_id as string;
    let meta: MetaData;
    let result: Partial<PlaceData>;
    let errorMessage: any;
    let status = 200;

    if (place_id && typeof place_id === "string") {
        await client
            .placeDetails({
                params: {
                    place_id,
                    key: process.env.GOOGLEAPI_KEY,
                    fields: detailFields,
                },
            })
            .then(async (response) => {
                result = response.data.result;

                if (result.website) {
                    meta =
                        (await getWebsiteInfo(result.website).catch(
                            (e: Error) => {
                                console.log(e);
                                errorMessage = e.message;
                                status = 500;
                            }
                        )) || undefined;
                }
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
        if (meta) {
            res.send({ ...result, meta });
        } else {
            res.send({ ...result });
        }
    } else if (status === 500) {
        res.status(status);
        res.send(errorMessage);
    } else {
        res.sendStatus(status);
    }
}
