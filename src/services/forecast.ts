import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
  rating: number;
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSources = await Promise.all(
      beaches.map(async (beach) => {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = points.map((point) => ({
          ...point,
          lat: beach.lat,
          lng: beach.lng,
          position: beach.position,
          rating: 1,
          name: beach.name,
        }));

        return enrichedBeachData;
      }),
    );

    return pointsWithCorrectSources.flat();
  }
}
