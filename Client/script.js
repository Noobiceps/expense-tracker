

let expenses = [ {id: 1, category: "food", amount: 250, date: "2026-09-10", source: "cash"},
    {id: 2, category: "transport", amount: 200, date: "2026-08-09", source: "bank"},
    {id: 3, category: "entertainment", amount: 150, date: "2026-07-08", source: "cash"}
];
let editingId = null;

const expenseForm = document.getElementById("expense-form");
const filterContainer = document.getElementById("filter-container");
const startDate = document.getElementById("filter-start-date");
const endDate = document.getElementById("filter-end-date");
const expenseList = document.getElementById("expense-list");
const categoryTotal = document.getElementById("category-total");
const dateRange = document.getElementById("date-range");
const chart = document.getElementById("chart");
const category = document.getElementById("category");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const source = document.getElementById("source");
const checkedCheckbox = document.querySelectorAll("#filter-category input[type='checkbox']");
const filterToggle = document.getElementById("filter-toggle");
const resetToggle = document.getElementById("reset-toggle");

function renderExpenses(list) {
    let rows = "";
    list.forEach((expense) => {
        rows += `
                     <tr data-id="${expense.id}">
                       <td>${expense.date}</td>
                       <td>${expense.category}</td>
                       <td>${expense.amount}</td>
                       <td>${expense.source}</td>
                       <td><button class="edit-btn">Edit</button>
                           <button class="delete-btn">Delete</button>
                           </td>
                       </tr>`
    });
   expenseList.innerHTML = rows;
}
function addExpense(newExpense){
    expenses.push(newExpense);
    renderExpenses(expenses);
    renderSummary(calculateTotals(expenses));
    renderChart(calculateTotals(expenses));
}
    renderExpenses(expenses);
    function deleteExpense(id){
        expenses = expenses.filter( e => e.id !== id);
        renderExpenses(expenses);
        renderSummary(calculateTotals(expenses));
        renderChart(calculateTotals(expenses));
    }   
        
     expenseList.addEventListener("click", (e) => {
                if(e.target.classList.contains("delete-btn")){
                    const row = e.target.closest("tr");
                    const id = Number(row.dataset.id);
        const answer = confirm('Are you sure you want to delete this?');
        if(answer){
                    deleteExpense(id);
                }
                return;
            }
            });

function updateExpense(expenseId, change){
    const expense = expenses.find(e => e.id === expenseId);
    Object.assign(expense, change);
    renderExpenses(expenses);
    renderSummary(calculateTotals(expenses));
    renderChart(calculateTotals(expenses));
}

expenseList.addEventListener("click", (e) => {
if(e.target.classList.contains("edit-btn")){
    const row = e.target.closest("tr");
    const id = Number(row.dataset.id);
    const expense = expenses.find(e => e.id === id)
    date.value = expense.date;
   category.value = expense.category;
   amount.value = Number(expense.amount);
   source.value = expense.source;
   editingId = id;
}
});
expenseForm.addEventListener("submit", (e) => {
e.preventDefault();
const formData = new FormData(expenseForm);
const data = Object.fromEntries(formData);
data.amount = Number(data.amount);
if(editingId){
    updateExpense(editingId, data);
    editingId = null;
} else {
    const maxId = Math.max(...expenses.map(e => e.id));
        data.id = maxId + 1;
        addExpense(data);
}
expenseForm.reset();
});
function calculateTotals(list){
    const  total = list.reduce((acc, expense) => {
        
        if(!acc[expense.category]){
            acc[expense.category] = 0;
        } 
            acc[expense.category] += expense.amount;   
        return acc;
    }, {});
    return total;
}
function renderSummary(totals){
    const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
    let rows = "";
    for(const category in totals){
        const percent = (totals[category] / grandTotal ) * 100;
        rows += `<div><span class="cat-name">${category}</span><span class="cat-value">${totals[category]} (${percent.toFixed(1)}%)</span></div>`;
    }
    categoryTotal.innerHTML = rows; 
}

function renderChart(totals){
    const maxValue = Math.max(...Object.values(totals));
    let bars = "";
    for (const category in totals){
      const heightPercent = (totals[category] / maxValue ) * 100;
      bars += `<div class="bar-wrapper">
                <div class="bar" style="height: ${heightPercent}%"></div>
                <span>${category}</span>
                </div>`
    }
    chart.innerHTML = bars; 
}

function applyFilters(){
const start = startDate.value;
const end = endDate.value;
const selectedCategories = [];
checkedCheckbox.forEach(checkbox => {
 if(checkbox.checked){
    selectedCategories.push(checkbox.value);
 }
});
const filtered = expenses.filter(expense => {
            const matchedDate =  (!start || expense.date >= start) && ( !end ||expense.date <= end);   
             const matchedCategory = selectedCategories.length === 0 || selectedCategories.includes(expense.category);
             return matchedDate && matchedCategory;
});             
  renderExpenses(filtered);
  renderSummary(calculateTotals(filtered));
  renderChart(calculateTotals(filtered));
}            

filterToggle.addEventListener("click", () => {
    filterContainer.classList.toggle("hidden");
    
});
resetToggle.addEventListener("click", () => {
 startDate.value = "";
 endDate.value = "";
 checkedCheckbox.forEach(checkbox => {
    checkbox.checked = false;
 });
 applyFilters();
});
startDate.addEventListener("change", () => {
    applyFilters();
});
endDate.addEventListener("change", () => {
    applyFilters();
});
checkedCheckbox.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        applyFilters();
    });
});

renderSummary(calculateTotals(expenses));
renderChart(calculateTotals(expenses));
