import { Container } from './components/container';
import { Button } from './components/button';
import { Counter } from './components/counter';
import { useAppSelector, useService } from './cortex/utils/hooks';

function App() {
  const { increment, decrement } = useService('counter');
  const count = useAppSelector((state) => state.counter.count.get());
  return (
    <Container>
      <Button onClick={decrement}>-</Button>
      <Counter>{count}</Counter>
      <Button onClick={increment}>+</Button>
    </Container>
  );
}

export default App;
