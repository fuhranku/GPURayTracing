#version 330 core
// Vertex color (interpolated/fragment)
in vec3 vPos;
in mat4 mvp;

// Uniforms 
uniform vec3 cameraPos;
uniform vec2 windowSize;

// Fragment Color
out vec4 fragColor;

bool intersectSphere(vec3 sphereCenter, vec3 rayStart, vec3 rayDirection, out float distance) {
  vec3 rayToSphere = sphereCenter - rayStart;
  float b = dot(rayDirection, rayToSphere);
  float d = b*b - dot(rayToSphere, rayToSphere) + 1.0;

  if (d < 0.0) {
    distance = 10000.0;
    return false;
  }

  distance = b - sqrt(d);
  if (distance < 0.0) {
    distance = 10000.0;
    return false;
  }

  return true;
}



void main()
{

    vec3 sphereCenter = vec3(0,0,0);


    vec3 sphereWorld = (mvp * vec4(sphereCenter,1)).xyz;

    vec2 coord = (gl_FragCoord.xy + 0.5f) / windowSize;

    vec3 planeWorld = (mvp * vec4(coord,1,1)).xyz;

    vec3 rayDir = normalize(planeWorld - cameraPos);

    float distance = 0;

    if(intersectSphere(sphereWorld, cameraPos, rayDir, distance)){
        fragColor = vec4(1,0,0,1);
    }
    else{
        fragColor = vec4(0,1,0,1);
    }

    /*
	vec4 Color = vec4(0.0f,0.0f,0.0f,1.0f);
	vec2 coord = (gl_FragCoord.xy-windowSize.y) / windowSize;
	vec3 rayDir = vec3(texture(renderedTexture,coord).xyz - vColor);
	vec3 rayIn = vColor;
	float D = length(rayDir);
	rayDir = normalize(rayDir);

	for(float i=0.0f;i<D;i+=1.0f/256){
	// Ai y Ci se consultan en la TF 
		Color.rgb += texture(volTexID,rayIn).r * vec3(texture(volTexID,rayIn).r) * Color.a;
		Color.a *= 1 - texture(volTexID,rayIn).r;
		if(1-Color.a >= 0.99f) break;
		rayIn += rayDir*1.0f/256;
	}
	Color.a = 1.0f;
	
    */

    //fragColor = vec4(1,0,0,1);
    //vec2 windowSize = vec2(800,600);
    //vec2 coord = (gl_FragCoord.xy) / windowSize;
    
}
