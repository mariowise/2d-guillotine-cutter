
function Node(w, h, parent) {
	this.w = (w) ? w : 0
	this.h = (h) ? h : 0
	this.parent = (parent) ? parent : null
	
	this.id = Uuid.get()
	this.is_piece = false

	Node.pieces.push(this)
}

Node.pieces = []

Node.prototype.cut = function (side, offset) {
	if(side == 'w' && offset <= this.w) {

		this.left = new Node(offset, this.h, this)
		this.right = new Node(this.w - offset, this.h, this)

	} else if (side == 'h' && offset <= this.h) {

		this.left = new Node(this.w, this.h - offset, this)
		this.right = new Node(this.w, offset, this)

	} else {
		console.error("Node::cut ERROR: Se ha intentado crear un corte inválido.")
		console.error(this)
		console.error(arguments)
		return
	}
	this.cutside = side
}

Node.prototype.uncut = function () {
	delete this.left
	delete this.right
}

Node.prototype.is_cutted = function () {
	if(this.left && this.right)
		return true
	else 
		return false
}

Node.prototype.draw = function (o) {
	
	if( !this.is_cutted() && this.w > 0 && this.h > 0 ) {
		r = two.makeRectangle(o.x, o.y, this.w, this.h)
	  r.linewidth = 2;
	  two.makeText("" + this.w + "x" + this.h, o.x, o.y, { size: 40 })  
	  two.makeText("" + this.id, o.x, o.y + 40, { size: 30 })  
	  
	  if( this.is_piece ) 
	  	r.fill = '#6DCC6E'
	  else 
	  	r.fill = '#CCC272'    
  	// console.log("Drawing (" + o.x + "," + o.y + ") \t" + this.w + "x" + this.h)
	}

	if( this.is_cutted() ) {
		
		if( this.cutside == 'w' ) {
			this.left.draw( { x: o.x - this.w/2 + this.left.w/2, y: o.y })
			this.right.draw({ x: o.x - this.w/2 + this.left.w + this.right.w/2, y: o.y })
		}

		else { // this.cutside == 'h'
			this.left.draw( { x: o.x, y: o.y - this.h/2 + this.right.h + this.left.h/2 })
			this.right.draw({ x: o.x, y: o.y - this.h/2 + this.right.h/2 })
		}

	}
}

Node.try_push = function (piece) {
	for(node in Node.pieces) { node = Node.pieces[node]; 
		if(!node.is_piece && !node.is_cutted() && node.w >= piece.w && node.h >= piece.h) {
			node.cut('w', piece.w)
			node.left.cut('h', piece.h)
			node.left.right.is_piece = true
			return true
			// node.cut('h', piece.h)
			// node.right.cut('w', piece.w)
			// node.right.left.is_piece = true
			// return true
		}
	}
	return false
}

Node.draw = function () {
	for(node in Node.pieces) { node = Node.pieces[node]; 
		two.makeRectangle(100, 100, node.w, node.h)
	}
}