#version 330 core
// Vertex color (interpolated/fragment)
in vec3 vPos;
in mat4 mvp;

// Uniforms 
uniform vec3 cameraPos;
uniform vec2 windowSize;

// Fragment Color
out vec4 fragColor;

// Sc : Sphere center / Rp: Ray point / Rd: Ray direction
bool intersectSphere(vec3 Sc, vec3 Rp, vec3 Rd, out float distance) {

	//Ri = [xi, yi, zi] = [x0 + xd * ti ,  y0 + yd * ti,  z0 + zd * ti]
	// Ecuación del rayo
	// R(t) = R0 + t * Rd 
	// R0 : cameraPos -
	// t  : es el lugar en donde se está en el rayo
	// Rd : Dirección del rayo -> rayDirection
	// B = 2 * (Xd * (X0 - Xc) + Yd * (Y0 - Yc) + Zd * (Z0 - Zc))
	// C = (X0 - Xc)^2 + (Y0 - Yc)^2 + (Z0 - Zc)^2 - Sr^2
	//t1 = (- B + (B^2 - 4*C) ^ 1/2) / 2 donde t0 es para el caso (-) y t1 para el (+)

	// Sphere radius
	float Sr = 0.5f;
	float X0XC = Rp.x - Sc.x;
	float Y0YC = Rp.y - Sc.y;
	float Z0ZC = Rp.z - Sc.z;
	// Compute B
	float B = 2 * (Rd.x * X0XC + Rd.y * Y0YC  + Rd.z * Z0ZC);
	// Compute C
	float C = X0XC*X0XC + Y0YC*Y0YC + Z0ZC*Z0ZC - Sr*Sr;
	// Determine if there's an intersection
	float det = B*B - 4*C;
	if (det < 0.0f)
		return false;
	else
		return true;
	//FOR FURTHER COMPUTATION
	//	// Compute t1
	//	float t1 = (-B + pow((B*B - 4*C),0.5)) / 2;
	//	// Intersection point
	//	vec3 Ri = vec3(Rp.x + Rd.x * t1, Rp.y + Rd.y * t1, Rp.z + Rd.z * t1);
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
