module.exports = text => {
    return text.split('').map( char => {
        return `0u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
    }).join(', ');
}