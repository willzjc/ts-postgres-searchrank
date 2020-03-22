import random

if __name__ == '__main__':

    MAX_USER_COUNT=50
    MAX_TRANSACTIONS=1000
    MAX_TRANSACTIONAL_AMOUNT=100000

    USER_COUNT=random.randint(10,MAX_USER_COUNT)
    for i in range(1,USER_COUNT+1):

        sql="INSERT INTO user_search_rank.customers (username) " \
            "VALUES ('user" +"{:03d}".format(i) + "');"
        print(sql)


    ITERATIONS=random.randint(60,MAX_TRANSACTIONS)
    for i in range(0,ITERATIONS):
        from_id=random.randint(a=1,b=USER_COUNT)
        to_id=random.randint(a=1,b=USER_COUNT)
        amount=random.randint(a=100,b=MAX_TRANSACTIONAL_AMOUNT)
        if from_id != to_id:
            sql=f"INSERT INTO user_search_rank.transactions(from_customer_id, to_customer_id, amount)" \
                f" VALUES ({from_id},{to_id},{amount});"
            print(sql)
        else:
            i-=1

