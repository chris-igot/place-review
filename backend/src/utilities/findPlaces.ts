import {
    Client,
    PlaceAutocompleteType,
} from "@googlemaps/google-maps-services-js";

const client = new Client({});

export default function (search: string) {
    return client
        .placeAutocomplete({
            params: {
                input: search,
                key: process.env.GOOGLEAPI_KEY,
                types: PlaceAutocompleteType.establishment,
            },
        })
        .then((response) => response.data.predictions)
        .catch((e) => {
            console.log(e.response.data.error_message);
        });
}
