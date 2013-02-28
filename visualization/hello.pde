float r = 0;

void setup(){
  size(1360, 700, P3D);
}

void draw(){
  camera();
  background(0);
  ambientLight(64, 64, 128);
  directionalLight(200, 200, 200, 0, 1, 0.5);

  translate(width/2, height/2, 380);
  rotateX(-PI/4);
  rotateY(r += 0.01);
  
  strokeWeight(1);
  stroke(50, 200, 200);
  noFill();
  strokeWeight(3);
  box(25, 1, 25);
}


