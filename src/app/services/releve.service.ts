import {Injectable} from '@angular/core';
import {Etudiant, Session} from '../entities/entities';


@Injectable({
  providedIn: 'root'
})
export class ReleveService {
  doc: any;

  constructor() {
  }

//Attestation de scholarité
  replaceErrors(key, value) {
    if (value instanceof Error) {
      return Object.getOwnPropertyNames(value).reduce(function(error, key) {
        error[key] = value[key];
        return error;
      }, {});
    }
    return value;
  }

  errorHandler(error) {
    console.log(JSON.stringify({error: error}, this.replaceErrors));

    if (error.properties && error.properties.errors instanceof Array) {
      const errorMessages = error.properties.errors.map(function(error) {
        return error.properties.explanation;
      }).join('\n');
      console.log('errorMessages', errorMessages);
      // errorMessages is a humanly readable message looking like this :
      // 'The tag beginning with "foobar" is unopened'
    }
    throw error;
  }



}
