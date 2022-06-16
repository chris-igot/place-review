import React, { useState } from "react";

export interface PropsType {
    options: string[];
    name: string;
    onSelect: (selectionName: string) => void;
}

function Radio(props: PropsType) {
    const [picked, setPicked] = useState<string>("");
    return (
        <div className="form-radio p-1">
            {props.options.map((option, index) => (
                <label
                    key={index}
                    className={option === picked ? "picked" : ""}
                    htmlFor={props.name + "_" + option}
                >
                    <input
                        type="radio"
                        id={props.name + "_" + option}
                        name={props.name}
                        value={option}
                        onClick={() => {
                            setPicked(option);
                            props.onSelect(option);
                        }}
                    />{" "}
                    {option}
                </label>
            ))}
        </div>
    );
}

export default Radio;
