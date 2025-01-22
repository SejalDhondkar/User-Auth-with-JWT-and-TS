export const oneYearFromNow = () => {
    return new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
    )
}

export const thirtyDaysFromNow = () => {
    return new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
    )
}

export const fifteenMunitesFromNow = () => {
    return new Date(
        Date.now() + 15 * 60 * 1000
    )
}

export const oneDayFromNow = () => {
    return Date.now() + 24 * 60 * 60 * 1000
}


export const fiveMinutesAgo = () => {
    return Date.now() - 5 * 60 * 1000;
}

export const oneHourFromNow = () => {
    return new Date(
        Date.now() + 1 * 60 * 60 * 1000
    )
}