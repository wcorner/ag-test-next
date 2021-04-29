// lib/agility.js
import agility from "@agility/content-fetch";

const api = agility.getApi({
    guid: process.env.AGILITY_CMS_GUID,
    apiKey: process.env.AGILITY_CMS_API_FETCH_KEY
});

export default api;
