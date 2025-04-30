import { getConverter } from "./opencc-rust.mjs"

let converter = null;

export async function translateFromUrl(url) {
    const lyric = await (await fetch(url)).text();
    const converted = converter.convert(lyric);
    return converted;
}

export async function init(){
    converter = await getConverter();
}