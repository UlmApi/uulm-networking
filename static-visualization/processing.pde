import java.util.Arrays;

void setup() {
  size(700, 700);
  smooth();
  noFill();
 
  stroke(255, 0, 0);
  strokeWeight(1);
  background(25);

  translate(50, 50);

  JSONArray values = loadJSONArray("data.json");
  for (int i = 0; i < values.size(); i++) {
    JSONObject animal = values.getJSONObject(i); 
    int id = animal.getInt("id");
    String species = animal.getString("species");

      String[] coords = new String[2];
      coords = points[n].split(" ");
      if (coords.length != 2) continue;

  pushMatrix();
  fill(255, 0, 0);
translate(
sphere(10);
    popMatrix();
      //strokeWeight(1);
      //float alph = 1.0 + (float(maxmin[0]) / float(trips));
      //alph = 3.0f + log(float(trips)) * 0.7f;
      //stroke(0,255,0, alph + 0.0f);
        //stroke(255, 0,0, alph);
        stroke(255, 0,0, 1.0);
  }


  //save("../output/" + city + "/out.png"); 
}

void draw() { }
