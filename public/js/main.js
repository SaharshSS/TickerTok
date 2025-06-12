// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Sign-In
    function initializeGoogleSignIn() {
        google.accounts.id.initialize({
            client_id: '[YOUR_GOOGLE_CLIENT_ID]',
            callback: handleGoogleSignIn
        });
    }

    // Handle Google Sign-In
    function handleGoogleSignIn(response) {
        // Send the ID token to your server
        const idToken = response.credential;
        
        // You would typically send this to your backend
        fetch('/api/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Store the user session
                localStorage.setItem('user', JSON.stringify(data.user));
                // Close the modal and update UI
                modal.style.display = 'none';
                updateUIForLoggedInUser(data.user);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    }

    // Initialize Apple Sign-In
    function initializeAppleSignIn() {
        AppleID.auth.init({
            clientId: '[YOUR_APPLE_CLIENT_ID]',
            scope: 'name email',
            redirectURI: '[YOUR_REDIRECT_URI]',
            state: '[STATE]',
            usePopup: true
        });
    }

    // Handle Apple Sign-In
    function handleAppleSignIn(event) {
        event.preventDefault();
        
        AppleID.auth.signIn()
            .then(response => {
                // Send the authorization code to your server
                fetch('/api/auth/apple', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(response)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Store the user session
                        localStorage.setItem('user', JSON.stringify(data.user));
                        // Close the modal and update UI
                        modal.style.display = 'none';
                        updateUIForLoggedInUser(data.user);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Login failed. Please try again.');
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            });
    }

    // Update UI for logged-in user
    function updateUIForLoggedInUser(user) {
        const navRight = document.querySelector('.nav-right');
        navRight.innerHTML = `
            <div class="user-menu">
                <img src="${user.picture || '/assets/images/placeholder-avatar.jpg'}" alt="Profile" class="user-avatar">
                <span class="user-name">${user.name}</span>
                <button class="logout-btn">Log out</button>
            </div>
        `;

        // Add logout functionality
        const logoutBtn = document.querySelector('.logout-btn');
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Handle logout
    function handleLogout() {
        localStorage.removeItem('user');
        location.reload();
    }

    // Login Modal Functionality
    const loginBtn = document.querySelector('.login-btn');
    const modal = document.getElementById('loginModal');
    const closeModal = document.querySelector('.close-modal');
    const signupLink = document.querySelector('.signup-link');

    loginBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Social Login Buttons
    const googleLogin = document.querySelector('.social-login.google');
    const appleLogin = document.querySelector('.social-login.apple');

    googleLogin.addEventListener('click', function() {
        google.accounts.id.prompt();
    });

    appleLogin.addEventListener('click', handleAppleSignIn);

    // Email Login Form
    const emailLoginForm = document.querySelector('.email-login');
    emailLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        // Send credentials to your server
        fetch('/api/auth/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                modal.style.display = 'none';
                updateUIForLoggedInUser(data.user);
            } else {
                alert('Invalid credentials');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    });

    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateUIForLoggedInUser(user);
    }

    // Initialize sign-in providers
    initializeGoogleSignIn();
    initializeAppleSignIn();

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar i');

    searchIcon.addEventListener('click', function() {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    function performSearch(query) {
        if (query.trim()) {
            console.log('Searching for:', query);
            // Add your search functionality here
        }
    }

    // Signup button functionality
    const signupBtn = document.querySelector('.signup-btn');
    signupBtn.addEventListener('click', function() {
        console.log('Signup clicked');
        // Add your signup functionality here
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.news-card, .analysis-card, .index-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // StockData.org API configuration
    const BASE_URL = 'http://localhost:5000/api';

    // Debug function to check if elements exist
    function checkElements() {
        console.log('Checking for required HTML elements...');
        const elements = {
            'dowChart': document.getElementById('dowChart'),
            'spxChart': document.getElementById('spxChart'),
            'nasdaqChart': document.getElementById('nasdaqChart'),
            'topGainers': document.getElementById('topGainers'),
            'topLosers': document.getElementById('topLosers')
        };

        for (const [id, element] of Object.entries(elements)) {
            console.log(`${id} exists:`, !!element);
        }

        // Check for index cards
        const symbols = ['^DJI', '^GSPC', '^IXIC'];
        symbols.forEach(symbol => {
            const card = document.querySelector(`.index-card:has(h3:contains('${symbol}'))`);
            console.log(`Card for ${symbol} exists:`, !!card);
        });
    }

    // Loading state management
    function setLoading(element, isLoading) {
        if (!element) {
            console.error('Element not found for loading state');
            return;
        }
        if (isLoading) {
            element.innerHTML = '<div class="loading">Loading...</div>';
        }
    }

    // Create Chart.js chart
    function createChart(containerId) {
        console.log(`Creating chart for ${containerId}`);
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return null;
        }

        try {
            const ctx = container.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Price',
                        data: [],
                        borderColor: '#1a73e8',
                        backgroundColor: 'rgba(26, 115, 232, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `$${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 0,
                                autoSkip: true,
                                maxTicksLimit: 6
                            }
                        },
                        y: {
                            grid: {
                                color: '#f0f0f0'
                            },
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(0);
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });

            return chart;
        } catch (error) {
            console.error(`Error creating chart for ${containerId}:`, error);
            return null;
        }
    }

    // Generate fake market data
    function generateFakeMarketData(symbol) {
        const basePrice = {
            '^DJI': 38500,
            '^GSPC': 5100,
            '^IXIC': 16000
        }[symbol] || 100;

        const change = (Math.random() - 0.5) * (basePrice * 0.02); // Random change between -1% and +1%
        const price = basePrice + change;
        const changePercent = (change / basePrice) * 100;

        return {
            price: price,
            change: change,
            changePercent: changePercent
        };
    }

    // Generate fake historical data
    function generateFakeHistoricalData(symbol) {
        const basePrice = {
            '^DJI': 38500,
            '^GSPC': 5100,
            '^IXIC': 16000
        }[symbol] || 100;

        const data = [];
        const now = new Date();
        const points = 100; // Number of data points

        for (let i = points - 1; i >= 0; i--) {
            const time = new Date(now - i * 5 * 60000); // 5-minute intervals
            const randomChange = (Math.random() - 0.5) * (basePrice * 0.001); // Small random change
            const price = basePrice + randomChange + (i * (Math.random() - 0.5) * 2); // Add some trend

            data.push({
                date: time.toISOString(),
                open: price - (Math.random() * 10),
                high: price + (Math.random() * 10),
                low: price - (Math.random() * 10),
                close: price,
                volume: Math.floor(Math.random() * 1000000)
            });
        }

        return { data };
    }

    // Generate fake market movers
    function generateFakeMarketMovers() {
        const stocks = [
            { symbol: 'AAPL', name: 'Apple Inc.' },
            { symbol: 'MSFT', name: 'Microsoft Corporation' },
            { symbol: 'GOOGL', name: 'Alphabet Inc.' },
            { symbol: 'AMZN', name: 'Amazon.com Inc.' },
            { symbol: 'META', name: 'Meta Platforms Inc.' },
            { symbol: 'TSLA', name: 'Tesla Inc.' },
            { symbol: 'NVDA', name: 'NVIDIA Corporation' },
            { symbol: 'AMD', name: 'Advanced Micro Devices' },
            { symbol: 'INTC', name: 'Intel Corporation' },
            { symbol: 'NFLX', name: 'Netflix Inc.' }
        ];

        return stocks.map(stock => {
            const basePrice = Math.random() * 1000 + 50;
            const changePercent = (Math.random() - 0.5) * 10; // Random change between -5% and +5%
            const change = (basePrice * changePercent) / 100;
            const price = basePrice + change;

            return {
                symbol: stock.symbol,
                name: stock.name,
                price: price,
                change: change,
                changePercent: changePercent
            };
        }).sort((a, b) => b.changePercent - a.changePercent);
    }

    // Fetch market data
    async function fetchMarketData(symbol) {
        return generateFakeMarketData(symbol);
    }

    // Fetch historical data for charts
    async function fetchHistoricalData(symbol) {
        return generateFakeHistoricalData(symbol);
    }

    // Update market data display
    function updateMarketData(symbol, data) {
        console.log(`Updating market data display for ${symbol}:`, data);
        const card = document.querySelector(`.index-card:has(h3:contains('${symbol}'))`);
        if (!card) {
            console.error(`Card for ${symbol} not found`);
            return;
        }
        if (!data) {
            console.error(`No data to update for ${symbol}`);
            const priceElement = card.querySelector('.price');
            const changeElement = card.querySelector('.change');
            if (priceElement) priceElement.textContent = 'Error loading data';
            if (changeElement) changeElement.textContent = 'Please try again';
            return;
        }

        const price = parseFloat(data.price).toFixed(2);
        const change = parseFloat(data.change).toFixed(2);
        const changePercent = parseFloat(data.changePercent).toFixed(2);

        const priceElement = card.querySelector('.price');
        const changeElement = card.querySelector('.change');

        if (priceElement && changeElement) {
            priceElement.textContent = `$${price}`;
            changeElement.textContent = `${change >= 0 ? '+' : ''}${change} (${changePercent}%)`;
            changeElement.className = `change ${change >= 0 ? 'positive' : 'negative'}`;
        } else {
            console.error(`Price or change elements not found for ${symbol}`);
        }
    }

    // Update chart with historical data
    function updateChart(chart, data) {
        if (!chart) {
            console.error('Chart is null');
            return;
        }
        if (!data || !data.data || data.data.length === 0) {
            console.error('No data to update chart');
            return;
        }

        console.log('Updating chart with data:', data);
        try {
            // Sort data by time
            const sortedData = data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Prepare chart data
            const labels = sortedData.map(item => {
                const date = new Date(item.date);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            });
            
            const prices = sortedData.map(item => parseFloat(item.close));

            // Update chart
            chart.data.labels = labels;
            chart.data.datasets[0].data = prices;
            
            // Update y-axis scale
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const padding = (maxPrice - minPrice) * 0.1;
            
            chart.options.scales.y.min = minPrice - padding;
            chart.options.scales.y.max = maxPrice + padding;
            
            chart.update('none'); // Update without animation for better performance
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    }

    // Fetch and update top gainers and losers
    async function updateMarketMovers() {
        console.log('Fetching market movers');
        const gainersContainer = document.getElementById('topGainers');
        const losersContainer = document.getElementById('topLosers');
        
        if (gainersContainer) setLoading(gainersContainer, true);
        if (losersContainer) setLoading(losersContainer, true);

        try {
            const movers = generateFakeMarketMovers();

            // Update top gainers
            if (gainersContainer) {
                gainersContainer.innerHTML = movers.slice(0, 5).map(stock => {
                    return `
                        <div class="mover-card">
                            <div class="mover-info">
                                <div class="mover-symbol">${stock.symbol}</div>
                                <div class="mover-name">${stock.name}</div>
                            </div>
                            <div class="mover-price">
                                <div class="mover-value">$${parseFloat(stock.price).toFixed(2)}</div>
                                <div class="mover-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}">
                                    ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            // Update top losers
            if (losersContainer) {
                losersContainer.innerHTML = movers.slice(-5).reverse().map(stock => {
                    return `
                        <div class="mover-card">
                            <div class="mover-info">
                                <div class="mover-symbol">${stock.symbol}</div>
                                <div class="mover-name">${stock.name}</div>
                            </div>
                            <div class="mover-price">
                                <div class="mover-value">$${parseFloat(stock.price).toFixed(2)}</div>
                                <div class="mover-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}">
                                    ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('Error updating market movers:', error);
            if (gainersContainer) gainersContainer.innerHTML = '<div class="error">Error loading data</div>';
            if (losersContainer) losersContainer.innerHTML = '<div class="error">Error loading data</div>';
        }
    }

    // Initialize market data
    async function initializeMarketData() {
        console.log('Initializing market data');
        checkElements(); // Check if all required elements exist

        const symbols = {
            dow: '^DJI',
            spx: '^GSPC',
            nasdaq: '^IXIC'
        };

        // Initialize charts first
        const charts = {
            dow: createChart('dowChart'),
            spx: createChart('spxChart'),
            nasdaq: createChart('nasdaqChart')
        };

        // Update data for each symbol
        for (const [key, symbol] of Object.entries(symbols)) {
            console.log(`Processing ${symbol}`);
            const card = document.querySelector(`.index-card:has(h3:contains('${symbol}'))`);
            if (card) {
                setLoading(card, true);
            }

            // Get and update market data
            const marketData = await fetchMarketData(symbol);
            updateMarketData(symbol, marketData);

            // Get and update historical data
            const historicalData = await fetchHistoricalData(symbol);
            if (charts[key]) {
                updateChart(charts[key], historicalData);
            } else {
                console.error(`Chart for ${key} not found`);
            }
        }

        // Update market movers
        await updateMarketMovers();
    }

    // Add CSS for loading and error states
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        .error {
            text-align: center;
            padding: 20px;
            color: #dc3545;
        }
    `;
    document.head.appendChild(style);

    // Start the market data updates
    console.log('Starting market data initialization');
    initializeMarketData();
    setInterval(initializeMarketData, 60000); // Update every minute

    // Handle window resize
    window.addEventListener('resize', () => {
        Object.values(charts).forEach(({ chart }) => {
            if (chart) {
                chart.applyOptions({
                    width: chart.chartElement.clientWidth
                });
            }
        });
    });
}); 