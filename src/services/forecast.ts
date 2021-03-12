import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';
import { Beach } from '@src/models/beach';
import logger from '@src/logger';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {
  rating: number;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    logger.info(`Preparing the forecast for ${beaches.length} beaches.`);
    try {
      const pointsWithCorrectSources = await Promise.all(
        beaches.map(async (beach) => {
          const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
          const enrichedBeachData = this.enrichBeachData(points, beach);

          return enrichedBeachData;
        }),
      );

      const timeForecast = this.mapForecastByTime(pointsWithCorrectSources.flat());

      return timeForecast;
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingInternalError(error);
    }
  }

  private enrichBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
    return points.map((point) => ({
      ...point,
      lat: beach.lat,
      lng: beach.lng,
      position: beach.position,
      rating: 1,
      name: beach.name,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    return forecast.reduce<TimeForecast[]>((acc, forecastPoint: BeachForecast) => {
      const timePointIndex = acc.findIndex(({ time }) => time === forecastPoint.time);

      timePointIndex !== -1
        ? acc[timePointIndex].forecast.push(forecastPoint)
        : acc.push({ time: forecastPoint.time, forecast: [forecastPoint] });

      return [...acc];
    }, []);
  }
}
