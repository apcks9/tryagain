import { useEffect, useState } from "react";
import { usePrice } from './PriceContext';

const StockQuote = ({ symbol }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [netIncome, setNetIncome] = useState(null);
  const [eps, setEps] = useState(null);
  const { setDiscountedPrice } = usePrice();

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=d0ihdlhr01qrfsag60r0d0ihdlhr01qrfsag60rg`
        );
        const data = await res.json();
        if (data.c) {
          setPrice(data.c);
          const discounted = (data.c - data.c * 0.04).toFixed(2);
          setDiscountedPrice(discounted);
        } else {
          setError('No price data available');
        }
      } catch (err) {
        setError('Failed to fetch price');
      } finally {
        setLoading(false);
      }
    };

    const fetchFinancials = async () => {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=d0ihdlhr01qrfsag60r0d0ihdlhr01qrfsag60rg`
        );
        const data = await res.json();
        if (data.metric) {
          // Set net income in billions
          if (data.metric.netIncome) {
            const netIncomeInBillions = (data.metric.netIncome / 1000000000).toFixed(2);
            setNetIncome(netIncomeInBillions);
          }
          // Set EPS
          if (data.metric.epsBasicExclExtraItems) {
            setEps(data.metric.epsBasicExclExtraItems.toFixed(2));
          }
        }
      } catch (err) {
        console.error('Failed to fetch financials:', err);
      }
    };

    fetchQuote();
    fetchFinancials();
    const interval = setInterval(() => {
      fetchQuote();
      fetchFinancials();
    }, 30000);
    return () => clearInterval(interval);
  }, [symbol, setDiscountedPrice]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!price) return <div>No price available</div>;

  return (
    <div>
      <h2>{symbol}</h2>
      <p>${price.toFixed(2)}</p>
      <p>4% drop of the tsla price is ${(price.toFixed(2) - price.toFixed(2) * 0.04).toFixed(2)}</p>
      <p>Last Year Net Income: ${netIncome ? `${netIncome}B` : 'Loading...'}</p>
      <p>Current EPS: ${eps || 'Loading...'}</p>
    </div>
  );
};

export default StockQuote; 