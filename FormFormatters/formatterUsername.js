function replaceSpecialCharacterWithSpace(str) {
    return str.replace(/[^a-zA-Z0-9]\_\./g, '');
}

function formatterUsername(value) {
    return replaceSpecialCharacterWithSpace(value.replace(" ", "").toLowerCase());
}

export default formatterUsername;