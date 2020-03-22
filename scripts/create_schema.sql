create schema user_search_rank;

alter schema user_search_rank owner to postgres;

create table if not exists user_search_rank.customers
(
	customer_id serial not null
		constraint customers_pk
			primary key,
	username text not null
);

alter table user_search_rank.customers owner to postgres;

create unique index customers_customer_id_uindex on user_search_rank.customers (customer_id);

create table if not exists user_search_rank.transactions
(
	transaction_id serial not null
		constraint transactions_pk
			primary key,
	from_customer_id integer not null
		constraint transactions_customers_customer_id_fk
			references user_search_rank.customers,
	to_customer_id integer
		constraint transactions_customers_customer_id_fk_2
			references user_search_rank.customers,
	amount integer
);

alter table user_search_rank.transactions owner to postgres;

create unique index transactions_transaction_id_uindex
	on user_search_rank.transactions (transaction_id);
