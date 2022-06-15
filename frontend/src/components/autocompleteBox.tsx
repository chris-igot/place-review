/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import InputText from "./formTextInput";

export interface AutocompletePropsType {
    type: "tags" | "places";
    onSelect: (arg: string) => void;
}

export interface AutocompleteResultType {
    description?: string;
    placeId?: string;
    name?: string;
}

function AutocompleteBox(props: AutocompletePropsType) {
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const [autocompleteResults, setAutocompleteResults] = useState<
        AutocompleteResultType[]
    >([]);
    const [lastKey, setLastKey] = useState<string>("");
    const [refreshCounter, refreshAutocomplete] = useState<number>(-1);
    const [lastRequestTime, setLastRequestTime] = useState<number>(
        new Date(0).getTime()
    );

    function autocompletePlaces(e: React.ChangeEvent<HTMLInputElement>) {
        const searchString = e.currentTarget.value;
        const now = Date.now();

        if (
            searchString &&
            searchString.length > 2 &&
            now - lastRequestTime > 1000
        ) {
            const url =
                props.type === "places"
                    ? `/api/places/autocomplete?search=${searchString}`
                    : `/api/tags/autocomplete?tagSearch=${searchString}`;

            fetch(url)
                .then((response) => {
                    if (response.status === 200) {
                        return response.json() as Promise<
                            AutocompleteResultType[]
                        >;
                    }
                })
                .then((results) => {
                    setAutocompleteResults(results as AutocompleteResultType[]);
                    setCurrentIndex(-1);
                });
            setLastRequestTime(now);
        } else {
            setAutocompleteResults([]);
        }
    }

    function handleSearchKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        setLastKey(e.key);
        refreshAutocomplete(refreshCounter + 1);
    }

    useEffect(() => {
        if (lastKey) {
            let tempIndex: number = -1;
            switch (lastKey) {
                case "ArrowUp":
                    tempIndex = currentIndex - 1;
                    if (tempIndex >= 0) {
                        setCurrentIndex(tempIndex);
                    }
                    break;
                case "ArrowDown":
                    const resultCount = autocompleteResults.length;
                    tempIndex = currentIndex + 1;
                    if (tempIndex < resultCount) {
                        setCurrentIndex(tempIndex);
                    }
                    break;
                case "Enter":
                    switch (props.type) {
                        case "tags":
                            handleSelect(
                                autocompleteResults[currentIndex].name as string
                            );
                            break;
                        case "places":
                            handleSelect(
                                autocompleteResults[currentIndex]
                                    .placeId as string
                            );
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        }
    }, [refreshCounter, lastKey]);

    function handleSelect(identifier: string) {
        props.onSelect(identifier);
        setAutocompleteResults([]);
        setCurrentIndex(-1);
    }

    return (
        <div
            className="autocomplete-box"
            onBlur={(e) => {
                setAutocompleteResults([]);
            }}
        >
            <InputText
                name={"search"}
                label="search locations"
                type="search"
                width="max"
                onChange={autocompletePlaces}
                onKeyUp={handleSearchKeyUp}
            />
            <div className="autocomplete-results">
                {autocompleteResults.map((resultItem, index) => {
                    if (props.type === "places") {
                        return (
                            <div
                                key={index}
                                className={
                                    currentIndex === index
                                        ? "result-item focused"
                                        : "result-item"
                                }
                                onMouseOver={() => {
                                    setCurrentIndex(index);
                                }}
                                onClick={() => {
                                    handleSelect(resultItem.placeId as string);
                                }}
                            >
                                {resultItem.description}
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={index}
                                className={
                                    currentIndex === index
                                        ? "result-item focused"
                                        : "result-item"
                                }
                                onMouseOver={() => {
                                    setCurrentIndex(index);
                                }}
                                onClick={() => {
                                    handleSelect(resultItem.name as string);
                                }}
                            >
                                {resultItem.name}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default AutocompleteBox;
