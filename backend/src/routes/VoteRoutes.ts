import { Router } from "express";
import { castVote } from "../controllers/VoteController";
import loginVerification from "../middlewares/LoginVerification";

const VoteRouter = Router();

VoteRouter.post(
    "/places/id/:placeId/tags/:tagName/votes/cast/:voteText",
    loginVerification,
    castVote
);

export default VoteRouter;
