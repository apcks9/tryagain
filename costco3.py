import yfinance as yf
import numpy as np
from datetime import datetime, timedelta
from scipy.stats import norm

# Black-Scholes delta for call option
def calculate_call_delta(S, K, T, r, sigma):
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    return norm.cdf(d1)

# Load Costco stock
ticker = yf.Ticker("COST")

# Get current stock price
current_price = ticker.history(period="1d")['Close'].iloc[0]
print(f"Current COST Price: ${current_price:.2f}")

# Get expiration dates and find one closest to 4 weeks out
expirations = ticker.options
target_date = datetime.today() + timedelta(weeks=4)
expiration_date = min(expirations, key=lambda x: abs(datetime.strptime(x, "%Y-%m-%d") - target_date))
expiration_datetime = datetime.strptime(expiration_date, "%Y-%m-%d")
days_to_exp = (expiration_datetime - datetime.today()).days
T = days_to_exp / 365  # time to expiration in years

print(f"Using expiration date: {expiration_date} ({days_to_exp} days out)")

# Fetch the option chain
option_chain = ticker.option_chain(expiration_date)

# Filter call options ~5% below current price
strike_target = current_price * 0.95
tolerance = 2  # ±$2 around target
filtered_calls = option_chain.calls[
    (option_chain.calls['strike'] >= strike_target - tolerance) &
    (option_chain.calls['strike'] <= strike_target + tolerance)
].copy()

# Calculate estimated delta for each option
r = 0.05  # risk-free rate assumption
filtered_calls['est_delta'] = filtered_calls.apply(
    lambda row: calculate_call_delta(
        S=current_price,
        K=row['strike'],
        T=T,
        r=r,
        sigma=row['impliedVolatility']  # already in decimal format
    ), axis=1
)

# Show the results
print("\nFiltered Call Options (~5% below current price):")
print(filtered_calls[['contractSymbol', 'strike', 'lastPrice', 'bid', 'ask', 'impliedVolatility', 'est_delta']])
