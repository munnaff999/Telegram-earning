auth.onAuthStateChanged(async (user) => {
  if (!user) return window.location.href = "index.html";

  const snap = await getDoc(doc(db, "users", user.uid));
  if (!snap.exists() || snap.data().isAdmin !== true) {
    alert("Access denied");
    window.location.href = "dashboard.html";
  }
});
import { auth, db } from './config.js';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Basic Tab System
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// Load Users
onSnapshot(collection(db, "users"), (snapshot) => {
    const list = document.getElementById('admin-users-list');
    list.innerHTML = '';
    snapshot.forEach(uDoc => {
        const user = uDoc.data();
        list.innerHTML += `
            <tr>
                <td>${user.email}</td>
                <td>₹${user.balance}</td>
                <td>
                    <button onclick="editBalance('${uDoc.id}')">Edit</button>
                </td>
            </tr>
        `;
    });
});

// Load Withdrawals
onSnapshot(collection(db, "withdrawals"), (snapshot) => {
    const list = document.getElementById('admin-withdrawals-list');
    list.innerHTML = '';
    snapshot.forEach(wDoc => {
        const w = wDoc.data();
        if(w.status === 'pending') {
            list.innerHTML += `
                <tr>
                    <td>${w.email}</td>
                    <td>₹${w.amount}</td>
                    <td>${w.upi}</td>
                    <td>
                        <button onclick="updateStatus('${wDoc.id}', 'approved')">Approve</button>
                        <button onclick="updateStatus('${wDoc.id}', 'rejected')">Reject</button>
                    </td>
                </tr>
            `;
        }
    });
});

// Global functions for admin actions
window.updateStatus = async (id, status) => {
    await updateDoc(doc(db, "withdrawals", id), { status });
    showToast(`Request ${status}`);
};

window.editBalance = async (uid) => {
    const newBal = prompt("Enter new balance:");
    if(newBal !== null) {
        await updateDoc(doc(db, "users", uid), { balance: parseFloat(newBal) });
    }
};
