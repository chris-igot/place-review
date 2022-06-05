import { Client } from "@googlemaps/google-maps-services-js";
import { MetaData } from "metadata-scraper/lib/types";
import getWebsiteInfo from "./getWebsiteInfo";

const client = new Client({});

export default function (place_id: string) {
    return client
        .placeDetails({
            params: {
                place_id,
                key: process.env.GOOGLEAPI_KEY,
                fields: [
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
                ],
            },
        })
        .then(async (response) => {
            const result = response.data.result;
            let meta: MetaData;

            if (result.website) {
                meta = await getWebsiteInfo(result.website);
            }

            if (meta) {
                return { ...result, meta };
            } else {
                return { ...result };
            }
        })
        .catch((e) => {
            console.log(e.response.data.error_message);
        });
}
