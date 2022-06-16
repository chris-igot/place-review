import React, { useState } from "react";
import Radio from "./formRadio";

export interface TagType {
    placeId: string;
    tagName: string;
    voteCounts: VoteType;
    canVote: boolean;
    update?: (placeId: string) => void;
}

export interface VoteType {
    for: number;
    against: number;
    neutral: number;
}

export type VoteStateType = "for" | "against" | "neutral";
type ExpandFuncType = (isExpanded: boolean) => void;

function Tag(props: TagType) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <>
            {isExpanded ? (
                <TagMenu {...props} setIsExpanded={setIsExpanded} />
            ) : (
                <span
                    className={props.canVote ? "tag" : "tag voted"}
                    onClick={() => {
                        if (props.canVote) {
                            setIsExpanded(true);
                        }
                    }}
                >
                    {props.tagName} (
                    {props.voteCounts.for - props.voteCounts.against})
                </span>
            )}
        </>
    );
}

function TagMenu(props: TagType & { setIsExpanded: ExpandFuncType }) {
    const [voteState, setVoteState] = useState<VoteStateType>("neutral");

    function castVote(voteText: string) {
        const url = `/api/places/id/${props.placeId}/tags/${props.tagName}/votes/cast/${voteText}`;
        console.log(props);

        fetch(url, { method: "POST" }).then((response) => {
            props.setIsExpanded(false);
            if (response.status === 200 && props.update) {
                props.update(props.placeId);
            }
        });
    }

    return (
        <div className="tag-menu-container">
            <div className="tag-menu">
                <h3>
                    {props.tagName}{" "}
                    <span className="text--sm text-dimmed">
                        [score:{" "}
                        {props.voteCounts.for - props.voteCounts.against}]
                    </span>
                </h3>
                <p className="mt-1 mx-0 mb-0">Vote on this tag:</p>
                <Radio
                    options={["for", "against", "neutral"]}
                    name={"votes"}
                    onSelect={(vote) => {
                        setVoteState(vote as VoteStateType);
                    }}
                />
                <button
                    className="btn btn-primary"
                    onClick={(e) => {
                        castVote(voteState);
                    }}
                >
                    Submit Vote!
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={(e) => {
                        props.setIsExpanded(false);
                    }}
                >
                    cancel
                </button>
            </div>
        </div>
    );
}

export default Tag;
