# What is this?

This is a repository containing the pseudonymous access point logs of one 
week university life (Fri to Fri). 

Additionally we have included various tools for working with the data.

```
data/           Data files and CouchDB import script.
couchapp/       Web application for crowd-sourcing the process of
                collecting geolocation for the access points
```

http://localhost:5984/uulm-networking/_design/visualization/index.html


# ToDo

 * Geolocations for all Access Points have to be added


# Data

Execute `cd data; tar xfv data.tar.gz` to uncompress the files.

## ./data/wlan-client-authlog.anon

Entries are created whenever a WLAN-Client associates with an Access Point.

```
DATUM          UHRZEIT  OUI      HASHED-MAC                       DNS-AP
Fri 22.02.2013 12:51:32 00:1c:bf YypPd/GX4/nfYmjFsWu6ESmCRD...    n25-3-nord-ap1.rz.uni-ulm.de
```

The file `./data/oui.txt` from the [IEEE website](http://standards.ieee.org/develop/regauth/oui/public.html)
enables you to resolve the `OUI`.


## ./data/access-points-desc.asc

Contains a mapping of `DNS-AP` to `DESCRIPTION`. Separated by `\t`.

```
DNS-AP	DESCRIPTION
aea-5-ap1.rz.uni-ulm.de	"Albert-Einstein-Allee 5 | Pavillon | Seminarraum"
```


# Import into CouchDB

Make sure the files `./data/wlan-client-authlog.anon` and `./data/access-points-desc.asc`
exist!
Install [CouchDB](http://couchdb.apache.org/) and create a new database `uulm-networking`,
e.g. by using [http://localhost:5984/_utils/](http://localhost:5984/_utils/).

```
$ cd ./data/
$ make couchimport
$ make clean
```

You should now have 526359 rows in your database.


# License 

Data:

	The files `wlan-client-authlog.anon` and `access-points-desc.asc` are made 
	available by the University of Ulm under the Open Database License: 
	http://opendatacommons.org/licenses/odbl/1.0/. 

	Any rights in individual contents of the database are licensed under 
	the Database Contents License:
	http://opendatacommons.org/licenses/dbcl/1.0/


The code is licensed under the MIT license:

	Copyright (c) 2013

		Michael Mueller <http://micha.elmueller.net/>

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




