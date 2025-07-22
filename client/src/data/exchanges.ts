export interface Exchange {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cloudProvider: string;
  region: string;
  volume24h?: number;
}

export const exchanges: Exchange[] = [
  // Binance - Multiple regions
  {
    id: "binance-us-east",
    name: "Binance US-East",
    latitude: 39.0458,
    longitude: -76.6413,
    cloudProvider: "AWS",
    region: "us-east-1",
    volume24h: 2500000000
  },
  {
    id: "binance-eu-west",
    name: "Binance EU-West",
    latitude: 53.4084,
    longitude: -2.9916,
    cloudProvider: "AWS",
    region: "eu-west-1",
    volume24h: 1800000000
  },
  {
    id: "binance-asia-singapore",
    name: "Binance Asia-Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    cloudProvider: "AWS",
    region: "ap-southeast-1",
    volume24h: 3200000000
  },

  // OKX
  {
    id: "okx-hong-kong",
    name: "OKX Hong Kong",
    latitude: 22.3193,
    longitude: 114.1694,
    cloudProvider: "GCP",
    region: "asia-east2",
    volume24h: 1500000000
  },
  {
    id: "okx-us-central",
    name: "OKX US-Central",
    latitude: 41.2619,
    longitude: -95.8608,
    cloudProvider: "GCP",
    region: "us-central1",
    volume24h: 950000000
  },

  // Bybit
  {
    id: "bybit-singapore",
    name: "Bybit Singapore",
    latitude: 1.3521,
    longitude: 103.8198,
    cloudProvider: "Azure",
    region: "southeastasia",
    volume24h: 1200000000
  },
  {
    id: "bybit-london",
    name: "Bybit London",
    latitude: 51.5074,
    longitude: -0.1278,
    cloudProvider: "Azure",
    region: "uksouth",
    volume24h: 800000000
  },

  // Deribit
  {
    id: "deribit-netherlands",
    name: "Deribit Netherlands",
    latitude: 52.3676,
    longitude: 4.9041,
    cloudProvider: "AWS",
    region: "eu-west-1",
    volume24h: 650000000
  },

  // Additional exchanges for more coverage
  {
    id: "coinbase-us-west",
    name: "Coinbase US-West",
    latitude: 37.7749,
    longitude: -122.4194,
    cloudProvider: "GCP",
    region: "us-west1",
    volume24h: 2100000000
  },
  {
    id: "kraken-germany",
    name: "Kraken Germany",
    latitude: 50.1109,
    longitude: 8.6821,
    cloudProvider: "Azure",
    region: "germanywestcentral",
    volume24h: 750000000
  },
  {
    id: "bitfinex-tokyo",
    name: "Bitfinex Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    cloudProvider: "AWS",
    region: "ap-northeast-1",
    volume24h: 450000000
  },
  {
    id: "huobi-seoul",
    name: "Huobi Seoul",
    latitude: 37.5665,
    longitude: 126.9780,
    cloudProvider: "GCP",
    region: "asia-northeast3",
    volume24h: 680000000
  },
  {
    id: "kucoin-australia",
    name: "KuCoin Australia",
    latitude: -33.8688,
    longitude: 151.2093,
    cloudProvider: "Azure",
    region: "australiaeast",
    volume24h: 520000000
  }
];
