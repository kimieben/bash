print('First value?')
a = int(input())
print('Second value?')
b = int(input())
print('Operation? (+-*/)')
c = input()

print(a, c, b)
if (c == '+'):
    d = a + b
elif (c == '-'):
    d = a-b
elif (c == '/'):
    d = a/b
elif (c == '*'):
    d = a*b
else:
    print("Please input correct operation")

print(d)
