let chains = [];
let chainIdCounter = 1;

const form = document.getElementById("chainForm");
const tableBody = document.getElementById("tableBody");
const filterGroup = document.getElementById("filterGroup");
const totalChains = document.getElementById("totalChains");
const totalGroups = document.getElementById("totalGroups");
const latestAdded = document.getElementById("latestAdded");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const companyName = document.getElementById("companyName").value.trim();
  const gstnNo = document.getElementById("gstnNo").value.trim();
  const groupName = document.getElementById("groupName").value;

  if (!companyName || !gstnNo || !groupName) {
    alert("Please fill in all fields.");
    return;
  }

  const duplicateGST = chains.find(
    (chain) => chain.gstnNo === gstnNo && chain.isActive
  );

  if (duplicateGST) {
    alert("Duplicate GSTN Number not allowed.");
    return;
  }

  chains.push({
    chainId: chainIdCounter++,
    companyName,
    gstnNo,
    groupName,
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  renderTable();
  form.reset();
});

function renderTable() {
  tableBody.innerHTML = "";

  const selectedGroup = filterGroup.value;

  const activeChains = chains.filter((chain) => chain.isActive);
  const filteredChains = activeChains.filter(
    (chain) => selectedGroup === "All" || chain.groupName === selectedGroup
  );

  filteredChains.forEach((chain) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${chain.chainId}</td>
      <td>${chain.companyName}</td>
      <td>${chain.gstnNo}</td>
      <td>${chain.groupName}</td>
      <td><span class="status-pill status-active">Active</span></td>
      <td>
        <div class="action-group">
          <button class="action-btn edit" onclick="editChain(${chain.chainId})">Edit</button>
          <button class="action-btn delete" onclick="deleteChain(${chain.chainId})">Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });

  updateSummary(activeChains);
}

function updateSummary(activeChains) {
  totalChains.textContent = activeChains.length;
  totalGroups.textContent = new Set(activeChains.map((chain) => chain.groupName)).size;

  if (activeChains.length > 0) {
    const latest = activeChains[activeChains.length - 1];
    latestAdded.textContent = `${latest.companyName}`;
  } else {
    latestAdded.textContent = "—";
  }
}

function editChain(id) {
  const chain = chains.find((item) => item.chainId === id);
  if (!chain) {
    return;
  }

  const newName = prompt("Enter new company name:", chain.companyName);
  const newGST = prompt("Enter new GSTN number:", chain.gstnNo);

  if (newName && newGST) {
    chain.companyName = newName.trim();
    chain.gstnNo = newGST.trim();
    renderTable();
  }
}

function deleteChain(id) {
  const chain = chains.find((item) => item.chainId === id);
  if (!chain) {
    return;
  }

  if (confirm("Permanently remove this record?")) {
    chain.isActive = false;
    renderTable();
  }
}

filterGroup.addEventListener("change", renderTable);

renderTable();