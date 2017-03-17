# Name: Urscha Fajdiga
# Student number: 11377437
'''
This script converts a CSV file to JSON
'''
import csv
import sys
import json

# Open the csv file and set fieldnames for the JSON, and read the csv file
csvdataset = open('dataset.csv' , 'r')
fieldnames = ['rank', 'country', 'goldmedals']
csvreader = csv.DictReader(csvdataset, fieldnames)

# open a JSON data set and write the rows of the csv to the JSON
jsondataset = open('dataset.json', 'w')
data = json.dumps([row for row in csvreader])
jsondataset.write(data)

# close both files
csvdataset.close()
jsondataset.close()

