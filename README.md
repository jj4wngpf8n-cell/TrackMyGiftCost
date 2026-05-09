# 🎁 Gift Cost Tracker

> THE MOST IMPORTANT GIFT BAR NONE IS THE NEXT ONE

A modern web application for managing clients and tracking gift purchases with preset items and on-the-fly pricing.

## Features

### 👥 Client Management
- **Add Clients**: Create a list of clients to track
- **View Client Details**: Click on any client to see their purchase history
- **Delete Clients**: Remove clients you no longer need
- **Total Tracking**: Automatic calculation of total spending per client

### 🛍️ Item Management

#### Preset Items
- Pre-configured list of common gift items with set prices
- Default items included: Mug, Candle, Flowers, Chocolate Box, Gift Card
- **Add Custom Presets**: Create new preset items for quick reuse
- **Delete Presets**: Remove items from the preset list

#### Dynamic Items
- **Add Custom Items On-The-Fly**: Create items without adding to presets
- **Flexible Pricing**: Set any price for any item
- **Quick Entry**: Use either preset items or custom items for each purchase

### 💰 Cost Calculation
- **Item Total**: See the price for each item in the purchase list
- **Grand Total**: Automatic calculation of total cost for all items for each client
- **Real-time Updates**: Totals update instantly when you add or remove items

## Getting Started

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/jj4wngpf8n-cell/TrackMyGiftCost.git
   cd TrackMyGiftCost
   ```

2. Open `index.html` in your web browser:
   - Double-click the file, or
   - Right-click and select "Open with" → Your preferred browser

No additional dependencies or installation required!

### Usage

#### Adding a Client
1. Enter the client name in the input field
2. Click "Add Client" or press Enter
3. The client will appear in the clients list

#### Managing Preset Items
1. In the left sidebar, enter the item name and price
2. Click "Save Item" to add it to the preset list
3. Click "Delete" on any preset item to remove it
4. Deleted presets won't appear for future purchases

#### Adding Purchases for a Client
1. Click "View" on any client card
2. You have two options:
   - **Option 1 - Preset Items**: Select an item from the dropdown and click "Add Item"
   - **Option 2 - Custom Items**: Enter custom item name and price, then click "Add Custom Item"
3. The purchase appears in the purchases table
4. The total automatically updates

#### Removing a Purchase
1. Open a client's details by clicking "View"
2. Click "Remove" on any item in the purchases table
3. The item is deleted and the total updates

#### Navigating Back
1. Click "← Back" to return to the clients list from client details

## Data Storage

All data is stored locally in your browser's `localStorage`:
- **Clients and purchases** persist between sessions
- **Preset items** are saved and reloaded on each visit
- No server or account required
- Works offline

## File Structure

```
TrackMyGiftCost/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── app.js          # Application logic and data management
└── README.md       # Documentation
```

## Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers

## Features Breakdown

### Real-time Calculations
- Totals update instantly when items are added or removed
- No page refresh needed
- Accurate decimal handling for currency

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Adaptive layout adjusts to screen size
- Touch-friendly buttons and inputs

### Data Persistence
- All changes saved automatically to browser storage
- Data remains even after closing the browser
- Can clear all data by clearing browser cache

## Tips & Tricks

- **Bulk Presets**: Create preset items for your most common gifts to speed up data entry
- **Price Updates**: If you need to change a preset price, delete the old one and create a new one
- **Client Organization**: Use meaningful client names for easy identification
- **Custom Items**: Use custom items for unique or one-time gifts

## Future Enhancements

Potential features for future versions:
- Export/import data as CSV
- Print client summaries
- Budget tracking and analytics
- Multiple lists/projects
- Category organization
- Search and filter functionality
- Cloud sync across devices

## License

Free to use and modify.

## Support

For issues or questions, please create an issue on GitHub.
