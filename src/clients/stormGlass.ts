import { AxiosStatic } from 'axios';

export class StormGlass {
  readonly stormGlassAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,windWaveDirection';
  readonly stormGlassAPISource = 'noaa';
  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<Record<string, never>> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lng=${lng}&lat=${lat}`,
    );
  }
}
