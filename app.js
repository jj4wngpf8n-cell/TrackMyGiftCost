// Data Management
class GiftTracker {
    constructor() {
        this.clients = this.loadFromStorage('clients') || [];
        this.presets = this.loadFromStorage('presets') || this.getDefaultPresets();
        this.currentClient = null;
        this.draggedPreset = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPresets();
        this.renderClients();
        this.updateGrandTotal();
    }

    getDefaultPresets() {
        return [
            { id: 1, name: 'Mug', price: 12.99 },
            { id: 2, name: 'Candle', price: 15.99 },
            { id: 3, name: 'Flowers', price: 25.00 },
            { id: 4, name: 'Chocolate Box', price: 18.50 },
            { id: 5, name: 'Gift Card $25', price: 25.00 }
        ];
    }

    // Storage Methods
    loadFromStorage(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('Error loading from storage:', e);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to storage:', e);
        }
    }

    // Client Methods
    addClient(name) {
        if (!name.trim()) {
            alert('Please enter a client name');
            return;
        }
        const client = {
            id: Date.now(),
            name: name.trim(),
            purchases: []
        };
        this.clients.push(client);
        this.saveToStorage('clients', this.clients);
        this.renderClients();
        this.updateGrandTotal();
        document.getElementById('clientName').value = '';
    }

    deleteClient(clientId) {
        if (confirm('Are you sure you want to delete this client?')) {
            this.clients = this.clients.filter(c => c.id !== clientId);
            this.saveToStorage('clients', this.clients);
            this.renderClients();
            this.updateGrandTotal();
        }
    }

    selectClient(clientId) {
        this.currentClient = this.clients.find(c => c.id === clientId);
        this.showDetailsSection();
        this.renderClientDetails();
    }

    // Preset Methods
    addPreset(name, price) {
        if (!name.trim() || price < 0) {
            alert('Please enter valid item name and price');
            return;
        }
        const preset = {
            id: Date.now(),
            name: name.trim(),
            price: parseFloat(price)
        };
        this.presets.push(preset);
        this.saveToStorage('presets', this.presets);
        this.renderPresets();
        this.updateItemSelect();
        document.getElementById('presetName').value = '';
        document.getElementById('presetPrice').value = '';
    }

    deletePreset(presetId) {
        if (confirm('Are you sure you want to delete this preset item?')) {
            this.presets = this.presets.filter(p => p.id !== presetId);
            this.saveToStorage('presets', this.presets);
            this.renderPresets();
            this.updateItemSelect();
        }
    }

    // Purchase Methods
    addPurchase(itemName, price, isPreset = false) {
        if (!this.currentClient) return;
        if (!itemName.trim() || price < 0) {
            alert('Please enter valid item name and price');
            return;
        }
        const purchase = {
            id: Date.now(),
            name: itemName.trim(),
            price: parseFloat(price),
            isPreset: isPreset
        };
        this.currentClient.purchases.push(purchase);
        this.saveToStorage('clients', this.clients);
        this.renderClientDetails();
        this.renderClients();
        this.updateGrandTotal();
    }

    addPurchaseToClientById(clientId, presetId) {
        const client = this.clients.find(c => c.id === clientId);
        const preset = this.presets.find(p => p.id === presetId);

        if (!client || !preset) return;

        const purchase = {
            id: Date.now(),
            name: preset.name,
            price: preset.price,
            isPreset: true
        };
        client.purchases.push(purchase);
        this.saveToStorage('clients', this.clients);
        this.renderClients();
        this.updateGrandTotal();
    }

    deletePurchase(purchaseId) {
        if (!this.currentClient) return;
        this.currentClient.purchases = this.currentClient.purchases.filter(
            p => p.id !== purchaseId
        );
        this.saveToStorage('clients', this.clients);
        this.renderClientDetails();
        this.renderClients();
        this.updateGrandTotal();
    }

    // Calculations
    getClientTotal(client) {
        return client.purchases.reduce((sum, p) => sum + p.price, 0);
    }

    getGrandTotal() {
        return this.clients.reduce((sum, client) => sum + this.getClientTotal(client), 0);
    }

    // Update Grand Total
    updateGrandTotal() {
        const grandTotal = this.getGrandTotal();
        const grandTotalElement = document.getElementById('grandTotal');
        if (grandTotalElement) {
            grandTotalElement.textContent = `$${grandTotal.toFixed(2)}`;
        }
    }

    // Rendering Methods
    renderClients() {
        const container = document.getElementById('clientsList');
        container.innerHTML = '';

        if (this.clients.length === 0) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 40px 20px;">No clients yet. Add one to get started!</p>';
            return;
        }

        this.clients.forEach(client => {
            const total = this.getClientTotal(client);
            const card = document.createElement('div');
            card.className = 'client-card';
            card.id = `client-${client.id}`;
            card.draggable = false;
            card.innerHTML = `
                <div>
                    <div class="client-card-name">${client.name}</div>
                    <div class="client-card-total">$${total.toFixed(2)}</div>
                </div>
                <div class="client-card-actions">
                    <button class="btn btn-primary" onclick="tracker.selectClient(${client.id})">View</button>
                    <button class="btn btn-danger" onclick="tracker.deleteClient(${client.id})">Delete</button>
                </div>
            `;

            // Add drag and drop listeners
            card.addEventListener('dragover', (e) => this.handleDragOver(e, card));
            card.addEventListener('dragleave', (e) => this.handleDragLeave(e, card));
            card.addEventListener('drop', (e) => this.handleDrop(e, client.id));

            container.appendChild(card);
        });
    }

    renderPresets() {
        const container = document.getElementById('presetList');
        container.innerHTML = '';

        this.presets.forEach(preset => {
            const item = document.createElement('div');
            item.className = 'preset-item';
            item.draggable = true;
            item.id = `preset-${preset.id}`;
            item.innerHTML = `
                <div class="preset-item-info">
                    <div class="preset-item-name">${preset.name}</div>
                    <div class="preset-item-price">$${preset.price.toFixed(2)}</div>
                </div>
                <button class="preset-item-delete" onclick="tracker.deletePreset(${preset.id})">Delete</button>
            `;

            // Drag event listeners
            item.addEventListener('dragstart', (e) => this.handleDragStart(e, preset));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));

            container.appendChild(item);
        });
    }

    updateItemSelect() {
        const select = document.getElementById('itemSelect');
        select.innerHTML = '<option value="">-- Select Item --</option>';
        this.presets.forEach(preset => {
            const option = document.createElement('option');
            option.value = preset.id;
            option.textContent = `${preset.name} - $${preset.price.toFixed(2)}`;
            select.appendChild(option);
        });
    }

    renderClientDetails() {
        if (!this.currentClient) return;

        // Update header
        document.getElementById('clientNameSpan').textContent = this.currentClient.name;
        document.getElementById('clientTitle').textContent = `${this.currentClient.name} - Purchases`;

        // Update item select
        this.updateItemSelect();

        // Render purchases table
        const tableBody = document.getElementById('purchasesTableBody');
        tableBody.innerHTML = '';

        this.currentClient.purchases.forEach(purchase => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${purchase.name}</td>
                <td>$${purchase.price.toFixed(2)}</td>
                <td><button class="delete-btn" onclick="tracker.deletePurchase(${purchase.id})">Remove</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Update total
        const total = this.getClientTotal(this.currentClient);
        document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
    }

    // UI Methods
    showDetailsSection() {
        document.getElementById('clientsList').parentElement.style.display = 'none';
        document.getElementById('detailsSection').style.display = 'block';
        window.scrollTo(0, 0);
    }

    hideDetailsSection() {
        document.getElementById('detailsSection').style.display = 'none';
        document.getElementById('clientsList').parentElement.style.display = 'block';
        this.currentClient = null;
    }

    // Drag and Drop Methods
    handleDragStart(e, preset) {
        this.draggedPreset = preset;
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', JSON.stringify(preset));
        
        // Show preview
        const preview = document.getElementById('dragPreview');
        preview.textContent = `🎁 ${preset.name} - $${preset.price.toFixed(2)}`;
        preview.style.display = 'block';
        e.dataTransfer.setDragImage(preview, 0, 0);
    }

    handleDragEnd(e) {
        const preview = document.getElementById('dragPreview');
        preview.style.display = 'none';
        
        // Remove drag-over class from all cards
        document.querySelectorAll('.client-card').forEach(card => {
            card.classList.remove('drag-over');
        });
    }

    handleDragOver(e, card) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        card.classList.add('drag-over');
    }

    handleDragLeave(e, card) {
        card.classList.remove('drag-over');
    }

    handleDrop(e, clientId) {
        e.preventDefault();
        
        const card = e.currentTarget;
        card.classList.remove('drag-over');
        
        if (this.draggedPreset) {
            this.addPurchaseToClientById(clientId, this.draggedPreset.id);
            // Show success feedback
            const originalBG = card.style.background;
            card.style.background = 'rgba(16, 185, 129, 0.1)';
            setTimeout(() => {
                card.style.background = originalBG;
            }, 600);
        }
    }

    setupEventListeners() {
        // Client management
        document.getElementById('addClientBtn').addEventListener('click', () => {
            const name = document.getElementById('clientName').value;
            this.addClient(name);
        });

        document.getElementById('clientName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const name = document.getElementById('clientName').value;
                this.addClient(name);
            }
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            this.hideDetailsSection();
        });

        // Preset management
        document.getElementById('savePresetBtn').addEventListener('click', () => {
            const name = document.getElementById('presetName').value;
            const price = document.getElementById('presetPrice').value;
            this.addPreset(name, price);
        });

        document.getElementById('addPresetBtn').addEventListener('click', () => {
            document.getElementById('presetModal').style.display = 'block';
        });

        // Modal
        const modal = document.getElementById('presetModal');
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.getElementById('modalSaveBtn').addEventListener('click', () => {
            const name = document.getElementById('modalPresetName').value;
            const price = document.getElementById('modalPresetPrice').value;
            this.addPreset(name, price);
            document.getElementById('modalPresetName').value = '';
            document.getElementById('modalPresetPrice').value = '';
            modal.style.display = 'none';
        });

        // Purchase management
        document.getElementById('itemSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                document.getElementById('customItemPrice').style.display = 'none';
            }
        });

        document.getElementById('addItemBtn').addEventListener('click', () => {
            const selectValue = document.getElementById('itemSelect').value;
            if (!selectValue) {
                alert('Please select an item');
                return;
            }
            const preset = this.presets.find(p => p.id == selectValue);
            if (preset) {
                this.addPurchase(preset.name, preset.price, true);
                document.getElementById('itemSelect').value = '';
            }
        });

        document.getElementById('addCustomItemBtn').addEventListener('click', () => {
            const name = document.getElementById('customItemName').value;
            const price = document.getElementById('customItemPrice2').value;
            if (name.trim() && price) {
                this.addPurchase(name, price, false);
                document.getElementById('customItemName').value = '';
                document.getElementById('customItemPrice2').value = '';
            }
        });

        // Enter key support
        document.getElementById('customItemName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addCustomItemBtn').click();
            }
        });

        document.getElementById('customItemPrice2').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('addCustomItemBtn').click();
            }
        });
    }
}

// Initialize app
const tracker = new GiftTracker();