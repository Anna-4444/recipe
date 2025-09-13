export const truncateText = (text, numWords=20) => {
    const wordArray = text.split(" ")
    if (wordArray.length > numWords) {
        return wordArray.slice(0, numWords).join(" ") + "...";
    } else {
        return text;
    }
}