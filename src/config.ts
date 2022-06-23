export const getCmsApiEndpoint = () => `${process.env.REACT_APP_BASE_DOMAIN}/` ?? ``;

export const getCmsSiteEndpoint = () => process.env.CMS_SITE_ENDPOINT ?? ``;

export const getAuthEndpoint = () => process.env.AUTH_ENDPOINT ?? ``;

export const getAPIEndpoint = () => process.env.API_ENDPOINT ?? ``;

export const getLiveEndpoint = () => process.env.REACT_APP_LIVE_LINK ?? ``;

export const getCookieDomain = () => process.env.COOKIE_DOMAIN ?? ``;

export const getReportsEndpoint = () => process.env.REPORTS_ENDPOINT ?? ``;

export const getSPREndPoint = () => process.env.SPR_ENDPOINT ?? ``;
