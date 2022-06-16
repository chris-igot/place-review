import React, { useEffect, useRef, useState } from "react";

type onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;
type onKeyUpFunc = (e: React.KeyboardEvent<HTMLInputElement>) => void;
interface PropsType {
    name: string;
    id?: string;
    type?: "text" | "email" | "number" | "password" | "search" | "tel" | "url";
    width?: string;
    label?: string;

    className?: string;
    pattern?: string;
    title?: string;
    defaultValue?: string;
    required?: boolean;
    onChange?: onChangeFunc;
    onKeyUp?: onKeyUpFunc;
}
export default function InputText({
    name,
    id,
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
        } else {
            (divRef.current as HTMLDivElement).style.width =
                (inputRef.current as HTMLInputElement).clientWidth + "px";
        }
        (divRef.current as HTMLDivElement).style.height =
            (inputRef.current as HTMLInputElement).clientHeight + "px";

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const str = e.currentTarget.value;

        setBlank(str === "");

        if ("onChange" in props) {
            (props.onChange as onChangeFunc)(e);
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
                id={id || name}
                className={
                    (submitted ? "submitted" : "") +
                    ("className" in props ? " " + props.className : "")
                }
                type={type || "text"}
                ref={inputRef}
                name={name}
                {...props}
                onInvalid={(e) => {
                    setSubmitted(true);
                }}
                onChange={handleChange}
                onKeyUp={props.onKeyUp}
            />
            <label htmlFor={name}>{label || name}</label>
        </div>
    );
}
