import { Components } from '@advanticsys/map-components';
import { Component, Inject } from '@angular/core';
import {
  CardConfigInterface,
  ENTITY_API_SERVICE,
  HttpResponseEntityType,
  PartialWithRequiredKey,
} from '@concordia-nx-ionic/concordia-shared';
import { Feature, FeatureCollection, Point } from 'geojson';
import { first, map, Observable } from 'rxjs';

export interface EntityApiService {
  getLastPosition(entity: PartialWithRequiredKey<any, '_id'>, options?: any)
  : Observable<HttpResponseEntityType<Feature<Point, { timestamp : number }>>>;
  // Add other required methods here
}

@Component({
  selector: 'concordia-nx-ionic-entity-map',
  templateUrl: './entity-map.component.html',
  styleUrls: ['./entity-map.component.scss'],
})
export class EntityMapComponent<T extends EntityApiService> {
  cardConfig!: CardConfigInterface;
  mapData!: Observable<Components.ConcordiaMap['data']>;

  constructor(
    @Inject(ENTITY_API_SERVICE) private entityApiService: T,
  ) {}

  getMapData(
    entity: PartialWithRequiredKey<any, '_id'>,
  ): Observable<FeatureCollection> {
    return this.entityApiService.getLastPosition(entity).pipe(
      map(res => this.getEntityFeature(res?.data, entity)),
      first(),
    );
  }

  getEntityFeature(
    data: Feature<Point, { timestamp : number }>,
    props: PartialWithRequiredKey<any, '_id'>,
  ): FeatureCollection {
    const updatedData: Feature = {
      ...data,
      properties: {
        id: props['_id'],
        name: props['name'],
        description: props['description'],
        date: new Date(data?.properties.timestamp).toLocaleDateString('es-ES'),
      },
    };

    return {
      type: 'FeatureCollection',
      features: data ? [updatedData] : [],
    };
  }

}
