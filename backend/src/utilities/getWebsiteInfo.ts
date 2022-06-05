import getMetaData from "metadata-scraper";

export default async function (url: string) {
    return await getMetaData(url).then((data) => {
        return data;
    });
}
