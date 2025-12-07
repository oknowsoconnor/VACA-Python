def split_bill(total, people):
    share = round(total / len(people), 2)
    return {name: share for name in people}

total  = float(input("Total amount: "))
names  = input("Comma-separated names: ").split(",")
people = [n.strip() for n in names if n.strip()]

result = split_bill(total, people)
for person, amount in result.items():
    print(f"{person} owes ${amount:.2f}")