const firebaseConfig = {
    apiKey: "AIzaSyCetxYahB16d2ik5JTrVZpFZYBsrd48YLU",
    authDomain: "orcaleprm.firebaseapp.com",
    projectId: "orcaleprm",
    storageBucket: "orcaleprm.appspot.com",
    messagingSenderId: "97028714002",
    appId: "1:97028714002:web:943624b95a6ece1f6f72cb",
    measurementId: "G-ZYD8H0TYFJ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const loginForm = document.getElementById('login-form');
const generateForm = document.getElementById('container');
const expiryInfoDiv = document.getElementById('expiry-info'); // New element for expiry info
const countrySelectLogin = document.getElementById('country-select-login');

let currentKeyDoc = null;
let currentDeviceUUID = localStorage.getItem('deviceUUID') || uuid.v4(); // Retrieve or generate device UUID

// Function to show success notification
function showSuccessNotification(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        showConfirmButton: false,
        timer: 2000
    });
}

// Function to show error notification
function showErrorNotification(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        showConfirmButton: false,
        timer: 2000
    });
}

// Populate the country select dropdown
const timezones = {
    'Afghanistan': 'Asia/Kabul',
        'Åland Islands': 'Europe/Mariehamn',
        'Albania': 'Europe/Tirane',
        'Algeria': 'Africa/Algiers',
        'American Samoa': 'Pacific/Pago_Pago',
        'Angola': 'Africa/Luanda',
        'Anguilla': 'America/Anguilla',
        'Antarctica': 'Antarctica/Palmer',
        'Antigua & Barbuda': 'America/Antigua',
        'Argentina': 'America/Argentina/Buenos_Aires',
        'Armenia': 'Asia/Yerevan',
        'Aruba': 'America/Aruba',
        'Azerbaijan': 'Asia/Baku',
        'Bahamas': 'America/Nassau',
        'Bahrain': 'Asia/Bahrain',
        'Bangladesh': 'Asia/Dhaka',
        'Barbados': 'America/Barbados',
        'Belarus': 'Europe/Minsk',
        'Belize': 'America/Belize',
        'Benin': 'Africa/Porto-Novo',
        'Bermuda': 'Atlantic/Bermuda',
        'Bhutan': 'Asia/Thimphu',
        'Bolivia': 'America/La_Paz',
        'Bosnia & Herzegovina': 'Europe/Sarajevo',
        'Botswana': 'Africa/Gaborone',
        'Bouvet Island': 'Africa/South_Dec',
        'Brazil': 'America/Sao_Paulo',
        'British Indian Ocean Territory': 'Indian/Chagos',
        'Brunei': 'Asia/Brunei',
        'Burkina Faso': 'Africa/Ouagadougou',
        'Burundi': 'Africa/Bujumbura',
        'Cambodia': 'Asia/Phnom_Penh',
        'Cameroon': 'Africa/Douala',
        'Cape Verde': 'Atlantic/Cape_Verde',
        'Cayman Islands': 'America/Cayman',
        'Central African Republic': 'Africa/Bangui',
        'Chad': 'Africa/Ndjamena',
        'Chile': 'America/Santiago',
        'China': 'Asia/Shanghai',
        'Christmas Island': 'Australia/Christmas',
        'Cocos (Keeling) Islands': 'Indian/Cocos',
        'Colombia': 'America/Bogota',
        'Comoros': 'Indian/Comoro',
        'Congo - Brazzaville': 'Africa/Brazzaville',
        'Congo - Kinshasa': 'Africa/Kinshasa',
        'Cook Islands': 'Pacific/Rarotonga',
        'Costa Rica': 'America/Costa_Rica',
        'Côte d’Ivoire': 'Africa/Abidjan',
        'Cuba': 'America/Havana',
        'Curaçao': 'America/Curacao',
        'Djibouti': 'Africa/Djibouti',
        'Dominica': 'America/Dominica',
        'Dominican Republic': 'America/Santo_Domingo',
        'Ecuador': 'America/Guayaquil',
        'Egypt': 'Africa/Cairo',
        'El Salvador': 'America/El_Salvador',
        'Equatorial Guinea': 'Africa/Malabo',
        'Eritrea': 'Africa/Asmara',
        'Eswatini': 'Africa/Mbabane',
        'Ethiopia': 'Africa/Addis_Ababa',
        'Falkland Islands': 'Atlantic/Stanley',
        'Faroe Islands': 'Europe/Paris',
        'Fiji': 'Pacific/Fiji',
        'French Guiana': 'America/Cayenne',
        'French Polynesia': 'Pacific/Tahiti',
        'French Southern Territories': 'Indian/Kerguelen',
        'Gabon': 'Africa/Libreville',
        'Gambia': 'Africa/Banjul',
        'Georgia': 'Asia/Tbilisi',
        'Ghana': 'Africa/Accra',
        'Gibraltar': 'Europe/Gibraltar',
        'Greenland': 'America/Godthab',
        'Grenada': 'America/Grenada',
        'Guadeloupe': 'America/Guadeloupe',
        'Guatemala': 'America/Guatemala',
        'Guernsey': 'Europe/Guernsey',
        'Guinea': 'Africa/Conakry',
        'Guinea-Bissau': 'Africa/Bissau',
        'Guyana': 'America/Guyana',
        'Haiti': 'America/Port-au-Prince',
        'Heard & McDonald Islands': 'Antarctica/Heard',
        'Honduras': 'America/Tegucigalpa',
        'Iceland': 'Atlantic/Reykjavik',
        'India': 'Asia/Kolkata',
        'Indonesia': 'Asia/Jakarta',
        'Iran': 'Asia/Tehran',
        'Iraq': 'Asia/Baghdad',
        'Isle of Man': 'Europe/Isle_of_Man',
        'Jamaica': 'America/Jamaica',
        'Jersey': 'Europe/Jersey',
        'Jordan': 'Asia/Amman',
        'Kazakhstan': 'Asia/Almaty',
        'Kenya': 'Africa/Nairobi',
        'Kiribati': 'Pacific/Tarawa',
        'Kuwait': 'Asia/Kuwait',
        'Kyrgyzstan': 'Asia/Bishkek',
        'Laos': 'Asia/Vientiane',
        'Lebanon': 'Asia/Beirut',
        'Lesotho': 'Africa/Maseru',
        'Liberia': 'Africa/Monrovia',
        'Libya': 'Africa/Tripoli',
        'Macao SAR China': 'Asia/Macau',
        'Madagascar': 'Indian/Antananarivo',
        'Malawi': 'Africa/Blantyre',
        'Malaysia': 'Asia/Kuala_Lumpur',
        'Maldives': 'Indian/Maldives',
        'Mali': 'Africa/Bamako',
        'Marshall Islands': 'Pacific/Majuro',
        'Martinique': 'America/Martinique',
        'Mauritania': 'Africa/Nouakchott',
        'Mauritius': 'Indian/Mauritius',
        'Mayotte': 'Indian/Mayotte',
        'Mexico': 'America/Mexico_City',
        'Micronesia': 'Pacific/Palau',
        'Moldova': 'Europe/Chisinau',
        'Monaco': 'Europe/Monaco',
        'Mongolia': 'Asia/Ulaanbaatar',
        'Montenegro': 'Europe/Podgorica',
        'Montserrat': 'America/Montserrat',
        'Morocco': 'Africa/Casablanca',
        'Mozambique': 'Africa/Maputo',
        'Myanmar (Burma)': 'Asia/Yangon',
        'Namibia': 'Africa/Windhoek',
        'Nauru': 'Pacific/Nauru',
        'Nepal': 'Asia/Kathmandu',
        'New Caledonia': 'Pacific/Noumea',
        'Nicaragua': 'America/Managua',
        'Niger': 'Africa/Niamey',
        'Nigeria': 'Africa/Lagos',
        'Niue': 'Pacific/Niue',
        'Norfolk Island': 'Pacific/Norfolk',
        'North Korea': 'Asia/Pyongyang',
        'North Macedonia': 'Europe/Skopje',
        'Oman': 'Asia/Muscat',
        'Pakistan': 'Asia/Karachi',
        'Palau': 'Pacific/Palau',
        'Palestinian Territories': 'Asia/Gaza',
        'Panama': 'America/Panama',
        'Papua New Guinea': 'Pacific/Port_Moresby',
        'Paraguay': 'America/Asuncion',
        'Peru': 'America/Lima',
        'Philippines': 'Asia/Manila',
        'Pitcairn Islands': 'Pacific/Pitcairn',
        'Qatar': 'Asia/Qatar',
        'Réunion': 'Indian/Reunion',
        'Rwanda': 'Africa/Kigali',
        'Samoa': 'Pacific/Apia',
        'São Tomé & Príncipe': 'Africa/Sao_Tome',
        'Saudi Arabia': 'Asia/Riyadh',
        'Senegal': 'Africa/Dakar',
        'Serbia': 'Europe/Belgrade',
        'Seychelles': 'Indian/Mahe',
        'Singapore': 'Asia/Singapore',
        'Sint Maarten': 'America/Philipsburg',
        'Solomon Islands': 'Pacific/Guadalcanal',
        'Somalia': 'Africa/Mogadishu',
        'South Africa': 'Africa/Johannesburg',
        'South Georgia & South Sandwich Islands': 'Atlantic/South_Georgia',
        'South Korea': 'Asia/Seoul',
        'South Sudan': 'Africa/Juba',
        'Sri Lanka': 'Asia/Colombo',
        'St. Barthélemy': 'America/St_Barthelemy',
        'St. Helena': 'Atlantic/St_Helena',
        'St. Kitts & Nevis': 'America/St_Kitts',
        'St. Lucia': 'America/St_Lucia',
        'St. Martin': 'America/Marigot',
        'St. Pierre & Miquelon': 'America/St_Pierre',
        'St. Vincent & Grenadines': 'America/St_Vincent',
        'Sudan': 'Africa/Khartoum',
        'Suriname': 'America/Paramaribo',
        'Svalbard & Jan Mayen': 'Arctic/Longyearbyen',
        'Syria': 'Asia/Damascus',
        'Taiwan': 'Asia/Taipei',
        'Tajikistan': 'Asia/Dushanbe',
        'Tanzania': 'Africa/Dar_es_Salaam',
        'Thailand': 'Asia/Bangkok',
        'Timor-Leste': 'Asia/Dili',
        'Togo': 'Africa/Lome',
        'Tokelau': 'Pacific/Tokelau',
        'Tonga': 'Pacific/Tongatapu',
        'Trinidad & Tobago': 'America/Port_of_Spain',
        'Tunisia': 'Africa/Tunis',
        'Turkey': 'Europe/Istanbul',
        'Turkmenistan': 'Asia/Ashgabat',
        'Turks & Caicos Islands': 'America/Grand_Turk',
        'Tuvalu': 'Pacific/Funafuti',
        'Uganda': 'Africa/Kampala',
        'Ukraine': 'Europe/Kiev',
        'United Arab Emirates': 'Asia/Dubai',
        'Uruguay': 'America/Montevideo',
        'Uzbekistan': 'Asia/Tashkent',
        'Vanuatu': 'Pacific/Efate',
        'Vatican City': 'Europe/Vatican',
        'Venezuela': 'America/Caracas',
        'Vietnam': 'Asia/Ho_Chi_Minh',
        'Wallis & Futuna': 'Pacific/Wallis',
        'Western Sahara': 'Africa/El_Aaiun',
        'Yemen': 'Asia/Aden',
        'Zambia': 'Africa/Lusaka',
        'Zimbabwe': 'Africa/Harare'
};

for (const country in timezones) {
    const option = document.createElement('option');
    option.value = timezones[country];
    option.textContent = country;
    countrySelectLogin.appendChild(option);
}

function login() {
    const accessKey = document.getElementById('access-key').value.trim();
    const selectedTimezone = countrySelectLogin.value;

    if (!selectedTimezone) {
        showErrorNotification('Please select a country.');
        return;
    }

    db.collection('access_keys').doc(accessKey).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            const currentTime = new Date();
            const expiryDate = new Date(data.expiry);

            if (currentTime > expiryDate) {
                showErrorNotification('Access key has expired.');
                return;
            }

            if (data.approved === false) {
                showErrorNotification('Access key is not approved for use.');
                return;
            }

            if (data.deviceUUID && data.deviceUUID !== currentDeviceUUID) {
                showErrorNotification('This access key is already in use on another device.');
                return;
            }

            // Update device UUID if not already set
            if (!data.deviceUUID) {
                db.collection('access_keys').doc(accessKey).update({
                    deviceUUID: currentDeviceUUID
                }).then(() => {
                    console.log('Device UUID updated for access key:', accessKey);
                    localStorage.setItem('deviceUUID', currentDeviceUUID); // Store device UUID in localStorage
                }).catch(error => {
                    console.error('Error updating device UUID:', error);
                });
            }

            currentKeyDoc = doc;
            localStorage.setItem('accessKey', accessKey);
            localStorage.setItem('selectedTimezone', selectedTimezone); // Save selected timezone
            loginForm.style.display = 'none'; // Hide login form
            generateForm.style.display = 'block'; // Show container

            // Display expiry date below the logo
            expiryInfoDiv.textContent = `Exp on ${expiryDate.toLocaleDateString()}`;
        } else {
            showErrorNotification('Invalid access key.');
        }
    }).catch(error => {
        console.error("Error logging in:", error);
    });
}

function logout() {
    loginForm.style.display = 'block'; // Show login form
    generateForm.style.display = 'none'; // Hide container
    expiryInfoDiv.textContent = ''; // Clear expiry info
    localStorage.removeItem('accessKey');
    localStorage.removeItem('selectedTimezone');
    currentKeyDoc = null;
}

function checkLoginStatus() {
    const savedKey = localStorage.getItem('accessKey');
    const savedTimezone = localStorage.getItem('selectedTimezone');

    if (savedKey) {
        db.collection('access_keys').doc(savedKey).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                const currentTime = new Date();
                const expiryDate = new Date(data.expiry);

                if (currentTime > expiryDate) {
                    showErrorNotification('Access key has expired.');
                    logout();
                    return;
                }

                if (data.approved === false) {
                    showErrorNotification('Access key is not approved for use.');
                    logout();
                    return;
                }

                if (data.deviceUUID && data.deviceUUID !== currentDeviceUUID) {
                    showErrorNotification('This access key is already in use on another device.');
                    logout();
                    return;
                }

                // Update device UUID if not already set
                if (!data.deviceUUID) {
                    db.collection('access_keys').doc(savedKey).update({
                        deviceUUID: currentDeviceUUID
                    }).then(() => {
                        console.log('Device UUID updated for access key:', savedKey);
                        localStorage.setItem('deviceUUID', currentDeviceUUID); // Store device UUID in localStorage
                    }).catch(error => {
                        console.error('Error updating device UUID:', error);
                    });
                }

                currentKeyDoc = doc;
                loginForm.style.display = 'none'; // Hide login form
                generateForm.style.display = 'block'; // Show container

                // Set the country select field to the saved timezone
                if (savedTimezone) {
                    countrySelectLogin.value = savedTimezone;
                }

                // Display expiry date below the logo
                expiryInfoDiv.textContent = `Exp on ${expiryDate.toLocaleDateString()}`;
            } else {
                showErrorNotification('Invalid access key.');
                logout();
            }
        }).catch(error => {
            console.error("Error checking login status:", error);
            logout();
        });
    } else {
        loginForm.style.display = 'block'; // Show login form
        generateForm.style.display = 'none'; // Hide container
        expiryInfoDiv.textContent = ''; // Clear expiry info
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Set initial visibility
    loginForm.style.display = 'block'; // Show login form
    generateForm.style.display = 'none'; // Hide container

    // Check login status
    checkLoginStatus();

    const liveMarketButton = document.getElementById('liveMarketButton');
    const otcMarketButton = document.getElementById('otcMarketButton');
    const currencySelect = document.getElementById('currency');
    const currencyInfoDiv = document.getElementById('currency-info');
    const resultDiv = document.getElementById('result');
    const resultCon = document.getElementById('res');
    let lastResultTime = null; // To track the time of the last result

    function setActiveMarketButton(button) {
        liveMarketButton.classList.remove('active');
        liveMarketButton.classList.add('inactive');
        otcMarketButton.classList.remove('active');
        otcMarketButton.classList.add('inactive');

        button.classList.remove('inactive');
        button.classList.add('active');
    }

    function isForexMarketOpen() {
        const now = new Date();
        const day = now.getUTCDay();
        const hours = now.getUTCHours();

        const marketOpenTime = 22; // 10 PM UTC on Sunday
        const marketCloseTime = 22; // 10 PM UTC on Friday

        if (day === 0 && hours >= marketOpenTime) {
            return true; // Sunday after 5 PM EST
        }
        if (day > 0 && day < 5) {
            return true; // Monday to Thursday all day
        }
        if (day === 5 && hours < marketCloseTime) {
            return true; // Friday before 5 PM EST
        }
        return false; // Market is closed
    }

    function getNextMarketOpenTime() {
        const now = new Date();
        let nextOpen = new Date(now);

        if (now.getUTCDay() === 5 && now.getUTCHours() >= 22) {
            nextOpen.setUTCDate(nextOpen.getUTCDate() + 2);
        } else {
            nextOpen.setUTCDate(nextOpen.getUTCDate() + (7 - nextOpen.getUTCDay()));
        }
        nextOpen.setUTCHours(22, 0, 0, 0); // Set time to 10 PM UTC (5 PM EST)
        return nextOpen;
    }

    function updateTimer() {
        const now = new Date();
        const nextOpen = getNextMarketOpenTime();
        const diff = nextOpen - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('timer').textContent = `Market opens in ${hours}h ${minutes}m ${seconds}s`;
    }

    function lockLiveMarket() {
        liveMarketButton.disabled = true;
        currencySelect.disabled = true;
        resultDiv.textContent = '';
        resultDiv.style.display = 'none'; 
        resultCon.style.display = 'none'; // Hide result div
        currencyInfoDiv.textContent = '';
        currencyInfoDiv.textContent = 'Forex live market is closed.';

        const timerDiv = document.createElement('div');
        timerDiv.id = 'timer';
        currencyInfoDiv.appendChild(timerDiv);

        updateTimer();
        setInterval(updateTimer, 1000); // Update timer every second
    }

    function unlockLiveMarket() {
        liveMarketButton.disabled = false;
        currencySelect.disabled = false;
        currencyInfoDiv.textContent = '';
        document.getElementById('timer')?.remove(); // Remove timer if exists
    }

    function selectFirstCurrencyPair() {
        const firstOption = currencySelect.querySelector('option:not([style*="display: none"])');
        if (firstOption) {
            currencySelect.value = firstOption.value;
        }
    }

    function updateCurrencySelection() {
        resultDiv.textContent = '';
        resultDiv.style.display = 'none';
        resultCon.style.display = 'none'; // Hide result div
        currencyInfoDiv.textContent = '';
    }

    function getCurrentMinute() {
        const now = new Date();
        return Math.floor(now.getTime() / 60000); // Get current minute as a number
    }

    function generateResult() {
        const currencies = currencySelect.value;

        if (!currencies) {
            resultDiv.textContent = 'Please select a currency pair.';
            resultDiv.className = '';
            currencyInfoDiv.textContent = ''; // Clear currency info if no selection
            return;
        }

        const currentMinute = getCurrentMinute();

        // Check if the current minute is the same as the last result time
        if (lastResultTime !== null && lastResultTime === currentMinute) {
            Swal.fire({
                title: 'Wait!',
                text: 'Please wait to finish this candle.',
                icon: 'info',
                confirmButtonText: 'OK',
                customClass: {
                    container: 'swal-container',
                    popup: 'swal-popup',
                    title: 'swal-title',
                    content: 'swal-content',
                    confirmButton: 'swal-confirm-button'
                }
            });
            return;
        }

        // Update last result time
        lastResultTime = currentMinute;

        // Get the selected timezone from localStorage
        const selectedTimezone = localStorage.getItem('selectedTimezone') || 'UTC';
        const now = new Date();
        const oneMinuteLater = new Date(now.getTime() + 60000); // Add 60,000 milliseconds (1 minute)
        const twoMinutesLater = new Date(now.getTime() + 120000); // Add 120,000 milliseconds (2 minutes)

        const formatTime = (date) => {
            return date.toLocaleTimeString('en-US', { 
                timeZone: selectedTimezone, 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false // Use 24-hour format
            });
        };


        // Display currency name and new time range (current time + 1 minute to current time + 2 minutes)
        currencyInfoDiv.innerHTML = `${currencies}<br>(${formatTime(oneMinuteLater)} - ${formatTime(twoMinutesLater)})`;

        // Simulate market movement with random probability
        const randomValue = Math.random(); // Random number between 0 and 1
        const randomResult = randomValue < 0.5 ? 'Up' : 'Down';

        // Update the result div with appropriate class and content
        resultDiv.textContent = randomResult; // Set the text to 'Up' or 'Down'
        resultDiv.className = randomResult; // Add the Up or Down class to apply styles
        resultDiv.style.display = 'block'; // Show result div
        resultCon.style.display = 'block'; // Show result container
    }

    liveMarketButton.addEventListener('click', function() {
        if (!isForexMarketOpen()) {
            lockLiveMarket();
        } else {
            unlockLiveMarket();
            setActiveMarketButton(liveMarketButton); // Set Live Market button as active
            document.querySelectorAll('.otc-market').forEach(option => option.style.display = 'none');
            document.querySelectorAll('.live-market').forEach(option => option.style.display = 'block');
            selectFirstCurrencyPair(); // Auto select first currency pair
            updateCurrencySelection(); // Hide old result and info
        }
    });

    otcMarketButton.addEventListener('click', function() {
        unlockLiveMarket();
        setActiveMarketButton(otcMarketButton); // Set OTC Market button as active
        document.querySelectorAll('.live-market').forEach(option => option.style.display = 'none');
        document.querySelectorAll('.otc-market').forEach(option => option.style.display = 'block');
        selectFirstCurrencyPair(); // Auto select first currency pair
        updateCurrencySelection(); // Hide old result and info
    });

    currencySelect.addEventListener('change', function() {
        updateCurrencySelection(); // Hide old result and info
    });

    document.getElementById('generate').addEventListener('click', function() {
        generateResult();
    });

    if (isForexMarketOpen()) {
        liveMarketButton.click();
    } else {
        lockLiveMarket();
    }
});
