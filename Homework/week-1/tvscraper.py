#!/usr/bin/env python
# Name: Urscha Fajdiga
# Student number: 11377437
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv
import codecs

from pattern.web import URL, DOM
from pattern.web import Element

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

def extract_tvseries(dom):
	# ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
	tvseries1 = []
	 
	for e in dom.by_class("lister-item mode-advanced"):
		info = {}
		# title
		for a in e.by_class("lister-item-header"):
			for y in a.by_tag("a"):
				current_title = y.content
				info['Title'] = current_title.encode('utf-8')
		# rating
		for b in e.by_class("inline-block ratings-imdb-rating"):
			for z in b.by_tag("strong"):
				info['Rating'] = z.content
		#genre
		for c in e.by_class("genre"):
			current_genre = c.content 
			info['Genre'] = current_genre.strip('\n')
		#runtime
		for f in e.by_class("runtime"):
			info['Runtime'] = f.content
		tvseries1.append(info)
		# actors
		for d in e.by_class("lister-item-content"):
			actors = []
			for f in d.by_tag("p")[2].by_tag("a"):
				current_actor = f.content.encode('utf-8')
				actors.append(current_actor)
			info['Actors'] = actors
	return (tvseries1)

def save_csv(f, tvseries):
	fieldnames = ['Title', 'Rating', 'Genre', 'Actors', 'Runtime']
	writer = csv.DictWriter(f, fieldnames=fieldnames)
	# ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK
	writer.writeheader()
	for dict in tvseries:
			writer.writerow(dict)
	return
	
if __name__ == '__main__':
	# Download the HTML file
	url = URL(TARGET_URL)
	html = url.download()
	
	# Save a copy to disk in the current directory, this serves as an backup
	# of the original HTML, will be used in grading.
	
	with open(BACKUP_HTML, 'wb') as f:
		f.write(html)

	# Parse the HTML file into a DOM representation
	dom = DOM(html)

	# Extract the tv series (using the function you implemented)
	tvseries = extract_tvseries(dom)
	
	# Write the CSV file to disk (including a header)
	with open(OUTPUT_CSV, 'wb') as output_file:
		save_csv(output_file, tvseries)
