import type { AmadeusLocation } from '../types'

// Test version of Amadeus API doesn't have info about Eastern locations
export const fallback: AmadeusLocation[] = [
  {
    subType: 'AIRPORT',
    name: 'Helsinki-Vantaa',
    id: 'HEL',
    iataCode: 'HEL',
    geoCode: { latitude: 60.3172, longitude: 24.9633 },
    address: { cityName: 'Helsinki', cityCode: 'HEL', countryName: 'Finland' }
  },
  {
    subType: 'AIRPORT',
    name: 'Lennart Meri Tallinn',
    id: 'TLL',
    iataCode: 'TLL',
    geoCode: { latitude: 59.4133, longitude: 24.8328 },
    address: { cityName: 'Tallinn', cityCode: 'TLL', countryName: 'Estonia' }
  },
  {
    subType: 'AIRPORT',
    name: 'Riga International',
    id: 'RIX',
    iataCode: 'RIX',
    geoCode: { latitude: 56.9236, longitude: 23.9711 },
    address: { cityName: 'Riga', cityCode: 'RIX', countryName: 'Latvia' }
  },
  {
    subType: 'AIRPORT',
    name: 'Vilnius International',
    id: 'VNO',
    iataCode: 'VNO',
    geoCode: { latitude: 54.6341, longitude: 25.2858 },
    address: { cityName: 'Vilnius', cityCode: 'VNO', countryName: 'Lithuania' }
  },
  {
    subType: 'AIRPORT',
    name: 'Minsk National',
    id: 'MSQ',
    iataCode: 'MSQ',
    geoCode: { latitude: 53.8825, longitude: 28.0307 },
    address: { cityName: 'Minsk', cityCode: 'MSQ', countryName: 'Belarus' }
  },
  {
    subType: 'AIRPORT',
    name: 'Warsaw Chopin',
    id: 'WAW',
    iataCode: 'WAW',
    geoCode: { latitude: 52.1657, longitude: 20.9671 },
    address: { cityName: 'Warsaw', cityCode: 'WAW', countryName: 'Poland' }
  },
  {
    subType: 'AIRPORT',
    name: 'John Paul II Kraków-Balice',
    id: 'KRK',
    iataCode: 'KRK',
    geoCode: { latitude: 50.0777, longitude: 19.7848 },
    address: { cityName: 'Kraków', cityCode: 'KRK', countryName: 'Poland' }
  },
  {
    subType: 'AIRPORT',
    name: 'Václav Havel Prague',
    id: 'PRG',
    iataCode: 'PRG',
    geoCode: { latitude: 50.1008, longitude: 14.26 },
    address: { cityName: 'Prague', cityCode: 'PRG', countryName: 'Czech Republic' }
  },
  {
    subType: 'AIRPORT',
    name: 'Budapest Ferenc Liszt',
    id: 'BUD',
    iataCode: 'BUD',
    geoCode: { latitude: 47.4369, longitude: 19.2556 },
    address: { cityName: 'Budapest', cityCode: 'BUD', countryName: 'Hungary' }
  },
  {
    subType: 'AIRPORT',
    name: 'Henri Coandă International',
    id: 'OTP',
    iataCode: 'OTP',
    geoCode: { latitude: 44.5711, longitude: 26.085 },
    address: { cityName: 'Bucharest', cityCode: 'OTP', countryName: 'Romania' }
  },
  {
    subType: 'AIRPORT',
    name: 'Sofia',
    id: 'SOF',
    iataCode: 'SOF',
    geoCode: { latitude: 42.6967, longitude: 23.4114 },
    address: { cityName: 'Sofia', cityCode: 'SOF', countryName: 'Bulgaria' }
  },
  {
    subType: 'AIRPORT',
    name: 'Sarajevo International',
    id: 'SJJ',
    iataCode: 'SJJ',
    geoCode: { latitude: 43.8246, longitude: 18.3315 },
    address: { cityName: 'Sarajevo', cityCode: 'SJJ', countryName: 'Bosnia and Herzegovina' }
  },
  {
    subType: 'AIRPORT',
    name: 'Skopje International',
    id: 'SKP',
    iataCode: 'SKP',
    geoCode: { latitude: 41.9616, longitude: 21.6214 },
    address: { cityName: 'Skopje', cityCode: 'SKP', countryName: 'North Macedonia' }
  },
  {
    subType: 'AIRPORT',
    name: 'Podgorica',
    id: 'TGD',
    iataCode: 'TGD',
    geoCode: { latitude: 42.3594, longitude: 19.2519 },
    address: { cityName: 'Podgorica', cityCode: 'TGD', countryName: 'Montenegro' }
  },
  {
    subType: 'AIRPORT',
    name: 'Tirana International',
    id: 'TIA',
    iataCode: 'TIA',
    geoCode: { latitude: 41.4147, longitude: 19.7206 },
    address: { cityName: 'Tirana', cityCode: 'TIA', countryName: 'Albania' }
  },
  {
    subType: 'AIRPORT',
    name: 'Belgrade Nikola Tesla',
    id: 'BEG',
    iataCode: 'BEG',
    geoCode: { latitude: 44.8184, longitude: 20.3091 },
    address: { cityName: 'Belgrade', cityCode: 'BEG', countryName: 'Serbia' }
  },
  {
    subType: 'AIRPORT',
    name: 'Chișinău International',
    id: 'KIV',
    iataCode: 'KIV',
    geoCode: { latitude: 46.9278, longitude: 28.9309 },
    address: { cityName: 'Chișinău', cityCode: 'KIV', countryName: 'Moldova' }
  },
  {
    subType: 'AIRPORT',
    name: 'Lviv Danylo Halytskyi',
    id: 'LWO',
    iataCode: 'LWO',
    geoCode: { latitude: 49.8125, longitude: 23.9561 },
    address: { cityName: 'Lviv', cityCode: 'LWO', countryName: 'Ukraine' }
  },
  {
    subType: 'AIRPORT',
    name: 'Odessa International',
    id: 'ODS',
    iataCode: 'ODS',
    geoCode: { latitude: 46.4268, longitude: 30.6765 },
    address: { cityName: 'Odessa', cityCode: 'ODS', countryName: 'Ukraine' }
  },
  {
    subType: 'AIRPORT',
    name: 'Kyiv Zhuliany International',
    id: 'IEV',
    iataCode: 'IEV',
    geoCode: { latitude: 50.4017, longitude: 30.4497 },
    address: { cityName: 'Kyiv', cityCode: 'IEV', countryName: 'Ukraine' }
  }
]
