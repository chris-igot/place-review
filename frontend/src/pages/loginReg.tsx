/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputText from "../components/formTextInput";
import convertInputToJSON from "../utilities/convertInputToJSON";
import { escapeRegExp } from "../utilities/regex";

export default function LoginReg() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    function handlePwChange(e: React.KeyboardEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        const pwConfirmElement = document.getElementById(
            "passwordConfirm"
        ) as HTMLInputElement;
        pwConfirmElement.pattern = escapeRegExp(value);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = convertInputToJSON(e);
        const url = isLogin ? "/api/login" : "api/users";

        fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (response) => {
                switch (response.status) {
                    case 200:
                        navigate("/home");
                        break;

                    default:
                        console.log(response);
                        break;
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="modal__form">
            <form className="" action="" method="post" onSubmit={handleSubmit}>
                <p className="logo--large" />
                <h4>{isLogin ? "Login" : "Registration"}</h4>
                {!isLogin && (
                    <InputText
                        name="name"
                        pattern="^[ -~]{2,32}$"
                        title="Username must be between 2 and 32 characters"
                        required
                    />
                )}
                <InputText name="email" type="email" required />
                <InputText
                    name="password"
                    pattern="^[ -~]{8,100}$"
                    title="Password must be between 8 and 100 characters"
                    type="password"
                    onKeyUp={handlePwChange}
                    required
                />
                {!isLogin && (
                    <InputText
                        name="passwordConfirm"
                        type="password"
                        label="password confirmation"
                        title="Password must match"
                        required
                    />
                )}
                {isLogin ? (
                    <p>
                        New user?{" "}
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                setIsLogin(!isLogin);
                            }}
                        >
                            Create a new account
                        </a>
                    </p>
                ) : (
                    <p>
                        Go back to{" "}
                        <a
                            onClick={(e) => {
                                e.preventDefault();
                                setIsLogin(!isLogin);
                            }}
                        >
                            login
                        </a>{" "}
                        page
                    </p>
                )}
                <button className="btn-primary" type="submit">
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>
        </div>
    );
}
