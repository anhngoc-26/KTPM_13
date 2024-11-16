const serverUrl = 'http://localhost:4000/car'; 

async function fetchData(url) {
    try {
        const response = await fetch(url,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function loadCars() {
    try {
        const cars = await fetchData(serverUrl);
        console.log('Received cars data:', cars);

        const tableBody = document.getElementById('car-table-body');
        tableBody.innerHTML = ''; // Clear existing content

        cars.forEach((car, index) => {
            const row = document.createElement('tr');
            
            //Fixing
            row.setAttribute('data-car-id', car._id || ''); // Thêm custom attribute lưu ID xe
            
            // Thêm sự kiện click cho hàng
            row.addEventListener('click', () => showCarDetails(`${car._id}`));
            
            // Bang CAR
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${car._id || ''}</td>
                <td>${car.name || ''}</td>
                <td>${car.pictureURL ? `<img src="${car.pictureURL}" alt="${car.name}">` : 'No image'}</td>
                <td>
                    <button onclick="confirmDelete('${car._id}')" style="border: none; background: none; cursor: pointer;">
                        <ion-icon name="trash-outline" style="color: red; font-size: 20px;"></ion-icon>
                    </button>
                </td>
                <td>
                    <button style="border: none; background: none; cursor: pointer;">
                        <ion-icon name="create-outline" style="color: blue; font-size: 20px;"></ion-icon>
                    </button>
                </td>
            `;
           
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading cars:', error);
        const tableBody = document.getElementById('car-table-body');
        tableBody.innerHTML = '<tr><td colspan="4">Error loading data</td></tr>';
    }
}
async function loadBanks() {
    try {
        const cars = await fetchData('http://localhost:4000/rate',{
            headers: {'Authorization': `Bearer ${localStorage.getItem('adminToken')}`},
        }); // Fetch bank data
        console.log('Received bank data:', cars);

        const tableBody = document.getElementById('car-table-body');
        tableBody.innerHTML = ''; // Clear existing content

        cars.forEach((bank, index) => {
            const row = document.createElement('tr');
            row.setAttribute('data-bank-name', bank.BankName || ''); // Custom attribute to store bank name
            // You can add a click event if needed
            row.addEventListener('click', () => showBankDetails(`${bank.BankName}`)); // Function to show bank details
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${bank._id || ''}</td>
                <td>${bank.BankName || ''}</td>
                <td>${bank.MaxPercent || ''}</td>
                <td>${bank.MaxTerm || ''}</td>
                <td>${bank.Rate || ''}</td>
                <td>
                    <button onclick="confirmDeleteBank('${bank._id}')" style="border: none; background: none; cursor: pointer;">
                        <ion-icon name="trash-outline" style="color: red; font-size: 20px;"></ion-icon>
                    </button>
                </td>
                <td>
                    <button onclick="confirmEditBank('car', '{{carId}}')" style="border: none; background: none; cursor: pointer;">
                        <ion-icon name="create-outline" style="color: blue; font-size: 20px;"></ion-icon>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading bank data:', error);
        const tableBody = document.getElementById('car-table-body');s
        tableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
    }
}

function loadTemplate(templateId) {
    const template = document.getElementById(templateId);
    const content = document.getElementById('content');
    content.innerHTML = template.innerHTML;
}

// Load data when the page is ready
document.addEventListener('DOMContentLoaded', function () {
    loadCars(); // Load car data if Dashboard is the default view
});


async function showCarDetails(carId) {
    try {
        const response = await fetch(`http://localhost:4000/carVer/Car/${carId}`, { 
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const carVersions = await response.json();

        if (!carVersions || carVersions.length === 0) {
            throw new Error('No versions found for this car');
        }

        // Tạo bảng với các hàng động và các phiên bản là các cột
        let tableHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal()">&times;</span>
                <table>                
                    <tbody>
                        <tr>
                        <td> Tên phiên bản</td> 
                            ${carVersions.map(version => `<td>${version.verName || 'Không có tên phiên bản'}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Pin</td>
                            ${carVersions.map(version => `<td>${version.isBaterry ? 'Kèm pin' : 'Không kèm pin'}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Giá</td>
                            ${carVersions.map(version => `<td data-price="${version.price}">${version.price} Triệu</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Tốc độ tăng tốc</td>
                            ${carVersions.map(version => `<td>${version.acceleration} giây</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Dung lượng pin</td>
                            ${carVersions.map(version => `<td>${version.battery || 'N/A'} kWh</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Kích thước</td>
                            ${carVersions.map(version => `
                                <td>
                                    Chiều cao: ${version.height || 'N/A'} mm<br>
                                    Chiều dài: ${version.length || 'N/A'} mm<br>
                                    Chiều rộng: ${version.width || 'N/A'} mm
                                </td>
                            `).join('')}
                        </tr>
                        <tr>
                            <td>Trọng lượng</td>
                            ${carVersions.map(version => `<td>${version.weight || 'N/A'} kg</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Số chỗ ngồi</td>
                            ${carVersions.map(version => `<td>${version.seatsNumber || 'N/A'}</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Cự ly</td>
                            ${carVersions.map(version => `<td>${version.dist || 'N/A'} km</td>`).join('')}
                        </tr>
                        <tr>
                            <td>Công suất tối đa</td>
                            ${carVersions.map(version => `<td>${version.maxPower || 'N/A'} mã lực</td>`).join('')}
                        </tr>
                    </tbody>
                </table>
            </div>
        `;

        // Hiển thị nội dung trong modal
        const modal = document.getElementById('car-details');
        modal.innerHTML = tableHTML;
        modal.style.display = 'flex'; 
    } catch (error) {
        console.error('Error loading car details:', error);
        const modal = document.getElementById('car-details');
        modal.innerHTML = '<div class="modal-content">Error loading car details</div>';
        modal.style.display = 'flex'; 
    }
}

function closeModal() {
    const modal = document.getElementById('car-details');
    modal.style.display = 'none';
}
function closeModal() {
    const modal = document.getElementById('car-details');
    modal.style.display = 'none';
}

let ascendingBank = true; // To track the sort order for Bank Name
let ascendingCar = true;  // To track the sort order for Car Name
function sortBankTable() {
    const tableBody = document.getElementById('car-table-body');
    const rows = Array.from(tableBody.getElementsByTagName('tr')); // Get rows as an array
    const bankSortIcon = document.getElementById('bank-sort-icon');

    // Sort rows based on the Bank Name (third column)
    rows.sort((a, b) => {
        const bankNameA = a.getElementsByTagName('td')[2].textContent.toLowerCase();
        const bankNameB = b.getElementsByTagName('td')[2].textContent.toLowerCase();

        if (bankNameA < bankNameB) {
            return ascendingBank ? -1 : 1;
        }
        if (bankNameA > bankNameB) {
            return ascendingBank ? 1 : -1;
        }
        return 0;
    });

    // Clear existing table body
    tableBody.innerHTML = '';

    // Append sorted rows back to the table
    rows.forEach(row => tableBody.appendChild(row));

    // Recalculate STT (serial number) based on the new order
    updateSerialNumbers(tableBody);

    // Toggle sorting order
    ascendingBank = !ascendingBank;

    // Update the sort icon based on the order
    bankSortIcon.innerHTML = ascendingBank ? '&#x21C5;' : '&#x21C7;'; // Up and down arrow icons
}
function sortBankTableRate() {
    const tableBody = document.getElementById('car-table-body');
    const rows = Array.from(tableBody.getElementsByTagName('tr'));
    const rateSortIcon = document.getElementById('rate-sort-icon');

    // Sort rows based on the Rate (assuming it's in column 4)
    rows.sort((a, b) => {
        // Get rate values and convert to numbers
        const rateA = parseFloat(a.getElementsByTagName('td')[5].textContent.replace('%', '').trim());
        const rateB = parseFloat(b.getElementsByTagName('td')[5].textContent.replace('%', '').trim());

        // Handle cases where rate might be invalid
        if (isNaN(rateA)) return 1;
        if (isNaN(rateB)) return -1;
        if (isNaN(rateA) && isNaN(rateB)) return 0;

        // Sort based on ascending/descending order
        return ascendingRate ? rateA - rateB : rateB - rateA;
    });

    // Clear existing table body
    tableBody.innerHTML = '';

    // Append sorted rows back to the table
    rows.forEach(row => tableBody.appendChild(row));

    // Recalculate serial numbers
    updateSerialNumbers(tableBody);

    // Toggle sorting order
    ascendingRate = !ascendingRate;

    // Update sort icon with more visible arrows
    rateSortIcon.innerHTML = ascendingRate ? '↑' : '↓';
}

// Helper function to update serial numbers
function updateSerialNumbers(tableBody) {
    const rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const sttCell = rows[i].getElementsByTagName('td')[0];
        if (sttCell) {
            sttCell.textContent = i + 1;
        }
    }
}

// Initialize the sorting state
let ascendingRate = true;


function sortCarTable() {
    const tableBody = document.getElementById('car-table-body');
    const rows = Array.from(tableBody.getElementsByTagName('tr')); // Get rows as an array
    const carSortIcon = document.getElementById('car-sort-icon');

    // Sort rows based on the Car Name (fifth column)
    rows.sort((a, b) => {
        const carNameA = a.getElementsByTagName('td')[5].textContent.toLowerCase(); // Assuming the Car Name is in the 5th column
        const carNameB = b.getElementsByTagName('td')[5].textContent.toLowerCase();

        if (carNameA < carNameB) {
            return ascendingCar ? -1 : 1;
        }
        if (carNameA > carNameB) {
            return ascendingCar ? 1 : -1;
        }
        return 0;
    });

    // Clear existing table body
    tableBody.innerHTML = '';

    // Append sorted rows back to the table
    rows.forEach(row => tableBody.appendChild(row));

    // Recalculate STT (serial number) based on the new order
    updateSerialNumbers(tableBody);

    // Toggle sorting order
    ascendingCar = !ascendingCar;

    // Update the sort icon based on the order
    carSortIcon.innerHTML = ascendingCar ? '&#x21C5;' : '&#x21C7;'; // Up and down arrow icons
}

// Function to update serial numbers (STT)
function updateSerialNumbers(tableBody) {
    const rows = tableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const sttCell = rows[i].getElementsByTagName('td')[0]; // STT is in the first column
        if (sttCell) {
            sttCell.textContent = i + 1; // Update STT with the new index
        }
    }
}
// Function to filter cars based on the input in the search box
function filterCarsAndBanks() {
    const searchBox = document.getElementById('search-box');
    const filter = searchBox.value.toLowerCase(); // Get the search term in lowercase
    const tableBody = document.getElementById('car-table-body');
    const rows = Array.from(tableBody.getElementsByTagName('tr')); // Get all rows

    // Show all rows or filter based on the search term
    rows.forEach(row => {
        const bankName = row.getElementsByTagName('td')[2].textContent.toLowerCase(); // Assuming Bank Name is in the 3rd column
        const carName = row.getElementsByTagName('td')[2].textContent.toLowerCase(); // Assuming Car Name is in the 5th column

        // Check if either the bank name or car name contains the search term
        if (bankName.includes(filter) || carName.includes(filter)) {
            row.style.display = ''; // Show the row if it matches
        } else {
            row.style.display = 'none'; // Hide the row if it doesn't match
        }
    });

    // Update the STT after filtering
    updateSerialNumbers(tableBody);
}

// Function to update serial numbers (STT)
function updateSerialNumbers(tableBody) {
    const rows = tableBody.getElementsByTagName('tr');
    let count = 1; // Initialize serial number
    for (let i = 0; i < rows.length; i++) {
        const sttCell = rows[i].getElementsByTagName('td')[0]; // STT is in the first column
        if (sttCell && rows[i].style.display !== 'none') { // Only update STT for visible rows
            sttCell.textContent = count++; // Update STT with the new index
        }
    }
}


// Hàm xóa car id
async function confirmDelete(carId) {
    console.log("Car ID received for deletion:", carId); // Log ID nhận được
    const userConfirmed = confirm("Bạn có chắc chắn muốn xóa xe này không?");
    if (userConfirmed) {
        try {
            const response = await fetch(`http://localhost:4000/car/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                }
            });
            const result = await response.json();

            console.log(response); // Log phản hồi từ server
            console.log(result); // Log kết quả JSON

            if (response.ok) {
                alert("Xe đã được xóa thành công");
                document.getElementById(`car-${carId}`).remove();
            } else {
                alert(`Lỗi khi xóa xe: ${result.message}`);
            }
        } catch (error) {
            console.error("Error deleting car:", error);
            //alert("Đã xảy ra lỗi khi xóa xe.");
        }
    }
}

// hàm xóa bank theo id 
async function confirmDeleteBank(bankID) {
    //console.log("Car ID received for deletion:", carId); // Log ID nhận được
    const userConfirmed = confirm("Bạn có chắc chắn muốn xóa ngân hàng này không?");
    if (userConfirmed) {
        try {
            const response = await fetch(`http://localhost:4000/rate/${bankID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                }
            });
            const result = await response.json();

            console.log(response); // Log phản hồi từ server
            console.log(result); // Log kết quả JSON

            if (response.ok) {
                alert("Ngân hàng đã được xóa thành công");
                document.getElementById(`rate-${bankID}`).remove();
            } else {
                alert(`Lỗi khi xóa ngân hàng: ${result.message}`);
            }
        } catch (error) {
            console.error("Error deleting bank:", error);
            //alert("Đã xảy ra lỗi khi xóa xe.");
        }
    }
}


