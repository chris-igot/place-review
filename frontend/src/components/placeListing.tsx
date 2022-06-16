import React, { useEffect, useState } from "react";
import AutocompleteBox from "./autocompleteBox";
import Tag, { TagType } from "./tag";

type PlaceFuncType = (placeId: string) => void;
type ChangeFavFuncType = (
    placeId: string,
    add: boolean,
    cancel?: boolean //For exiting nonfavorite
) => void;

export interface PlaceType {
    placeId: string;
    name: string;
    address: string;
    tagRefs: TagType[];
    updateFavorite?: PlaceFuncType;
    changeFavorite?: ChangeFavFuncType;
    addable: boolean;
}

function PlaceListing(props: PlaceType) {
    const [isExpanded, setIsExpanded] = useState<boolean>(
        props.addable || false
    );

    function addTag(tagName: string, placeId: string) {
        fetch(`/api/places/id/${placeId}/tags/addtag?tag=${tagName}`, {
            method: "POST",
        }).then((response) => {
            if (response.status === 200 && props.updateFavorite) {
                props.updateFavorite(placeId);
            }
        });
    }

    return (
        <div
            className={
                isExpanded
                    ? "place-listing-container focused"
                    : "place-listing-container"
            }
        >
            <div
                className={
                    isExpanded ? "place-listing focused" : "place-listing"
                }
                onDoubleClick={() => {
                    setIsExpanded(true);
                }}
            >
                <h3
                    className=""
                    onClick={() => {
                        setIsExpanded(true);
                    }}
                >
                    {props.name}
                </h3>
                <p className="text--sm text-dimmed mt-0 mb-1">
                    {props.address}
                </p>
                <div>
                    {props.tagRefs.map((tag, index) => (
                        <Tag
                            key={index}
                            {...tag}
                            placeId={props.placeId}
                            update={props.updateFavorite}
                        />
                    ))}{" "}
                </div>
                {isExpanded && (
                    <>
                        {!props.addable && (
                            <AutocompleteBox
                                type={"tags"}
                                onSelect={(name) => {
                                    addTag(name, props.placeId);
                                    console.log("selected", { name });
                                }}
                            />
                        )}
                        {props.addable && (
                            <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                    (props.changeFavorite as ChangeFavFuncType)(
                                        props.placeId,
                                        true
                                    );
                                }}
                            >
                                Add
                            </button>
                        )}
                        {!props.addable && (
                            <button
                                className="btn btn-danger"
                                onClick={(e) => {
                                    (props.changeFavorite as ChangeFavFuncType)(
                                        props.placeId,
                                        false
                                    );
                                }}
                            >
                                Remove
                            </button>
                        )}
                        <button
                            className="btn btn-secondary"
                            onClick={(e) => {
                                setIsExpanded(false);
                                if (props.addable) {
                                    (props.changeFavorite as ChangeFavFuncType)(
                                        props.placeId,
                                        false,
                                        true
                                    );
                                }
                            }}
                        >
                            return
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default PlaceListing;
