import { Router } from "express";
import * as TagControllers from "../controllers/TagController";
import loginVerification from "../middlewares/LoginVerification";

const TagRouter = Router();

TagRouter.post(
    "/places/id/:placeId/tags/addtag",
    loginVerification,
    TagControllers.addTag
);

TagRouter.get(
    "/places/id/:placeId/tags/name/:tag",
    loginVerification,
    TagControllers.getTagRef
);
TagRouter.get("/tags", loginVerification, TagControllers.getAllTags);

export default TagRouter;
