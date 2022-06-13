export function checkValidTag(tagName: string) {
    if (typeof tagName === "string") {
        const regex = /^[0-9A-Za-z_-]{2,}$/;

        return tagName.match(regex);
    } else {
        return false;
    }
}
