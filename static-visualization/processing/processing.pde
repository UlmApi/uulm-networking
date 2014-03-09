import java.util.Arrays;

int max = 0;
int min = 0;

void setup() {
  //size(700, 700, P3D);
  size(700, 700);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);

  translate(50, 50);
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
 //  println(coord_a + ", " + coord_b);
   int[] px = new int[2];
   px = coord2px(coord_a, coord_b);
//   println(px[0] + ", " + px[1]);
//println(getForAP(key));
int total = getForAP(key);
//noStroke();

float alph = 255.0 * (total/max);
float r = 10.0 - (10.0/(total*0.01));

alph = ((float(total)/float(max)) * 255.0);
r = total * 0.002;

if (r < 3.0) r = 3.0;
if (alph < 50.0) alph = 50.0;


//println("total: " + total + ", alph: " + alph + ", r: " + r);
//println(alph);
//alph = 255.0;
  //fill(0xff0000, );
  noStroke();
  fill(255, 0, 0, alph);
  //stroke(255 , 0, 0);
//translate(px[0], px[1]);
//sphere(10);
//ellipse(px[0], px[1], 5, 5);
ellipse(px[0], px[1], r, r);

      //strokeWeight(1);
      //float alph = 1.0 + (float(maxmin[0]) / float(trips));
      //alph = 3.0f + log(float(trips)) * 0.7f;
      //stroke(0,255,0, alph + 0.0f);
        //stroke(255, 0,0, alph);
     //   stroke(255, 0,0, 1.0);
  }
    popMatrix();

  //save("../output/" + city + "/out.png"); 
}

void draw() { }

int getForAP(String alias) {
  //println(alias);
  
  JSONArray values = loadJSONArray("entire_data.json");
  int total = 0;
  for (int i = 0; i < values.size(); i++) {
    JSONObject entry = values.getJSONObject(i); 
    int value = entry.getInt("value");

    JSONArray key = entry.getJSONArray("key"); 
    String ap_alias = key.getString(0);
    String orga = key.getString(1);
  //  println(ap_alias + ", " + orga + ", " + value);

  if (ap_alias.equals(alias)) 
  total += value;
      //String[] coords = new String[2];
      //coords = points[n].split(" ");
      //if (coords.length != 2) continue
  }
  //println(total);
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

        int imgWidth = 600;
        int imgHeight = 600;

        int shiftX = -10;
        int shiftY = -600;

        int coordX = int(((imgWidth / bbWidth) * (lon - bbLeft)) + shiftX);
        int coordY = int(((imgHeight / bbHeight) * (bbTop - lat)) + shiftY);
        coordY *= -1;

        //return {x: coordX, y: coordY};
        int foo[] = new int[2];
        foo[0] = coordX;
        foo[1] = coordY;
        
        return foo;
}

