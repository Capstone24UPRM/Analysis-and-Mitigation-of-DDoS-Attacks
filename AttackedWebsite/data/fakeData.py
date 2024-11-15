import json
import csv
import xml.etree.ElementTree as ET
import xml.dom.minidom
import random
from faker import Faker
import pycountry
import re

fake = Faker()
# Faker.seed(0)  # Optional for reproducibility

# Device options
device_options = ['Android', 'iPhone', 'Desktop']

# Generate People Data
num_people = 1000
people_list = []
id_to_person = {}
email_to_id = {}
phone_to_id = {}
generated_emails = set()
generated_phones = set()

def generate_us_phone_number():
    area_code = ''.join([str(random.randint(0, 9)) for _ in range(3)])
    first_three = ''.join([str(random.randint(0, 9)) for _ in range(3)])
    last_four = ''.join([str(random.randint(0, 9)) for _ in range(4)])
    return f"{area_code}-{first_three}-{last_four}"

def generate_unique_email(first_name, last_name):
    # Clean up names
    base_email = f"{first_name}.{last_name}".lower()
    base_email = re.sub(r'[^a-z0-9\.]', '', base_email)  # Remove non-alphanumeric characters

    email = f"{base_email}@example.com"
    count = 1
    while email in generated_emails:
        email = f"{base_email}{count}@example.com"
        count += 1
    generated_emails.add(email)
    return email


def generate_unique_phone():
    phone = generate_us_phone_number()
    while phone in generated_phones:
        phone = generate_us_phone_number()
    generated_phones.add(phone)
    return phone

# Generate 10 stores
num_stores = 10
stores_list = []
store_ids = set()

for _ in range(num_stores):
    store_id = fake.unique.random_int(min=1, max=9999)
    store_name = fake.company()
    store = {
        'id': f"S{str(store_id).zfill(4)}",
        'name': store_name
    }
    stores_list.append(store)
    store_ids.add(store['id'])

# Generate 50 products
num_products = 20
products_list = []
product_ids = set()

for _ in range(num_products):
    product_id = fake.unique.random_int(min=1, max=9999)
    product_name = fake.word().capitalize()
    product = {
        'id': f"P{str(product_id).zfill(4)}",
        'name': product_name
    }
    products_list.append(product)
    product_ids.add(product['id'])

# Assign products to stores
store_products = {store['id']: [] for store in stores_list}

for product in products_list:
    # Randomly assign the product to 1 to 3 stores
    num_stores_per_product = random.randint(1, 3)
    assigned_stores = random.sample(stores_list, num_stores_per_product)
    for store in assigned_stores:
        store_products[store['id']].append(product['id'])

# Select 5 countries
all_countries = [country.name for country in pycountry.countries]
selected_countries = random.sample(all_countries, 5)

# Generate 15 cities total across the selected countries
total_cities = 15
cities_per_country = {}
remaining_cities = total_cities

for i, country in enumerate(selected_countries):
    countries_left = len(selected_countries) - i
    if remaining_cities <= 0:
        cities_per_country[country] = []
    else:
        min_cities = 1  # At least one city per country
        max_cities = remaining_cities - (countries_left - 1)  # Leave at least one city for remaining countries
        num_cities = random.randint(min_cities, max_cities)
        Faker.seed(country)
        fake_country = Faker(locale='en')
        cities = [fake_country.city() for _ in range(num_cities)]
        cities_per_country[country] = list(set(cities))
        remaining_cities -= len(cities_per_country[country])

# Assign weights to countries
country_weights = [random.randint(1, 100) for _ in selected_countries]
total_country_weight = sum(country_weights)
country_probabilities = [w / total_country_weight for w in country_weights]

# Assign weights to cities within each country
city_probabilities = {}
for country, cities in cities_per_country.items():
    if cities:
        city_weights = [random.randint(1, 100) for _ in cities]
        total_city_weight = sum(city_weights)
        city_probabilities[country] = [w / total_city_weight for w in city_weights]
    else:
        city_probabilities[country] = []

for i in range(1, num_people + 1):
    person_id = str(i).zfill(4)
    first_name = fake.first_name()
    last_name = fake.last_name()
    email = generate_unique_email(first_name, last_name)
    phone = generate_unique_phone()
    
    # Assign 1 to 3 devices to each person
    num_devices = random.randint(1, 3)
    devices = random.sample(device_options, num_devices)
    
    # Assign country based on weighted probabilities
    country = random.choices(selected_countries, weights=country_weights, k=1)[0]
    
    # Get cities and their probabilities for the selected country
    cities = cities_per_country[country]
    if cities:
        probabilities = city_probabilities[country]
        # Assign city based on weighted probabilities
        city = random.choices(cities, weights=probabilities, k=1)[0]
    else:
        city = None  # If no cities are assigned to the country
    
    location = {
        'City': city,
        'Country': country
    }
    person = {
        'id': person_id,
        'first_name': first_name,
        'last_name': last_name,
        'telephone': phone,
        'email': email,
        'devices': devices,
        'location': location
    }
    people_list.append(person)
    id_to_person[person_id] = person
    email_to_id[email] = person_id
    phone_to_id[phone] = person_id



# Generate Promotions Data
num_promotions = 250
promotions = []

for i in range(1, num_promotions + 1):
    promotion_id = i
    person = random.choice(people_list)
    contact_method = random.choice(['email', 'telephone'])
    client_email = person['email'] if contact_method == 'email' else ''
    telephone = person['telephone'] if contact_method == 'telephone' else ''
    promotion_name = random.choice(products_list).get("name")
    responded = random.choice(['Yes', 'No'])
    promotion = {
        'id': promotion_id,
        'client_email': client_email,
        'telephone': telephone,
        'promotion': promotion_name,
        'responded': responded
    }
    promotions.append(promotion)

# Generate Transactions Data
num_transactions = 200
transactions_root = ET.Element('transactions')

for i in range(1, num_transactions + 1):
    transaction = ET.SubElement(transactions_root, 'transaction', id=str(1000 + i))
    items_elem = ET.SubElement(transaction, 'items')

    num_items = random.randint(1, 5)
    for _ in range(num_items):
        item_elem = ET.SubElement(items_elem, 'item')
        item_name_elem = ET.SubElement(item_elem, 'item')
        item_name_elem.text = fake.word()
        price_per_item = round(random.uniform(1, 100), 2)
        quantity = random.randint(1, 10)
        total_price = round(price_per_item * quantity, 2)
        price_elem = ET.SubElement(item_elem, 'price')
        price_elem.text = str(total_price)
        price_per_item_elem = ET.SubElement(item_elem, 'price_per_item')
        price_per_item_elem.text = str(price_per_item)
        quantity_elem = ET.SubElement(item_elem, 'quantity')
        quantity_elem.text = str(quantity)

    person = random.choice(people_list)
    phone_elem = ET.SubElement(transaction, 'phone')
    phone_elem.text = person['telephone']

    store = random.choice(stores_list)
    store_elem = ET.SubElement(transaction, 'store')
    store_id_elem = ET.SubElement(store_elem, 'id')
    store_id_elem.text = store['id']
    store_name_elem = ET.SubElement(store_elem, 'name')
    store_name_elem.text = store['name']

# Generate Transfers Data
num_transfers = 550
transfers = []

for _ in range(num_transfers):
    sender_id = random.choice(list(id_to_person.keys()))
    recipient_id = random.choice(list(id_to_person.keys()))
    while recipient_id == sender_id:
        recipient_id = random.choice(list(id_to_person.keys()))
    amount = round(random.uniform(1.0, 1000.0), 2)
    date = fake.date_between(start_date='-2y', end_date='today').isoformat()
    transfer = {
        'sender_id': sender_id,
        'recipient_id': recipient_id,
        'amount': amount,
        'date': date
    }
    transfers.append(transfer)

# Write Data to Files
with open('people.json', 'w') as file:
    json.dump(people_list, file, indent=4)

with open('promotions.csv', 'w', newline='', encoding='utf-8') as file:
    fieldnames = ['id', 'client_email', 'telephone', 'promotion', 'responded']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(promotions)

# Build the XML tree
tree = ET.ElementTree(transactions_root)

# Create a string representation of the XML
xml_str = ET.tostring(transactions_root, encoding='utf-8')

# Parse the string using minidom for pretty-printing
dom = xml.dom.minidom.parseString(xml_str)
pretty_xml_as_string = dom.toprettyxml(indent='  ')

# Write the formatted XML to the file
with open('transactions.xml', 'w', encoding='utf-8') as file:
    file.write(pretty_xml_as_string)

with open('transfers.csv', 'w', newline='', encoding='utf-8') as file:
    fieldnames = ['sender_id', 'recipient_id', 'amount', 'date']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(transfers)
