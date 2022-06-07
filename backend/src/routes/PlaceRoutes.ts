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
    "/places/id/:placeId/details",
    loginVerification,
    PlaceControllers.getPlaceDetails
);

PlaceRouter.get(
    "/places/id/:placeId",
    loginVerification,
    PlaceControllers.getPlace
);

export default PlaceRouter;
