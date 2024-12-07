import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import ProductCatalog from './components/ProductCatalog';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ProductCatalog />
    </Provider>
  );
};

export default App;
