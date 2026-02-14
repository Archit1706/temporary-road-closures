import { describe, it, expect } from 'vitest';
import { ValhallaAPI, ValhallaResponse, decodePolyline } from '../services/valhallaApi';

describe('routeToGeoJSON', () => {
  it('swaps latitude and longitude for GeoJSON', () => {
    const api = new ValhallaAPI();

    const input = [
      [52.52, 13.405], // Berlin
    ] as [number, number][];

    const result = api.routeToGeoJSON(input);

    expect(result).toEqual([
      [13.405, 52.52],
    ]);
  });
});

describe('getRouteStats', () => {
  it('should extract correct summary statistics', () => {
    const api = new ValhallaAPI();

    const mockValhallaResponse = {
      trip: {
        status: 0,
        status_message: 'Found route between points',
        summary: {
          has_time_restrictions: false,
          has_toll: true,
          has_highway: true,
          has_ferry: false,
          min_lat: 52.51,
          min_lon: 13.39,
          max_lat: 52.54,
          max_lon: 13.45,
          time: 915,
          length: 18.6,
          cost: 915
        },
        legs: [
          {
            summary: {
              has_time_restrictions: false,
              has_toll: true,
              has_highway: true,
              has_ferry: false,
              min_lat: 52.51,
              min_lon: 13.39,
              max_lat: 52.54,
              max_lon: 13.45,
              time: 915,
              length: 18.6,
              cost: 915
            },
            maneuvers: [
              {
                type: 1,
                instruction: 'Start out going east on First Street.',
                time: 30,
                length: 0.3,
                begin_shape_index: 0,
                end_shape_index: 2,
                street_names: ['First Street']
              },
              {
                type: 10,
                instruction: 'Turn right onto Highway A10.',
                time: 300,
                length: 8.5,
                begin_shape_index: 2,
                end_shape_index: 20,
                street_names: ['A10']
              },
              {
                type: 10,
                instruction: 'Take the toll exit toward City Center.',
                time: 420,
                length: 9.5,
                begin_shape_index: 20,
                end_shape_index: 45,
                street_names: ['Toll Road']
              },
              {
                type: 4,
                instruction: 'You have arrived at your destination.',
                time: 0,
                length: 0,
                begin_shape_index: 45,
                end_shape_index: 45
              }
            ],
            shape: '}_ilFz~vpM??a@c@_@c@',
          }
        ],
        locations: [
          {
            lat: 52.510008,
            lon: 13.399954,
            type: 'break',
            original_index: 0
          },
          {
            lat: 52.540876,
            lon: 13.449321,
            type: 'break',
            original_index: 1
          }
        ],
        units: 'kilometers',
        language: 'en-US'
      }
    } as ValhallaResponse;

    const result = api.getRouteStats(mockValhallaResponse);

    expect(result).toEqual({
      distance_km: 18.6,
      time_minutes: 15.3,
      has_toll: true,
      has_highway: true,
      has_ferry: false,
      maneuvers_count: 4
    });
  });
});

describe('decodePolyLine', () => {
  it('decodes an encoded polyline string into a list of geographic coordinates', () => {
    const mockPolyString = "_p~iF~ps|U_ulLnnqC_mqNvxq`@"

    const result = decodePolyline(mockPolyString, 5);

    expect(result).toEqual([
      [38.5,  -120.2],
      [40.7,  -120.95],
      [43.252, -126.453]
    ]);
  });
});