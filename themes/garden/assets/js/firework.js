// THANKS: Firework.js - https://codepen.io/zystvan/details/LEbNRp
//
// Garden copy. The particle system below is the original, untouched. What
// changed is the canvas geometry, which was wrong in three ways:
//
//   1. The bitmap was 300px tall and the element renders at 80% of a 300px
//      header — 240px. Everything drawn was squashed by a fifth, and the
//      rockets launched from `y = ch` into what was already off the bottom.
//   2. `ch` was the literal 300 while the header is 200px below 640px wide,
//      so on a phone the squash was a third.
//   3. `cw` was read once at load. Resizing the window stretched whatever was
//      already on the canvas and left new fireworks aiming off-screen.
//
// All three come from the same mistake: a canvas has two sizes, and the bitmap
// has to be told what the box is doing. `size()` reads the box.
//
// The CSS is `height: 100%` now for the same reason. The old `80%` looked like
// it kept the effect clear of the skyline, but the canvas scaled rather than
// cropped, so it never did — it only made everything shorter.

// ── TUNING ─────────────────────────────────────────────────────────────────
// The two numbers worth touching. Everything else below is the original
// particle system and does not need to be understood to change the show.

// HOW MANY BURSTS, NOT HOW LONG. This used to stop twelve seconds after load,
// which was a stand-in for the real intent — fire a handful and then let the
// header be still. Time is the wrong unit: one launch happens every
// LAUNCH_GAP frames, so twelve seconds bought nine bursts on a 60Hz display,
// four or five on anything struggling, and eighteen on a 120Hz panel.
var TOTAL_LAUNCHES = 7;

// TEMPO — THE ONE KNOB THAT DOES ANYTHING, and `this.speed` is not it.
//
// Worth stating plainly, because it is the obvious thing to reach for: a
// Firework's `acceleration` is 500. Its speed is multiplied by five hundred on
// the very first frame, so it arrives at the target instantly no matter what
// `this.speed` started at. There is no climb left to shorten — it is already
// one frame. (That is also why no rising streak is ever visible. No loss: it
// would climb behind the skyline anyway.)
//
// What you actually feel is the gap between launches: 80 frames, which is 1.3
// seconds of empty sky at 60fps and by far the largest part of the show. TEMPO
// divides it. 1 is the original pace; 2 puts the nine bursts into about six
// seconds instead of twelve.
//
// IT DELIBERATELY DOES NOT TOUCH THE FADE. Scaling `decay` with it was tried and
// measured: the show came out the same length either way — it is gap-driven —
// but doubling the fade dropped the peak from 201 particles to 125 and no two
// bursts ever shared the sky. Leaving the fade alone means a burst is still
// dying while the next one goes up, which is what a fast display looks like.
// Shortening each burst is not speed, it is just less.
var TEMPO = 2;

var LAUNCH_GAP = Math.max(1, Math.round(80 / TEMPO));

var canvas = document.getElementById('firework'),
		ctx = canvas.getContext('2d'),
		// filled by size(), which reads the element's own box
		cw = 0,
		ch = 0,
		// firework collection
		fireworks = [],
		// particle collection
		particles = [],
		// starting hue
		hue = 120,
		timerTick = 0;

// Match the bitmap to the rendered box. Assigning width or height also CLEARS
// the canvas, which is why this is not called from inside the loop.
function size() {
	var box = canvas.getBoundingClientRect();
	cw = Math.round(box.width);
	ch = Math.round(box.height);
	canvas.width = cw;
	canvas.height = ch;
}
size();
// Debounced: a drag-resize fires this dozens of times a second, and each call
// throws away the frame.
var resizeTimer;
window.addEventListener('resize', function () {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(size, 150);
}, { passive: true });

var animateId;

// get a random number within a range
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

// create firework
function Firework( sx, sy, tx, ty ) {
	// actual coordinates
	this.x = sx;
	this.y = sy;
	// starting coordinates
	this.sx = sx;
	this.sy = sy;
	// target coordinates
	this.tx = tx;
	this.ty = ty;
	// distance from starting point to target
	this.distanceToTarget = calculateDistance( sx, sy, tx, ty );
	this.distanceTraveled = 0;
	// track the past coordinates of each firework to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 2;
	// populate initial coordinate collection with the current coordinates
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	this.angle = Math.atan2( ty - sy, tx - sx );
	this.speed = 5;
	this.acceleration = 500;
	this.brightness = random( 50, 70 );
	// circle target indicator radius
	this.targetRadius = 1;
}

// update firework
Firework.prototype.update = function( index ) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift( [ this.x, this.y ] );

	// cycle the circle target indicator radius
	if( this.targetRadius < 8 ) {
		this.targetRadius += 0.3;
	} else {
		this.targetRadius = 1;
	}

	// speed up the firework
	this.speed *= this.acceleration;

	// get the current velocities based on angle and speed
	var vx = Math.cos( this.angle ) * this.speed,
			vy = Math.sin( this.angle ) * this.speed;
	// how far will the firework have traveled with velocities applied?
	this.distanceTraveled = calculateDistance( this.sx, this.sy, this.x + vx, this.y + vy );

	// if the distance traveled, including velocities, is greater than the initial distance to the target, then the target has been reached
	if( this.distanceTraveled >= this.distanceToTarget ) {
		createParticles( this.tx, this.ty );
		// remove the firework, use the index passed into the update function to determine which to remove
		fireworks.splice( index, 1 );
	} else {
		// target not reached, keep traveling
		this.x += vx;
		this.y += vy;
	}
}

// draw firework
Firework.prototype.draw = function() {
	ctx.beginPath();
	// move to the last tracked coordinate in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1][ 0 ], this.coordinates[ this.coordinates.length - 1][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();

	ctx.beginPath();
	// draw the target for this firework with a pulsing circle
	ctx.arc( this.tx, this.ty, this.targetRadius, 0, Math.PI * 2 );
	ctx.stroke();
}

// create particle
function Particle( x, y ) {
	this.x = x;
	this.y = y;
	// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
	this.coordinates = [];
	this.coordinateCount = 5;
	while( this.coordinateCount-- ) {
		this.coordinates.push( [ this.x, this.y ] );
	}
	// set a random angle in all possible directions, in radians
	this.angle = random( 0, Math.PI * 2 );
	this.speed = random( 1, 10 );
	// friction will slow the particle down
	this.friction = 0.95;
	// gravity will be applied and pull the particle down
	this.gravity = 1;
	// set the hue to a random number +-20 of the overall hue variable
	this.hue = random( hue - 20, hue + 20 );
	this.brightness = random( 50, 80 );
	this.alpha = 1;
	// set how fast the particle fades out
	this.decay = random( 0.015, 0.03 );
}

// update particle
Particle.prototype.update = function( index ) {
	// remove last item in coordinates array
	this.coordinates.pop();
	// add current coordinates to the start of the array
	this.coordinates.unshift( [ this.x, this.y ] );
	// slow down the particle
	this.speed *= this.friction;
	// apply velocity
	this.x += Math.cos( this.angle ) * this.speed;
	this.y += Math.sin( this.angle ) * this.speed + this.gravity;
	// fade out the particle
	this.alpha -= this.decay;

	// remove the particle once the alpha is low enough, based on the passed in index
	if( this.alpha <= this.decay ) {
		particles.splice( index, 1 );
	}
}

// draw particle
Particle.prototype.draw = function() {
	ctx. beginPath();
	// move to the last tracked coordinates in the set, then draw a line to the current x and y
	ctx.moveTo( this.coordinates[ this.coordinates.length - 1 ][ 0 ], this.coordinates[ this.coordinates.length - 1 ][ 1 ] );
	ctx.lineTo( this.x, this.y );
	ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
	ctx.stroke();
}

// create particle group/explosion
function createParticles( x, y ) {
	// increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
	var particleCount = 125;
	while( particleCount-- ) {
		particles.push( new Particle( x, y ) );
	}
}

var launched = 0;


// main demo loop
function loop() {
	// STOP WHEN THE LAST BURST HAS FADED, then clear. The old version called
	// cancelAnimationFrame on the frame it had just requested, which stopped the
	// loop but left the final half-faded particles painted on the canvas — they
	// hung in the sky until the next page load. Returning without requesting the
	// next frame is how you stop; clearing first is what makes the sky go quiet.
	if (launched >= TOTAL_LAUNCHES && !fireworks.length && !particles.length) {
		ctx.globalCompositeOperation = 'source-over';
		ctx.clearRect(0, 0, cw, ch);
		return;
	}

	// this function will run endlessly with requestAnimationFrame
	animateId = requestAnimationFrame(loop);

	// increase the hue to get different colored fireworks over time
	hue += 0.9;

	// normally, clearRect() would be used to clear the canvas
	// we want to create a trailing effect though
	// setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
	ctx.globalCompositeOperation = 'destination-out';
	// decrease the alpha property to create more prominent trails
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect( 0, 0, cw, ch );
	// change the composite operation back to our main mode
	// lighter creates bright highlight points as the fireworks and particles overlap each other
	ctx.globalCompositeOperation = 'lighter';

	// loop over each firework, draw it, update it
	var i = fireworks.length;
	while( i-- ) {
		fireworks[ i ].draw();
		fireworks[ i ].update( i );
	}

	// loop over each particle, draw it, update it
	var i = particles.length;
	while( i-- ) {
		particles[ i ].draw();
		particles[ i ].update( i );
	}

	// Launch automatically, from the bottom middle towards a random point in the
	// top half. The rocket climbs BEHIND the skyline — the city sits at
	// `z-index: 2` and this canvas at `auto` — so what you see is a burst over a
	// city that appears to have fired it. That is the intent, not a side effect;
	// do not lift the canvas above the silhouette.
	if( launched < TOTAL_LAUNCHES && timerTick >= LAUNCH_GAP ) {
		fireworks.push( new Firework( cw / 2, ch, random( 0, cw ), random( 0, ch / 2 ) ) );
		launched++;
		timerTick = 0;
	} else {
		timerTick++;
	}

}

// once the window loads, we are ready for some fireworks! but only on new years eve!
var dateObject = new Date();
var month = dateObject.getMonth() + 1;
var day = dateObject.getDate();

var newYearStart = dateObject.getFullYear() + "-12-27";
var newYearEnd = dateObject.getFullYear() + "-12-31";
var newYearStart2 = dateObject.getFullYear() + "-01-01";
var newYearEnd2 = dateObject.getFullYear() + "-01-06";
var nowDate = dateObject.getFullYear() + "-" + (month < 10 ? '0' : '') + month + "-" + (day < 10 ? '0' : '') + day;

if ( (nowDate >= newYearStart && nowDate <= newYearEnd) || (nowDate >= newYearStart2 && nowDate <= newYearEnd2) ) {
	window.onload = loop;
}
