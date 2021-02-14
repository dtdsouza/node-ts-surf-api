import StormGlass3hoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import StormGlass3hoursResponseFixture from '@test/fixtures/api_3hours_response.json';
import { Beach, BeachPosition } from '@src/models/beach';
import nock from 'nock';
describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
    };

    const beach = new Beach(defaultBeach);
    await beach.save();
  });
  it('Should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: { Authorization: (): boolean => true },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        params: /(.*)/,
        source: 'noaa',
        lng: '151.289824',
        lat: '-33.792726',
      })
      .reply(200, StormGlass3hoursFixture);

    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual(StormGlass3hoursResponseFixture);
  });

  it('Should return a 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: { Authorization: (): boolean => true },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        params: /(.*)/,
        source: 'noaa',
        lng: '151.289824',
        lat: '-33.792726',
      })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get('/forecast');

    expect(status).toBe(500);
  });
});
