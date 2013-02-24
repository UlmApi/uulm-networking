# ToDo

 * Geolocations for all Access Points have to be added


# Data

Data is stored within two files:

## ./data/wlan-client-authlog.anon

Contains log data for one week university life. Entries are created
whenever a WLAN-Client associates with an Access Point.

```
DATUM          UHRZEIT  OUI      HASHED-MAC                      DNS-AP
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
