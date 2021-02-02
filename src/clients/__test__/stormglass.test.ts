import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
import stormGlassNormalized3HoursFixture from '@test/fixtures/sotrmglass_normalized_response_3_hours.json';
import stormGlass3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';

jest.mock('axios');
describe('StormGlass Client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  it('should return the normalized forecast from the StormGlass service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockResolvedValueOnce({ data: stormGlass3HoursFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);
    expect(response).toEqual(stormGlassNormalized3HoursFixture);
  });

  it('should exclude incomplete data points', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          time: '2021-02-02T00:00:00+00:00',
          swellDirection: {
            noaa: 196.23,
          },
        },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: incompleteResponse });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass client when request fail before reaching service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValueOnce({ message: 'Network Error' });

    const stormGlass = new StormGlass(axios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error trying to communicate to StormGlass: Network Error',
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValueOnce({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(axios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429',
    );
  });
});
