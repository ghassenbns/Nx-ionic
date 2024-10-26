export const isMobile = () : boolean => {
    return cy.state('viewportWidth') < Cypress.env('mobileViewportWidthBreakpoint');
};

export const getDeviceType = () : 'Mobile' | 'Desktop' => {
    return isMobile() ? 'Mobile' : 'Desktop';
};

export const dateToTimestamp = (date : string, noMs = false) : number => {
    const timestampInMilliseconds = new Date(date).getTime();
    //? round down to the nearest second and then multiply by 1000 to remove the milliseconds
    if (noMs) {
        return Math.floor(timestampInMilliseconds / 1000) * 1000;
    }
    return timestampInMilliseconds;
};