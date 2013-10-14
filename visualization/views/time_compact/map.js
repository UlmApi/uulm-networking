/* compact version of the time view */
function(doc) {
  if (doc.type === "log_entry") {
	var foo = {
		uuid: doc.uuid
		, ap: doc.ap
		, ouid: doc.ouid
	}

	emit(doc.time, foo);
  }
}
