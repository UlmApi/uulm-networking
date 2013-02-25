function(doc) {
	if (doc.type === "ap")
		emit([doc.coords.length, doc._id], null);
}
