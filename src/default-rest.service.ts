import { RequestMethod } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { AnyObject } from 'typed-object-interfaces';

import { BaseRestService } from './base-rest/base-rest.service';
import { Entity } from './base-rest/entity';
import { Collection } from './base-rest/collection';
import { RestRequestSearchParams } from './base-rest/rest-request-search-params';
import { Model } from './base-rest/model';
import { Pagination } from './base-rest/pagination';

/**
 * Implementation default rest methods
 * @todo: make all this methods as mixins. There is two problems:
 * 1. Big problem when we wont to extend {@link BaseRestService}. Because we can not replace parent
 *    class for this {@link DefaultRestService}
 * 2. We use only all of the methods of the {@link DefaultRestService}, we can not disable any one
 */
export abstract class DefaultRestService<M extends Model<M>> extends BaseRestService<M> {

  public view(
    id: string | number,
    options: RestRequestSearchParams<M> = {},
  ): Observable<Entity<M>> {
    return this.send(options, `/${id}`)
               .map(this.mapEntity)
      ;
  } // end get()

  public list(options: RestRequestSearchParams<M> = {}): Observable<Collection<M, Pagination>> {
    return this.send(options)
               .map(this.mapCollection)
      ;
  } // end list()

  public create(model: M, options: RestRequestSearchParams<M> = {}): Observable<Entity<M>> {
    const summaryOptions = {
      method: RequestMethod.Post,
      body:   this.makeRawEntity(model),
      ...options,
    };

    return this.send(summaryOptions)
               .map(this.mapEntity)
               .catch(this.catchValidation)
      ;
  } // end create()

  public update(model: M, options: RestRequestSearchParams<M> = {},
                pk: string = 'id',
  ): Observable<Entity<M>> {
    const summaryOptions = {
      method: RequestMethod.Put,
      body:   this.makeRawEntity(model),
      ...options,
    };

    return this.send(summaryOptions, `/${model[ pk ]}`)
               .map(this.mapEntity)
               .catch(this.catchValidation)
      ;
  } // end update()

  public delete(model: M,
                options: RestRequestSearchParams<M> = {},
                pk: string = 'id',
  ): Observable<AnyObject> {
    const summaryOptions = {
      method: RequestMethod.Delete,
      ...options,
    };

    return this.send(summaryOptions, `/${model[ pk ]}`)
               // .map(this.mapEntity)
               .catch(this.catchValidation)
      ;
  } // end delete()

} // end DefaultRestService
