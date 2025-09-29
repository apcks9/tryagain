import { usePrice } from './PriceContext';

function DiscountedPriceDisplay() {
  const { discountedPrice } = usePrice();

  return (
    <div className="stock-card">
      <h2>Discounted Price</h2>
      <p>${discountedPrice || 'Loading...'}</p>
    </div>
  );
}

export default DiscountedPriceDisplay; 