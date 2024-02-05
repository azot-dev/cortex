import axios from 'axios';
import { ApiGateway, Breed } from './api.gateway';

export class AxiosApiAdapter implements ApiGateway {
  async getBreeds() {
    const response = await axios.get('https://dog.ceo/api/breeds/list/all');
    return response.data;
  }

  async getBreedRandomImage(breed: Breed) {
    const response = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
    return response.data;
  }
}
