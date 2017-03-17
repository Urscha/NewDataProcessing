# Urscha Fajdiga 11377437
# This file adds fillkeys to the CSV file for use in datamaps
import csv

# open the output file and set fieldnames and write header
output = open('output.csv', 'w') 
fieldnames = ['id', 'FillKey', 'country_or_area', 'GDP', 'GDP_in_billions']
print(fieldnames)
writer = csv.DictWriter(output, fieldnames=fieldnames)
writer.writeheader()

# open data file and add fillkey to the data file and write as output.csv
with open('data.csv') as f:
	reader = csv.DictReader(f)
	for row in reader:
		GDP_in_billions = long(row['GDP_in_billions'])
		if GDP_in_billions <= 200000:
			row['FillKey'] = 'GDP0_200'
		elif GDP_in_billions <= 400000:
			row['FillKey'] = 'GDP201_400'
		elif GDP_in_billions <= 600000:
			row['FillKey'] = 'GDP401_600'
		elif GDP_in_billions <= 800000:
			row['FillKey'] = 'GDP601_800'
		else:
			row['FillKey'] = 'GDP801_1000'
		writer.writerow(row)