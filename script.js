let expenses = {};

function parseChat() {
    const chatInput = document.getElementById('chatInput').value.trim();
    if (!chatInput) {
        alert('请输入聊天记录！');
        return;
    }

    expenses = {};
    const lines = chatInput.split('\n');
    let currentPerson = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // 处理人名行（支持多种格式）
        if (line.startsWith('-') || line.endsWith(':')) {
            currentPerson = line.replace(/^[-]/, '').replace(/[:：]$/, '').trim();
            if (!expenses[currentPerson]) {
                expenses[currentPerson] = [];
            }
        }
        // 处理费用行
        else if (currentPerson && (line.includes(':') || line.includes('：'))) {
            // 替换中文冒号为英文冒号
            line = line.replace('：', ':');
            const [item, amount] = line.split(':');
            const amountValue = parseFloat(amount.trim());
            if (!isNaN(amountValue)) {
                expenses[currentPerson].push({
                    item: item.trim(),
                    amount: amountValue
                });
            }
        }
    }

    updateExpensesList();
}

function updateExpensesList() {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    for (const [person, items] of Object.entries(expenses)) {
        const personDiv = document.createElement('div');
        personDiv.className = 'person-expenses';
        
        const personName = document.createElement('div');
        personName.className = 'person-name';
        personName.textContent = person;
        personDiv.appendChild(personName);

        let total = 0;
        items.forEach(item => {
            const expenseDiv = document.createElement('div');
            expenseDiv.className = 'expense-item';
            expenseDiv.innerHTML = `
                <span>${item.item}</span>
                <span>¥${item.amount.toFixed(2)}</span>
            `;
            personDiv.appendChild(expenseDiv);
            total += item.amount;
        });

        const totalDiv = document.createElement('div');
        totalDiv.className = 'expense-item';
        totalDiv.innerHTML = `
            <span><strong>总计</strong></span>
            <span><strong>¥${total.toFixed(2)}</strong></span>
        `;
        personDiv.appendChild(totalDiv);

        expensesList.appendChild(personDiv);
    }
}

function calculate() {
    const resultDetails = document.getElementById('resultDetails');
    const finalResult = document.getElementById('finalResult');
    resultDetails.innerHTML = '';
    finalResult.innerHTML = '';

    if (Object.keys(expenses).length === 0) {
        alert('请先添加费用记录！');
        return;
    }

    // 计算总支出和人均支出
    let totalExpenses = 0;
    let personTotals = {};

    for (const [person, items] of Object.entries(expenses)) {
        const total = items.reduce((sum, item) => sum + item.amount, 0);
        personTotals[person] = total;
        totalExpenses += total;
    }

    const averageExpense = totalExpenses / Object.keys(expenses).length;

    // 显示详细结果
    const detailsDiv = document.createElement('div');
    detailsDiv.innerHTML = `
        <div class="result-item">
            <strong>总支出：</strong>¥${totalExpenses.toFixed(2)}
        </div>
        <div class="result-item">
            <strong>人均应支付：</strong>¥${averageExpense.toFixed(2)}
        </div>
    `;
    resultDetails.appendChild(detailsDiv);

    // 计算并显示最终结算结果
    const finalDiv = document.createElement('div');
    finalDiv.className = 'result-item';
    finalDiv.innerHTML = '<strong>结算结果：</strong><br>';

    for (const [person, total] of Object.entries(personTotals)) {
        const difference = total - averageExpense;
        if (difference > 0) {
            finalDiv.innerHTML += `${person} 应该收到：¥${difference.toFixed(2)}<br>`;
        } else if (difference < 0) {
            finalDiv.innerHTML += `${person} 应该支付：¥${Math.abs(difference).toFixed(2)}<br>`;
        } else {
            finalDiv.innerHTML += `${person} 不需要支付或收到钱<br>`;
        }
    }

    finalResult.appendChild(finalDiv);
}

function clearAll() {
    expenses = {};
    document.getElementById('chatInput').value = '';
    updateExpensesList();
    document.getElementById('resultDetails').innerHTML = '';
    document.getElementById('finalResult').innerHTML = '';
}

function exportData() {
    let exportText = '';
    for (const [person, items] of Object.entries(expenses)) {
        items.forEach(item => {
            exportText += `-${person}:\n${item.item}:${item.amount}\n\n`;
        });
    }

    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            parseImportedData(text);
        };
        reader.readAsText(file);
    }
});

function parseImportedData(text) {
    expenses = {};
    const lines = text.split('\n');
    let currentPerson = null;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.startsWith('-')) {
            currentPerson = line.split(':')[0].substring(1);
            if (!expenses[currentPerson]) {
                expenses[currentPerson] = [];
            }
        } else if (currentPerson && line.includes(':')) {
            const [item, amount] = line.split(':');
            expenses[currentPerson].push({
                item: item.trim(),
                amount: parseFloat(amount.trim())
            });
        }
    }

    updateExpensesList();
} 