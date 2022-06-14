import { Router } from "express";
import * as PlaceControllers from "../controllers/PlaceController";
import loginVerification from "../middlewares/LoginVerification";

const PlaceRouter = Router();

PlaceRouter.get(
    "/places/autocomplete",
    loginVerification,
    PlaceControllers.getAutocompleteResult
);

PlaceRouter.get(
    "/places/id/:placeId",
    loginVerification,
    PlaceControllers.getPlaceDetails
);

PlaceRouter.put(
    "/places/id/:placeId/favorite",
    loginVerification,
    PlaceControllers.addToFavorites
);

PlaceRouter.put(
    "/places/id/:placeId/unfavorite",
    loginVerification,
    PlaceControllers.removeFromFavorites
);

PlaceRouter.get(
    "/users/self/favorites",
    loginVerification,
    PlaceControllers.getFavorites
);

export default PlaceRouter;
