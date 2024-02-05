export type Breed = string;
export type BreedVariant = string;
export type ImageUri = string;
export type ResponseStatus = 'success' | 'error';

export interface ApiGateway {
  getBreeds(): Promise<{ message: Record<Breed, BreedVariant[]>; status: ResponseStatus }>;
  getBreedRandomImage(breed: Breed): Promise<{ message: ImageUri; status: ResponseStatus }>;
}
