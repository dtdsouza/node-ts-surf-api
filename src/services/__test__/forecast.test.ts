import { StormGlass } from '@src/clients/stormGlass';
import stormGlassNormalizedResponseFixture from '@test/fixtures/sotrmglass_normalized_response_3_hours.json';
import { BeachPosition, Forecast } from '../forecast';

jest.mock('@src/clients/stormGlass');
describe('Forecast Service', () => {
  it('Should return the forecast for list of beaches', async () => {
    StormGlass.prototype.fetchPoints = jest.fn().mockResolvedValue(stormGlassNormalizedResponseFixture);

    const beaches = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'some-id',
      },
    ];
    const expectedResponse = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 196.23,
        swellHeight: 0.41,
        swellPeriod: 4.3,
        time: '2021-02-02T00:00:00+00:00',
        waveDirection: 194.75,
        waveHeight: 0.58,
        windDirection: 53.34,
        windSpeed: 2.23,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 196.12,
        swellHeight: 0.43,
        swellPeriod: 4.41,
        time: '2021-02-02T01:00:00+00:00',
        waveDirection: 193.45,
        waveHeight: 0.56,
        windDirection: 59.84,
        windSpeed: 2.32,
      },
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
        rating: 1,
        swellDirection: 196.01,
        swellHeight: 0.45,
        swellPeriod: 4.52,
        time: '2021-02-02T02:00:00+00:00',
        waveDirection: 192.15,
        waveHeight: 0.53,
        windDirection: 66.33,
        windSpeed: 2.4,
      },
    ];

    const forecast = new Forecast(new StormGlass());
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(expectedResponse);
  });
});
