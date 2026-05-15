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

/** Real-coordinate China region polygons (5 super-regions, simplified rectangles)
 *  for demos that overlay on a real CfMapTile / OSM base. */
export const sampleGeoChina = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { id: 'huabei', name: '华北 (京津冀)' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [113, 36], [119, 36], [119, 42.5], [113, 42.5], [113, 36],
        ]],
      },
    },
    {
      type: 'Feature' as const,
      properties: { id: 'huadong', name: '华东 (长三角)' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [116, 28], [122.5, 28], [122.5, 35.5], [116, 35.5], [116, 28],
        ]],
      },
    },
    {
      type: 'Feature' as const,
      properties: { id: 'huanan', name: '华南 (珠三角+广西)' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [104, 18], [118, 18], [118, 26.5], [104, 26.5], [104, 18],
        ]],
      },
    },
    {
      type: 'Feature' as const,
      properties: { id: 'xibu', name: '西部 (川渝陕甘)' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [95, 28], [110, 28], [110, 40], [95, 40], [95, 28],
        ]],
      },
    },
    {
      type: 'Feature' as const,
      properties: { id: 'dongbei', name: '东北 (黑吉辽)' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [118, 38.5], [135, 38.5], [135, 53.5], [118, 53.5], [118, 38.5],
        ]],
      },
    },
  ],
};

/** Real-coordinate Chinese city points for flow / point demos. */
export const samplePointsChina = [
  { id: 'BJ', name: '北京', lng: 116.41, lat: 39.9 },
  { id: 'SH', name: '上海', lng: 121.47, lat: 31.23 },
  { id: 'GZ', name: '广州', lng: 113.27, lat: 23.13 },
  { id: 'CD', name: '成都', lng: 104.07, lat: 30.66 },
  { id: 'XA', name: '西安', lng: 108.94, lat: 34.34 },
  { id: 'SY', name: '沈阳', lng: 123.43, lat: 41.81 },
];
