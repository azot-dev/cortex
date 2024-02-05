import './App.css';
import { useAppSelector, useMethod, useService } from './cortex/utils/hooks';

function App() {
  const { loadBreeds, generateImage, selectBreed } = useService('dog');
  const { isSuccess } = useMethod(loadBreeds);

  const breeds = useAppSelector((state) => state.dog.breeds.get());
  const image = useAppSelector((state) => state.dog.currentImage.get());

  if (!isSuccess) {
    return;
  }

  return (
    <>
      <div>
        <select onChange={(event) => selectBreed(event.target.value)} className="select">
          {breeds.map((breedName) => (
            <option value={breedName} key={breedName}>
              {breedName}
            </option>
          ))}
        </select>
      </div>
      <div className="card">
        <img src={image} className="image" alt="image" />
      </div>
      <button onClick={generateImage}>generate random image</button>
    </>
  );
}

export default App;
