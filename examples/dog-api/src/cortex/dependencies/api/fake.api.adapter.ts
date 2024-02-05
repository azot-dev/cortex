import { ApiGateway, Breed, ImageUri } from './api.gateway';

const simpsons: Record<Breed, ImageUri[]> = {
  homer: [
    'https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png',
    'https://i.pinimg.com/474x/aa/33/1f/aa331f1a8ce02c2723a0bd4ad69465b4.jpg',
  ],
  bart: [
    'https://i.pinimg.com/736x/33/fd/f9/33fdf9b75dbd2fbf6eec0e50ba44ef6f.jpg',
    'https://logowik.com/content/uploads/images/simpson-bart81811.logowik.com.webp',
  ],
  marge: [
    'https://simpsonsfamilyblog.files.wordpress.com/2014/02/marge_simpson-copy.png',
    'https://cache.marieclaire.fr/data/photo/w700_c17/138/margeeee.jpg',
  ],
  lisa: [
    'https://logowik.com/content/uploads/images/lisa-simpson7517.logowik.com.webp',
    'https://st5.depositphotos.com/37050820/66068/v/450/depositphotos_660688560-stock-illustration-lisa-simpson-cartoon-character.jpg',
  ],
  maggie: [
    'https://www.simpsonspark.com/images/persos/contributions/maggie-simpson-24389.jpg',
    'https://e1.pngegg.com/pngimages/115/872/png-clipart-los-simpsons-maggie-simpson-illustration.png',
  ],
};

export class FakeApiAdapter implements ApiGateway {
  async getBreeds() {
    return {
      message: Object.keys(simpsons).reduce((prev, current) => ({ ...prev, [current]: [] }), {}),
      status: 'success' as const,
    };
  }

  async getBreedRandomImage(breed: Breed) {
    const images = simpsons[breed];
    return {
      message: images[Math.floor(Math.random() * images.length)],
      status: 'success' as const,
    };
  }
}
