export interface AdminCode {
    ISO3166_2: number;
}

export interface GeoData {
    adminCode1: number;
    lat: number;
    lng: number;
    geonameId: string;
    toponymName: string;
    countryId: string;
    fcl: string;
    population: number;
    countryCode: number;
    name: string;
    fclName: string;
    adminCodes1: AdminCode;
    countryName: string;
    fcodeName: string;
    adminName1: string;
    fcode: string;
}

export interface GeoLocations {
    totalResultsCount: number;
    genonames: GeoData[];
}

export interface GeoLocationAddress {
    adminCode2: number;
    adminCode3: string;
    adminCode1: string;
    lng: number;
    houseNumber: number;
    locality: string;
    adminCode4: string;
    adminName2: string;
    street: string;
    postalcode: number;
    countryCode: string;
    adminName1: string;
    lat: number;
}

export interface GeoAddressLocation {
    address: GeoLocationAddress;
}
