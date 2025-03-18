function generateBill() {
    let name = document.getElementById("renter-name").value;
    let rent = document.getElementById("monthly-rent").value;
    let prevReading = document.getElementById("previous-reading").value;
    let currReading = document.getElementById("current-reading").value;
    let rate = document.getElementById("rate-per-unit").value;
    let dues = document.getElementById("previous-dues").value || 0; // Default to 0 if empty

    if (!name || !rent || !prevReading || !currReading || !rate) {
        alert("Please fill all required fields!");
        return;
    }

    prevReading = parseFloat(prevReading);
    currReading = parseFloat(currReading);
    rate = parseFloat(rate);
    rent = parseInt(rent);
    dues = parseInt(dues);

    let unitsConsumed = currReading - prevReading;
    let electricityBill = unitsConsumed * rate;
    let total = rent + electricityBill + dues;
    let date = new Date().toLocaleDateString();

    // Display values in the bill
    document.getElementById("bill-name").innerText = name;
    document.getElementById("bill-rent").innerText = rent;
    document.getElementById("bill-electricity").innerText = electricityBill.toFixed(2);
    document.getElementById("bill-units").innerText = unitsConsumed;
    document.getElementById("bill-dues").innerText = dues;
    document.getElementById("bill-total").innerText = total;
    document.getElementById("bill-date").innerText = date;
    document.getElementById("bill-prev-reading").innerText = prevReading;
    document.getElementById("bill-curr-reading").innerText = currReading;

    document.getElementById("bill").style.display = "block";

    let billData = {
        name, rent, electricityBill, unitsConsumed, prevReading, currReading, dues, total, date
    };

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
            <b>${bill.name}</b> - ₹${bill.total} (${bill.date}) 
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
    let prevReading = document.getElementById("bill-prev-reading").innerText;
    let currReading = document.getElementById("bill-curr-reading").innerText;
    let unitsConsumed = document.getElementById("bill-units").innerText;
    
    let message = `🏠 *Parwati Niwas Rent Bill*\n👤 *Renter:* ${name}\n📅 *Date:* ${new Date().toLocaleDateString()}\n\n💰 *Monthly Rent:* ₹${rent}\n⚡ *Electricity Bill:* ₹${total}\n📊 *Previous Reading:* ${prevReading} kWh\n📊 *Current Reading:* ${currReading} kWh\n⚡ *Units Consumed:* ${unitsConsumed} kWh\n📄 *Previous Dues:* ₹${total}\n🛑 *Total Amount:* ₹${total}\n\n✅ *Scan the QR code to pay.*\nThank you!`;

    let url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
}

// Load bill history on page load
window.onload = loadBillHistory;