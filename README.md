# Flow — Time-Dilated Budget

A mobile-first personal budgeting web app. Income becomes **pools** assigned an end date;
each pool pays out `balance ÷ days_remaining` per day, so consistent underspending makes the
daily allowance drift up over time. Surpluses cascade into a permanent **investment pool**.

Single self-contained `index.html` (vanilla JS, no build step) plus a PWA manifest and service
worker for offline use. All state is stored in `localStorage`. Exchange rates come from the
free [ExchangeRate-API](https://www.exchangerate-api.com) open endpoint.

## Features
- Repool-based daily allowance with surplus cascading into a 100-year investment pool
- Ratio-funded savings goals with same-day cascading and live rebalancing
- Per-entity multi-currency with daily auto-conversion (display currency configurable)
- Every expense deducts immediately, shortest-horizon-first; overspending draws down savings
- Invest-on-arrival split, destructive pool deletion, full history
- Installable PWA — works offline, opens standalone

## Run locally
Open `index.html` in a browser, or serve the folder: `python3 -m http.server`.

## Live
https://bertobi.github.io/time-dilated-budget/
