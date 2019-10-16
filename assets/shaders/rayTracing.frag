#version 330 core
// Vertex color (interpolated/fragment)
in vec3 vPos;
in mat4 ivp;

// Uniforms 
uniform mat4 invVP;
uniform vec3 eye;
uniform vec2 windowSize;

// Sphere
struct Sphere{
	vec3 normal;
	vec3 center;
	vec3 diffuse;
	vec3 specular;
	float radius;
};

struct Plane{
	vec3 n;
	vec3 p0;
	vec3 diffuse;
	vec3 specular;
};

struct Intersect{
	vec3 pos;
	vec3 normal;
	vec3 diffuse;
	vec3 specular;
	float t;
};

// Models
Plane plane[6];
Sphere sphere[2];

// Fragment Color
out vec4 fragColor;

// Point light
vec3 lightPos = vec3(0.0f,5.0f,0.0f);

// Create scene function
void createScene(){
	// Init planes:
		// Normal - p0 - diffuse - spec
		// Left-side wall
		plane[0] = Plane(vec3(1.0f,0.0f,0.0f),vec3(-20.0f,0.0f,0.0f),vec3(1.0f,1.0f,1.0f),vec3(0.0f,1.0f,1.0f));
		// Right-side wall
		plane[1] = Plane(vec3(-1.0f,0.0f,0.0f),vec3(20.0f,0.0f,0.0f),vec3(1.0f,1.0f,1.0f),vec3(0.0f,1.0f,1.0f));
		// front-side wall
		plane[2] = Plane(vec3(0.0f,0.0f,1.0f),vec3(0.0f,0.0f,-20.0f),vec3(1.0f,1.0f,1.0f),vec3(0.0f,1.0f,1.0f));
		// Top-side wall
		plane[3] = Plane(vec3(0.0f,-1.0f,0.0f),vec3(0.0f,10.0f,0.0f),vec3(1.0f,1.0f,1.0f),vec3(0.0f,1.0f,1.0f));
		// Bottom-side wall
		plane[4] = Plane(vec3(0.0f,1.0f,0.0f),vec3(0.0f,-10.0f,0.0f),vec3(1.0f,1.0f,1.0f),vec3(0.0f,1.0f,1.0f));
		// Back-side wall
		plane[5] = Plane(vec3(0.0f,0.0f,1.0f),vec3(0.0f,0.0f,20.0f),vec3(1.0f,1.0f,1.0f),vec3(0.0f,1.0f,1.0f));
	// Init spheres:
		// Normal - center - diffuse - specular - radius
		sphere[0] = Sphere(vec3(0.0f,0.0f,0.0f),vec3(-2.5f,0,-3.0f), vec3(1.0f,0.0f,0.0f),vec3(0.0f,1.0f,0.0f),1.5f);
		sphere[1] = Sphere(vec3(0.0f,0.0f,0.0f),vec3(2.5f,0,-3.0f), vec3(0.0f,0.0f,1.0f),vec3(1.0f,0.0f,0.0f),1.0f);
}


// Sc : Sphere center / Rp: Ray point / Rd: Ray direction
Intersect intersectSphere(vec3 Rp, vec3 Rd, Sphere sphere){
	// Sphere radius
	float X0XC = Rp.x - sphere.center.x;
	float Y0YC = Rp.y - sphere.center.y;
	float Z0ZC = Rp.z - sphere.center.z;
	// Compute B
	float B = 2 * (Rd.x * X0XC + Rd.y * Y0YC  + Rd.z * Z0ZC);
	// Compute C
	float C = X0XC*X0XC + Y0YC*Y0YC + Z0ZC*Z0ZC - sphere.radius*sphere.radius;
	// Determine if there's an intersection by using determinant
	float det = B*B - 4*C;
	if (det < 0.0f)
		return Intersect(vec3(0.0f,0.0f,100.0f),vec3(0.0f,0.0f,0.0f),vec3(0.0f,0.0f,0.0f),vec3(0.0f,0.0f,100.0f),10000f);
	else{
		// Compute t
		float t0 = (-B - pow(det,0.5f)) / 2;
		// Intersection point
		vec3 Ri = Rp + Rd*t0;
		// Compute sphere normal
		vec3 normal = normalize(Ri - sphere.center);
		sphere.normal = normal;
		return Intersect(Ri,sphere.normal,sphere.diffuse,sphere.specular,t0);
	}

}

Intersect intersectPlane(vec3 Rp, vec3 Rd, Plane plane){
	// P0: plane's point
	// n : plane's normal
	// Determine if given point p is on plane: (p-p0) . n = 0
	float t = dot((plane.p0 - Rp),plane.n) / dot(Rd,plane.n);
	// There's an intersection with the plane if t >= 0
	if (t < 0.0f)
		return Intersect(vec3(0.0f,0.0f,100.0f),vec3(0.0f,0.0f,0.0f),plane.diffuse,plane.specular,10000f);
	else{
		vec3 Ri = Rp + Rd*t;
		return Intersect(Ri,plane.n,plane.diffuse,plane.specular,t);
	}
}

Intersect cast1stRay(vec3 Rp, vec3 Rd){
	// Compare against all planes
	Intersect mi, ret;
	ret.t = 10000f;
	for (int i=0;i<6;i++){
		mi = intersectPlane(Rp,Rd,plane[i]);
		if (mi.t < ret.t) 
			ret = mi;
	}
	// Compare against all spheres
	for (int i=0;i<2;i++){
		mi = intersectSphere(Rp,Rd,sphere[i]);
		if (mi.t < ret.t)
			ret = mi;
	}
	return ret;
}

float shadowRay(vec3 Rp, vec3 Rd){
	Intersect mi;
	// Compare against all spheres
	for (int i=0;i<2;i++){
		mi = intersectSphere(Rp,Rd,sphere[i]);
		if (mi.t != 10000f)
			return 0.0f;
	}
	return 1.0f;
}

void main(){
    vec3 rayDir = normalize(vPos - eye);
	// Creating scene
	createScene();
	//Intersect intersect = intersectSphere(sphereCenter, eye, rayDir);
	Intersect intersect = cast1stRay(eye,rayDir);
	float shadow = shadowRay(intersect.pos + intersect.normal*0.01f,normalize(lightPos-intersect.pos));
	// Attenuation
//    float distance    = length(lightPos - intersect.pos);
//    float attenuation = 1.0 / (0.5f + 0.8f * distance + 
//                        0.4f * (distance * distance)); 
	// Blinn Phong
		vec3 lightDir = normalize(lightPos - intersect.pos);
		// Diffuse component (LAMBERT)
		float diff = clamp(dot(intersect.normal,lightDir),0.0f,1.0f);
		// Specular component
		vec3 halfwayDir = normalize(lightDir+rayDir);
		float spec = pow(clamp(dot(intersect.normal,halfwayDir),0.0f,1.0f),2.0f);
	// Diffuse contribution
	vec3 diffuse = intersect.diffuse * diff;
	// Specular contribution
	vec3 specular = intersect.specular * spec;

	vec3 result = (diffuse + specular) * shadow;
    fragColor = vec4(result,1.0f);

	//fragColor = vec4(vPos,1.0f);
}
