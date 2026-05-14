/** Tiny synthetic GeoJSON for map demos — 4 rectangular "regions". */
export const sampleGeo = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { id: 'N', name: '北区' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[0, 40], [60, 40], [60, 80], [0, 80], [0, 40]]],
      },
    },
    {
      type: 'Feature' as const,
      properties: { id: 'S', name: '南区' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[0, 0], [60, 0], [60, 40], [0, 40], [0, 0]]],
      },
    },
    {
      type: 'Feature' as const,
      properties: { id: 'E', name: '东区' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[60, 20], [120, 20], [120, 60], [60, 60], [60, 20]]],
      },
    },
    {
      type: 'Feature' as const,
      properties: { id: 'W', name: '西区' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[-60, 20], [0, 20], [0, 60], [-60, 60], [-60, 20]]],
      },
    },
  ],
};

export const samplePoints = [
  { id: 'BJ', name: '北京', lng: 30, lat: 60 },
  { id: 'SH', name: '上海', lng: 90, lat: 40 },
  { id: 'GZ', name: '广州', lng: 30, lat: 20 },
  { id: 'CD', name: '成都', lng: -30, lat: 40 },
];
