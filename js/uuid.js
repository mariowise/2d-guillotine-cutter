
function Uuid() {
}

Uuid.lastid = 0

Uuid.get = function () {
	now = Date.now() * 100
	
	if(now <= Uuid.lastid)
		Uuid.lastid++
	else
		Uuid.lastid = now
	
	return Uuid.lastid
}
