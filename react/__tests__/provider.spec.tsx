import { render } from '@testing-library/react';
import { CortexProvider, useAppContext } from '../provider';
import React from 'react';

describe('provider', () => {
  it('should provide the coreInstance to the context', () => {
    const dummyCoreInstance = { store: {}, getService: jest.fn() };

    const TestComponent = () => {
      const context = useAppContext();
      expect(context).toEqual(dummyCoreInstance);
      return null; // This component doesn't render anything.
    };

    render(
      <CortexProvider coreInstance={dummyCoreInstance}>
        <TestComponent />
      </CortexProvider>
    );
  });
});
