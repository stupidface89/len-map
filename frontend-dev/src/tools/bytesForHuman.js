function bytesForHuman(bytes, decimals = 2) {
    let units = ['байт', 'Кб', 'Мб', 'Гб', 'TB', 'PB']
    let i = 0

    for (i; bytes > 1024; i++) {
        bytes /= 1024;
    }
    return parseFloat(bytes.toFixed(decimals)) + ' ' + units[i]
}

export default bytesForHuman;