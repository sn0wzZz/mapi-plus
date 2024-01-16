import theme from './theme';


export const DARK_MAP = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#0e1416',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },

  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#4caec6',
        // color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#080c0d',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#4197ac',
        // color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#131b1e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#4daec7',
        // color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#192427',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#182421',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#1c2427',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: theme.colors.accent,
        // color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        color: '#46bcec',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#4a6a73',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#070707',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
]

export const LIGHT_MAP = [
  {
    featureType: 'all',
    elementType: 'labels.text',
    stylers: [
      {
        color: '#878787',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      {
        color: theme.colorsLight.backgroundSolid,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        color: '#aee0f4',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
]
// export const LIGHT_MAP = [
//   {
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#e0e0e0',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.icon',
//     stylers: [
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#616161',
//       },
//     ],
//   },
//   {
//     elementType: 'labels.text.stroke',
//     stylers: [
//       {
//         color: '#f9f9f9',
//       },
//     ],
//   },
//   {
//     featureType: 'administrative.land_parcel',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#bdbdbd',
//       },
//     ],
//   },
//   {
//     featureType: 'poi',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#eeeeee',
//       },
//     ],
//   },
//   {
//     featureType: 'poi',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#757575',
//       },
//     ],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#c6c6c6',
//       },
//     ],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#4197ac',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#ffffff',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'labels',
//     stylers: [
//       {
//         color: '#4daec7',
//       },
//       {
//         visibility: 'off',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'labels.text',
//     stylers: [
//       {
//         color: '#61dbfb',
//       },
//       {
//         visibility: 'simplified',
//       },
//     ],
//   },
//   {
//     featureType: 'road',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#61dbfb',
//       },
//       {
//         visibility: 'on',
//       },
//     ],
//   },
//   {
//     featureType: 'road.arterial',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#4daec7',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#c4c4c4',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'labels.text',
//     stylers: [
//       {
//         color: '#4daec7',
//       },
//     ],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#4daec7',
//       },
//     ],
//   },
//   {
//     featureType: 'road.local',
//     elementType: 'labels.text',
//     stylers: [
//       {
//         color: '#4daec7',
//       },
//       {
//         visibility: 'simplified',
//       },
//     ],
//   },
//   {
//     featureType: 'road.local',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#4daec7',
//       },
//     ],
//   },
//   {
//     featureType: 'transit.line',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#e5e5e5',
//       },
//     ],
//   },
//   {
//     featureType: 'transit.station',
//     elementType: 'geometry',
//     stylers: [
//       {
//         color: '#eeeeee',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'all',
//     stylers: [
//       {
//         color: '#46bcec',
//       },
//       {
//         visibility: 'on',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'geometry.fill',
//     stylers: [
//       {
//         color: '#c8d7d4',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'labels.text.fill',
//     stylers: [
//       {
//         color: '#070707',
//       },
//     ],
//   },
//   {
//     featureType: 'water',
//     elementType: 'labels.text.stroke',
//     stylers: [
//       {
//         color: '#ffffff',
//       },
//     ],
//   },
// ]
