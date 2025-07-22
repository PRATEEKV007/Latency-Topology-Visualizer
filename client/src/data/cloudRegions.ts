export interface CloudRegion {
  id: string;
  regionName: string;
  provider: string;
  latitude: number;
  longitude: number;
  serverCount: number;
}

export const cloudRegions: CloudRegion[] = [
  // AWS Regions
  {
    id: "aws-us-east-1",
    regionName: "US East (N. Virginia)",
    provider: "AWS",
    latitude: 38.9072,
    longitude: -77.0369,
    serverCount: 15
  },
  {
    id: "aws-us-west-2",
    regionName: "US West (Oregon)",
    provider: "AWS",
    latitude: 45.5152,
    longitude: -122.6784,
    serverCount: 12
  },
  {
    id: "aws-eu-west-1",
    regionName: "Europe (Ireland)",
    provider: "AWS",
    latitude: 53.4084,
    longitude: -8.2439,
    serverCount: 14
  },
  {
    id: "aws-ap-southeast-1",
    regionName: "Asia Pacific (Singapore)",
    provider: "AWS",
    latitude: 1.3521,
    longitude: 103.8198,
    serverCount: 10
  },
  {
    id: "aws-ap-northeast-1",
    regionName: "Asia Pacific (Tokyo)",
    provider: "AWS",
    latitude: 35.6762,
    longitude: 139.6503,
    serverCount: 11
  },

  // GCP Regions
  {
    id: "gcp-us-central1",
    regionName: "US Central (Iowa)",
    provider: "GCP",
    latitude: 41.5868,
    longitude: -93.6250,
    serverCount: 13
  },
  {
    id: "gcp-us-west1",
    regionName: "US West (Oregon)",
    provider: "GCP",
    latitude: 45.5152,
    longitude: -122.6784,
    serverCount: 9
  },
  {
    id: "gcp-europe-west1",
    regionName: "Europe West (Belgium)",
    provider: "GCP",
    latitude: 50.8503,
    longitude: 4.3517,
    serverCount: 8
  },
  {
    id: "gcp-asia-east2",
    regionName: "Asia East (Hong Kong)",
    provider: "GCP",
    latitude: 22.3193,
    longitude: 114.1694,
    serverCount: 7
  },
  {
    id: "gcp-asia-northeast3",
    regionName: "Asia Northeast (Seoul)",
    provider: "GCP",
    latitude: 37.5665,
    longitude: 126.9780,
    serverCount: 6
  },

  // Azure Regions
  {
    id: "azure-eastus",
    regionName: "East US (Virginia)",
    provider: "Azure",
    latitude: 37.3382,
    longitude: -79.0193,
    serverCount: 11
  },
  {
    id: "azure-westus2",
    regionName: "West US 2 (Washington)",
    provider: "Azure",
    latitude: 47.7511,
    longitude: -120.7401,
    serverCount: 8
  },
  {
    id: "azure-northeurope",
    regionName: "North Europe (Ireland)",
    provider: "Azure",
    latitude: 53.3478,
    longitude: -6.2597,
    serverCount: 9
  },
  {
    id: "azure-southeastasia",
    regionName: "Southeast Asia (Singapore)",
    provider: "Azure",
    latitude: 1.3521,
    longitude: 103.8198,
    serverCount: 7
  },
  {
    id: "azure-uksouth",
    regionName: "UK South (London)",
    provider: "Azure",
    latitude: 51.5074,
    longitude: -0.1278,
    serverCount: 6
  },
  {
    id: "azure-australiaeast",
    regionName: "Australia East (Sydney)",
    provider: "Azure",
    latitude: -33.8688,
    longitude: 151.2093,
    serverCount: 5
  },
  {
    id: "azure-germanywestcentral",
    regionName: "Germany West Central (Frankfurt)",
    provider: "Azure",
    latitude: 50.1109,
    longitude: 8.6821,
    serverCount: 7
  }
];
