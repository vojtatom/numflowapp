
let myp5;

function createLoadScreen(parentElem) {
	let sketch = function (p) {
		const agents = [];
		let time = 0;
		const timeDelta = 0.01;
		let colorDelta = 0.1;
		let color = 255;

		const vw = 500;
		const vh = 250;

		p.setup = function () {
			let canvas = p.createCanvas(vw, vh);
			canvas.style("visibility", "visible")

			//spawn agents
			for (let i = 0; i < 200; i++) { //200
				agents.push({
					pos: p.createVector(p.random() * p.windowWidth, p.random() * 0.5 * p.windowHeight),
					vel: p.createVector(),
					acc: p.createVector()
				});
			}

			p.background(255)
			p.strokeWeight(3);
			//p.frameRate(24);
			//p.blendMode(p.BLEND);
			//p.fill(255, 10);
		};

		p.draw = function () {
			//p.background(30);

			p.stroke(Math.abs(color), 20);
			/*p.strokeWeight(0);
			p.fill(30, 20);
			p.rect(0, 0, ww, wh);
			p.fill(255);
			p.strokeWeight(2);*/
			//draw agents
			let x, y;
			for (let i = 0, len = agents.length; i < len; i++) {

				let angle = p.noise(agents[i].pos.x / 50, agents[i].pos.y / 50, time) * 2 * p.TWO_PI;
				agents[i].acc = agents[i].acc.add(p5.Vector.fromAngle(angle).mult(0.1)).limit(0.5);
				agents[i].vel = agents[i].vel.add(agents[i].acc).limit(2);
				x = agents[i].pos.x;
				y = agents[i].pos.y;
				agents[i].pos = agents[i].pos.add(agents[i].vel);

				p.line(x, y, agents[i].pos.x, agents[i].pos.y);
				//p.square(agents[i].pos.x, agents[i].pos.y, 1, 1);

				agents[i].pos.x = (agents[i].pos.x + vw) % vw;
				agents[i].pos.y = (agents[i].pos.y + vh) % vh;
			}

			time += timeDelta;
			color = (color + colorDelta + 255) % 510 - 255;
		};

		/*p.windowResized = function() {
				p.resizeCanvas(0.1 * p.windowWidth, 0.1 * p.windowWidth);
		};*/
	};

	myp5 = new p5(sketch, parentElem);
}

function stopLoadScreen() {
	myp5.remove();
	myp5 = null;
}