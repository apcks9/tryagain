import { createContext, useState, useContext } from 'react';

const PriceContext = createContext();

export function PriceProvider({ children }) {
  const [discountedPrice, setDiscountedPrice] = useState(null);

  return (
    <PriceContext.Provider value={{ discountedPrice, setDiscountedPrice }}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice must be used within a PriceProvider');
  }
  return context;
} 