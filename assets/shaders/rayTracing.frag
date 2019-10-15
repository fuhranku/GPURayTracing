#version 330 core
// Vertex color (interpolated/fragment)
in vec3 vPos;

// Uniforms 
uniform mat4 invVP;
uniform vec3 eye;
uniform vec2 windowSize;

// Fragment Color
out vec4 fragColor;

// Sc : Sphere center / Rp: Ray point / Rd: Ray direction
vec4 intersectSphere(vec3 Sc, vec3 Rp, vec3 Rd) {

	//Ri = [xi, yi, zi] = [x0 + xd * ti ,  y0 + yd * ti,  z0 + zd * ti]
	// Ecuación del rayo
	// R(t) = R0 + t * Rd 
	// R0 : eye -
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
		return vec4(0.0f,0.0f,0.0f,1.0f);
	else
		return vec4(1.0f,0.0f,0.0f,1.0f);
	//FOR FURTHER COMPUTATION
	//	// Compute t1
	//	float t1 = (-B + pow((B*B - 4*C),0.5)) / 2;
	//	// Intersection point
	//	vec3 Ri = vec3(Rp.x + Rd.x * t1, Rp.y + Rd.y * t1, Rp.z + Rd.z * t1);
	// Obtengo la normal (vector del centro al punto de int)
	// 

}



void main()
{

    vec3 sphereCenter = vec3(0,0,-3.0f);

   // vec3 sphereWorld = (invVP * vec4(sphereCenter,1)).xyz;



//    vec3 planeWorld = (invVP * vec4(coord,1,1)).xyz;

    vec3 rayDir = normalize(vPos - eye);

    fragColor = intersectSphere(sphereCenter, eye, rayDir);

	//fragColor = vec4(vPos,1.0f);

    
}
