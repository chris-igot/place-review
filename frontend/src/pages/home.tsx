/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import PlaceListing, { PlaceType } from "../components/placeListing";
import { useNavigate } from "react-router-dom";
import AutocompleteBox from "../components/autocompleteBox";

export interface UserType {
    id: string;
    name: string;
    email: string;
    disambiguator: number;
}

function Home() {
    const navigate = useNavigate();

    const [favoritePlaces, setFavoritePlaces] = useState<PlaceType[]>([]);
    const [user, setUser] = useState<UserType>();
    const [place, setPlace] = useState<PlaceType | undefined>(undefined);

    useEffect(() => {
        fetch("/api/users/self", {
            method: "GET",
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json() as Promise<UserType>;
                } else {
                    navigate("/");
                }
            })
            .then((user) => {
                setUser(user);
            });

        updateFavorites();
    }, []);

    async function getPlace(placeId: string) {
        fetch(`/api/places/id/${placeId}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json() as Promise<PlaceType>;
                }
            })
            .then((dbPlace) => {
                setPlace(dbPlace);
            });
    }

    function updateFavorite(placeId: string) {
        const favIndex = favoritePlaces.findIndex(
            (favItem) => favItem.placeId === placeId
        );

        fetch(`/api/places/id/${placeId}`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json() as Promise<PlaceType>;
                }
            })
            .then((favorite) => {
                let newFavorites = [...favoritePlaces];
                newFavorites[favIndex] = favorite as PlaceType;

                setFavoritePlaces(newFavorites);
            });
    }

    function updateFavorites() {
        fetch(`/api/users/self/favorites`, { method: "GET" })
            .then((response) => {
                if (response.status === 200) {
                    return response.json() as Promise<PlaceType[]>;
                }
            })
            .then((favorites) => {
                setFavoritePlaces(favorites as PlaceType[]);
            });
    }

    function changeFavorite(placeId: string, add: boolean, cancel = false) {
        if (cancel) {
            setPlace(undefined);
        } else {
            if (add) {
                fetch(`/api/places/id/${placeId}/favorite`, {
                    method: "PUT",
                }).then((response) => {
                    if (response.status === 200) {
                        setFavoritePlaces([
                            ...favoritePlaces,
                            place as PlaceType,
                        ]);
                        setPlace(undefined);
                    }
                });
            } else {
                fetch(`/api/places/id/${placeId}/unfavorite`, {
                    method: "PUT",
                }).then((response) => {
                    if (response.status === 200) {
                        const favIndex = favoritePlaces.findIndex(
                            (favItem) => favItem.placeId === placeId
                        );
                        let tempFavPlaces = favoritePlaces;

                        tempFavPlaces.splice(favIndex, 1);
                        setFavoritePlaces(tempFavPlaces);
                        setPlace(undefined);
                    }
                });
            }
        }
    }

    return (
        <>
            <div className="home">
                <div className="py-2 px-2 top bg-primary-alt">
                    <h2 className="m-0 text-primary-alt text--center">
                        placeTagger
                    </h2>
                    <p className="text-primary-alt text--center">
                        {user?.name}{" "}
                        <span className="text--sm text-dimmed">
                            #{user?.disambiguator}
                        </span>{" "}
                        <span className="text--sm">
                            ( <a href="#logout">logout</a>)
                        </span>
                    </p>
                    <AutocompleteBox type={"places"} onSelect={getPlace} />
                    {place && (
                        <PlaceListing
                            placeId={place.placeId}
                            name={place.name}
                            address={place.address}
                            tagRefs={place.tagRefs}
                            updateFavorite={updateFavorite}
                            addable={true}
                            changeFavorite={changeFavorite}
                        />
                    )}
                </div>
                <div className="places">
                    {favoritePlaces.map((place) => (
                        <PlaceListing
                            key={place.placeId}
                            placeId={place.placeId}
                            name={place.name}
                            address={place.address}
                            tagRefs={place.tagRefs}
                            updateFavorite={updateFavorite}
                            addable={false}
                            changeFavorite={changeFavorite}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;
