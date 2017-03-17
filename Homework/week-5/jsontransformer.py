import csv
import json

csvfile = open('tempwijkaanzee1.csv', 'r')
jsonfile = open ('tempwijkaanzee1.json', 'w')

fieldnames = ('Datum','Gem', 'Min', 'Max')
reader = csv.DictReader(csvfile, fieldnames)
for row in reader:
	json.dump(row, jsonfile)
	jsonfile.write('\n')