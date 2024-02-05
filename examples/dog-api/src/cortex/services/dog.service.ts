import { Breed } from '../dependencies/api/api.gateway';
import { Service } from '../utils/service';

type State = {
  breeds: Breed[];
  selectedBreed: Breed | null;
  currentImage?: string;
};

export class DogService extends Service<State> {
  public static initialState: State = { breeds: [], selectedBreed: null };

  async loadBreeds() {
    const response = await this.dependencies.api.getBreeds();
    const breeds = Object.keys(response.message);
    this.state.breeds.set(breeds);
    if (breeds.length > 0) {
      this.selectBreed(breeds[0]);
    }
  }

  selectBreed(breed: Breed) {
    this.state.selectedBreed.set(breed);
    this.generateImage();
  }

  async generateImage() {
    const response = await this.dependencies.api.getBreedRandomImage(this.state.selectedBreed.get());
    this.state.currentImage.set(response.message);
  }
}
