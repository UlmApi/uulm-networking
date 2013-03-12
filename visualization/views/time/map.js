function(doc) {
  if (doc.type === "log_entry")
       emit(doc.time, doc);
}
