function generateBill() {
    let name = document.getElementById("renter-name").value;
    let rent = parseFloat(document.getElementById("monthly-rent").value) || 0;
    let prevReading = parseFloat(document.getElementById("previous-reading").value) || 0;
    let currReading = parseFloat(document.getElementById("current-reading").value) || 0;
    let rate = parseFloat(document.getElementById("rate-per-unit").value) || 0;
    let dues = parseFloat(document.getElementById("previous-dues").value) || 0;

    // Validation checks
    if (!name || rent <= 0 || prevReading < 0 || currReading < 0 || rate <= 0) {
        alert("Please fill all required fields correctly!");
        return;
    }
    
    if (currReading < prevReading) {
        alert("Current reading cannot be less than previous reading.");
        return;
    }

    let unitsConsumed = currReading - prevReading;
    let electricityBill = unitsConsumed * rate;
    let total = rent + electricityBill + dues;
    let date = new Date().toLocaleDateString();

    // Display values in the bill
    document.getElementById("bill-name").innerText = name;
    document.getElementById("bill-rent").innerText = rent.toFixed(2);
    document.getElementById("bill-electricity").innerText = electricityBill.toFixed(2);
    document.getElementById("bill-units").innerText = unitsConsumed;
    document.getElementById("bill-dues").innerText = dues.toFixed(2);
    document.getElementById("bill-total").innerText = total.toFixed(2);
    document.getElementById("bill-date").innerText = date;
    document.getElementById("bill-previous-reading").innerText = prevReading;
    document.getElementById("bill-current-reading").innerText = currReading;

    document.getElementById("bill").style.display = "block";

    let billData = { name, rent, electricityBill, unitsConsumed, prevReading, currReading, dues, total, date };

    saveBillHistory(billData);
}

function saveBillHistory(bill) {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];
    history.push(bill);
    localStorage.setItem("billHistory", JSON.stringify(history));
    loadBillHistory();
}

function loadBillHistory() {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];
    let historyList = document.getElementById("bill-history");

    historyList.innerHTML = "";
    history.forEach((bill, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            <b>${bill.name}</b> - ₹${bill.total.toFixed(2)} (${bill.date}) 
            <button class="delete-btn" onclick="deleteBill(${index})">🗑 Delete</button>
        `;
        historyList.appendChild(li);
    });

    if (history.length === 0) {
        historyList.innerHTML = "<li>No bills generated yet.</li>";
    }
}

function deleteBill(index) {
    let history = JSON.parse(localStorage.getItem("billHistory")) || [];
    history.splice(index, 1);
    localStorage.setItem("billHistory", JSON.stringify(history));
    loadBillHistory();
}

function downloadBill() {
    html2canvas(document.getElementById("bill")).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "rent-bill.png";
        link.click();
    });
}

function sendWhatsApp() {
    let name = document.getElementById("bill-name").innerText;
    let total = document.getElementById("bill-total").innerText;
    let prevReading = document.getElementById("bill-previous-reading").innerText;
    let currReading = document.getElementById("bill-current-reading").innerText;
    let unitsConsumed = document.getElementById("bill-units").innerText;
    let rent = document.getElementById("bill-rent").innerText;
    let electricityBill = document.getElementById("bill-electricity").innerText;
    let dues = document.getElementById("bill-dues").innerText;
    
    let message = `🏠 *Parwati Niwas Rent Bill*\n👤 *Renter:* ${name}\n📅 *Date:* ${new Date().toLocaleDateString()}\n\n💰 *Monthly Rent:* ₹${rent}\n⚡ *Electricity Bill:* ₹${electricityBill}\n📊 *Previous Reading:* ${prevReading} kWh\n📊 *Current Reading:* ${currReading} kWh\n⚡ *Units Consumed:* ${unitsConsumed} kWh\n📄 *Previous Dues:* ₹${dues}\n🛑 *Total Amount:* ₹${total}\n\n✅ *Scan the QR code to pay.*\nThank you!`;

    let url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// Load bill history on page load
window.onload = loadBillHistory;