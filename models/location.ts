export interface Location {
  asn: string;
  city: string;
  continent_code: "EU" | string;
  country: "BY" | string;
  country_area: number;
  country_calling_code: "+375" | string;
  country_capital: string;
  country_code: "BY" | string;
  country_code_iso3: "BLR" | string;
  country_name: "Belarus" | string;
  country_population: number;
  country_tld: ".by" | string;
  currency: "BYN" | string;
  currency_name: "Belarusian ruble" | string;
  in_eu: boolean;
  ip: string;
  languages: "be,ru" | string;
  latitude: number;
  longitude: number;
  network: string;
  org: string;
  postal: "224000" | string;
  region: string;
  region_code: string;
  timezone: string;
  utc_offset: string;
  version: string;
}
