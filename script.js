function generateBill() { 
    let name = document.getElementById("renter-name").value;
    let month = document.getElementById("rent-month").value;
    let rent = parseFloat(document.getElementById("monthly-rent").value) || 0;
    let prevReading = parseFloat(document.getElementById("previous-reading").value) || 0;
    let currReading = parseFloat(document.getElementById("current-reading").value) || 0;
    let rate = parseFloat(document.getElementById("rate-per-unit").value) || 0;
    let dues = parseFloat(document.getElementById("previous-dues").value) || 0;

    if (!name || !month || rent <= 0 || prevReading < 0 || currReading < 0 || rate <= 0) {
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

    document.getElementById("bill-name").innerText = name;
    document.getElementById("bill-month").innerText = month;
    document.getElementById("bill-rent").innerText = rent.toFixed(2);
    document.getElementById("bill-electricity").innerText = electricityBill.toFixed(2);
    document.getElementById("bill-units").innerText = unitsConsumed;
    document.getElementById("bill-dues").innerText = dues.toFixed(2);
    document.getElementById("bill-total").innerText = total.toFixed(2);
    document.getElementById("bill-date").innerText = date;
    document.getElementById("bill-previous-reading").innerText = prevReading;
    document.getElementById("bill-current-reading").innerText = currReading;

    document.getElementById("bill").style.display = "block";

    let billData = { name, month, rent, electricityBill, unitsConsumed, prevReading, currReading, dues, total, date };
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
            <b>${bill.name}</b> - ₹${bill.total.toFixed(2)} (${bill.month}) 
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

function downloadBill(callback) {
    html2canvas(document.getElementById("bill")).then(canvas => {
        let link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "rent-bill.png";
        link.click();
        
        if (callback) callback();
    });
}

function sendWhatsApp() {
    let name = document.getElementById("bill-name").innerText;
    let month = document.getElementById("bill-month").innerText;
    let rent = document.getElementById("bill-rent").innerText;
    let prevReading = document.getElementById("bill-previous-reading").innerText;
    let currReading = document.getElementById("bill-current-reading").innerText;
    let unitsConsumed = document.getElementById("bill-units").innerText;
    let electricityBill = document.getElementById("bill-electricity").innerText;
    let dues = document.getElementById("bill-dues").innerText;
    let total = document.getElementById("bill-total").innerText;
    let date = document.getElementById("bill-date").innerText;
    
    let upiId = "6202154340@ptaxis";
    let phoneNumber = "6202154340";
    let upiPaymentLink = `upi://pay?pa=${upiId}&pn=Parwati%20Niwas&mc=&tid=&tr=&tn=Rent%20Payment&am=${total}&cu=INR`;
    
    let message = `🏠 *Parwati Niwas Rent Bill*
👤 *Renter:* ${name}
🗓 *Rent for the Month:* ${month}
📅 *Bill Generated on:* ${date}

💰 *Monthly Rent:* ₹${rent}
⚡ *Electricity Bill:* ₹${electricityBill}
📊 *Previous Reading:* ${prevReading} kWh
📊 *Current Reading:* ${currReading} kWh
⚡ *Units Consumed:* ${unitsConsumed} kWh
📄 *Previous Dues:* ₹${dues}
🛑 *Total Amount:* ₹${total}

✅ *Pay Now:* [Tap to Pay]( ${upiPaymentLink} )
🔹 *UPI ID:* ${upiId}
🔹 *Phone Number:* ${phoneNumber}

Thank you!`;

    downloadBill(() => {
        let whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
    });
}

window.onload = loadBillHistory;