def calculate_expenses(file_path):
    # 初始化每个人的总支出
    expenses = {}
    details = {}  # 存储每个人的详细支出
    
    # 读取文件并解析费用
    with open(file_path, 'r', encoding='utf-8') as file:
        current_person = None
        for line in file:
            line = line.strip()
            if not line:
                continue
                
            if line.startswith('-'):
                # 提取人名
                current_person = line.split(':')[0].strip('-')
                if current_person not in expenses:
                    expenses[current_person] = 0
                    details[current_person] = []
            else:
                # 提取金额，支持中文和英文冒号
                if ':' in line or '：' in line:
                    # 替换中文冒号为英文冒号
                    line = line.replace('：', ':')
                    item, amount = line.split(':')
                    amount = float(amount.strip())
                    expenses[current_person] += amount
                    details[current_person].append((item.strip(), amount))
    
    # 计算总支出和人均支出
    total_expenses = sum(expenses.values())
    average_expense = total_expenses / len(expenses)
    
    # 计算每个人应该支付或收到的金额
    results = {}
    for person, spent in expenses.items():
        results[person] = spent - average_expense
    
    return results, details, total_expenses, average_expense

def main():
    file_path = 'expenses.txt'  # 输入文件路径
    results, details, total, average = calculate_expenses(file_path)
    
    print("\n详细支出记录：")
    print("-" * 30)
    for person, items in details.items():
        print(f"\n{person}的支出明细：")
        for item, amount in items:
            print(f"  {item}: ¥{amount:.2f}")
        print(f"总计: ¥{sum(amount for _, amount in items):.2f}")
    
    print(f"\n总支出: ¥{total:.2f}")
    print(f"人均应支付: ¥{average:.2f}")
    
    print("\n费用结算结果：")
    print("-" * 30)
    for person, amount in results.items():
        if amount > 0:
            print(f"{person} 应该收到: ¥{amount:.2f}")
        elif amount < 0:
            print(f"{person} 应该支付: ¥{abs(amount):.2f}")
        else:
            print(f"{person} 不需要支付或收到钱")

if __name__ == "__main__":
    main() 