export default function convertInputToJSON(
    e: React.FormEvent<HTMLFormElement>
): string {
    const inputs = e.currentTarget.querySelectorAll(
        "input,textarea"
    ) as unknown as HTMLInputElement[];

    let data: { [index: string]: any } = {};

    inputs.forEach((input) => {
        if (input.type === "checkbox") {
            data[input.name] = input.checked;
        } else {
            data[input.name] = input.value;
        }
    });
    return JSON.stringify(data);
}
