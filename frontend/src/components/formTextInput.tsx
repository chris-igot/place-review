import React, { useEffect, useRef, useState } from "react";

type onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;
type onKeyUpFunc = (e: React.KeyboardEvent<HTMLInputElement>) => void;
interface PropsType {
    name: string;
    type?: "text" | "email" | "number" | "password" | "search" | "tel" | "url";
    width?: string;
    label?: string;

    className?: string;
    pattern?: string;
    title?: string;
    defaultValue?: string;
    required?: boolean;
    onKeyUp?: onKeyUpFunc;
    onChange?: onChangeFunc;
}
export default function InputText({
    name,
    type,
    width,
    label,
    ...props
}: PropsType) {
    const [blank, setBlank] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current?.value === "") {
            setBlank(true);
        } else {
            setBlank(false);
        }

        if (width) {
            (divRef.current as HTMLDivElement).style.width = width as string;
            (inputRef.current as HTMLInputElement).style.width =
                (divRef.current as HTMLDivElement).clientWidth + "px";
            console.log("width!");
        } else {
            (divRef.current as HTMLDivElement).style.width =
                (inputRef.current as HTMLInputElement).clientWidth + "px";
        }
        (divRef.current as HTMLDivElement).style.height =
            (inputRef.current as HTMLInputElement).clientHeight + "px";

        console.table({
            height: (inputRef.current as HTMLInputElement).clientHeight + "px",
            divWidth: (divRef.current as HTMLDivElement).clientWidth + "px",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        const str = e.currentTarget.value;

        setBlank(str === "");

        if ("onKeyUp" in props) {
            (props.onKeyUp as onKeyUpFunc)(e);
        }
    }

    return (
        <div
            className={
                blank ? "form__input--text" : "form__input--text notblank"
            }
            ref={divRef}
        >
            <input
                id={name}
                className={
                    (submitted ? "submitted" : "") +
                    ("className" in props ? " " + props.className : "")
                }
                type={type !== undefined ? type : "text"}
                ref={inputRef}
                name={name}
                {...props}
                onKeyUp={handleKeyPress}
                onInvalid={(e) => {
                    setSubmitted(true);
                }}
            />
            <label htmlFor={name}>{label !== undefined ? label : name}</label>
        </div>
    );
}
