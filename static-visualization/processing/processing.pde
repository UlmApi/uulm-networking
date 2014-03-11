import java.util.Arrays;

int max = 0;
int min = 0;
PShader texShader;

void setup() {
  size(1200, 800, P3D);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  //background(#1a1a1a);
  //background(#131617);
  background(0);
  
  texShader = loadShader("texfrag.glsl", "texvert.glsl");
  shader(texShader);  
 
  PImage img;
  img = loadImage("./map.png");

  rotateX(PI/4);
  translate(0, 0, -150);
  translate(220, 0, 0);
  translate(0, 120, 0);

  pushMatrix();
 
  ambientLight(127, 150, 164);
  //ambientLight(218, 28, 92);
  directionalLight(width/2, height/2, 150, -1, 0, 0);

  image(img, 0, 0);

  /*
  JSONArray values = loadJSONArray("entire_data.json");
  
  for (int i = 0; i < values.size(); i++) {
    JSONObject entry = values.getJSONObject(i); 
    int value = entry.getInt("value");
     
    if (value > max) max = value;
    if (value < min) min = value;
  }
  
  println("max: " + max);
  println("min: " + min);
  */
  
  int max = 9134;
  int min = 0;

  JSONObject aps_obj = loadJSONObject("aps.json");
  JSONArray rows = aps_obj.getJSONArray("rows");
  pushMatrix(); 

  for (int i = 0; i < rows.size(); i++) {
    JSONObject row = rows.getJSONObject(i); 
    String key = row.getString("key"); 

    JSONArray value = row.getJSONArray("value");
    if (value.size() == 0) continue;

    JSONArray coord = value.getJSONArray(0); 
    
    Float coord_a = coord.getFloat(0);
    Float coord_b = coord.getFloat(1);
    int[] px = new int[2];
    px = coord2px(coord_a, coord_b);

    int total = getForAP(key);

    float alph = 255.0 * (total/max);
    float r = 10.0 - (10.0/(total*0.01));

    alph = ((float(total)/float(max)) * 255.0);
    r = total * 0.0009;

    if (r < 2.0) r = 2.0;
    if (alph < 200.0) alph = 200.0;

    alph = 250.0;

    //println("total: " + total + ", alph: " + alph + ", r: " + r);
    noStroke();
    fill(255, 0, 0, alph);
    fill(#DA1C5C, alph);
    //fill(#ffffff, alph);
    //fill(#FFAAFF, alph);

    pushMatrix();
      translate(px[0], px[1]);
      sphere(r);
      //box(5, 5, r*13);
    popMatrix();
  }
  popMatrix();
  popMatrix();

  save("./out.png"); 
}

void draw() { }

int getForAP(String alias) {
  JSONArray values = loadJSONArray("entire_data.json");
  int total = 0;

  for (int i = 0; i < values.size(); i++) {
    JSONObject entry = values.getJSONObject(i); 
    int value = entry.getInt("value");

    JSONArray key = entry.getJSONArray("key"); 
    String ap_alias = key.getString(0);
       String orga = key.getString(1);

    if (ap_alias.equals(alias)) 
      total += value;
  }

  return total;
}

int[] coord2px(float lat, float lon) {
        /*
                48.42677
        9.94224          9.96477
                48.41809
        */
        float bbLeft = 9.94224;
        float bbRight = 9.96477;
        float bbTop = 48.42677;
        float bbBottom = 48.41809;

        float bbHeight = bbTop - bbBottom;
        float bbWidth = bbRight - bbLeft;

        int imgWidth = 900;
        int imgHeight = 522;

        int shiftX = 0;
        int shiftY = 0;

        float coordX = ((imgWidth / bbWidth) * (lon - bbLeft)) + shiftX;
        float coordY = ((imgHeight / bbHeight) * (bbTop - lat)) + shiftY;
        //coordY *= -1;

        //return {x: coordX, y: coordY};
        int foo[] = new int[2];
        foo[0] = int(coordX);
        foo[1] = int(coordY);
        
        return foo;
}

