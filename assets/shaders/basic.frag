#version 330 core
// Vertex color (interpolated/fragment)
in vec3 vPos;
in vec3 vColor;

// Uniforms
uniform vec3 eye; 

// Fragment Color
out vec4 FragColor;

struct Intersection{
	vec3 normal;
	vec3 color;
	vec3 reflectance;
	float t;
};

struct Plane{
	vec3 center;
	
};


Intersection intRay(in vec3 rayDir){
	Intersection aux;

	return aux;
};

//void setGeometry(){
	// Ri = [xi, yi, zi] = [x0 + xd * ti ,  y0 + yd * ti,  z0 + zd * ti]

//}

void main(){

	//setGeometry();
	vec3 rayDir = vec3(vPos - eye);
	int bounces = 1;
	for(int i=0;i<bounces;i++){
		// Intersectas el rayo contra toda la geometría
		Intersection I = intRay(rayDir);
		//rayDir se actualiza al final;
	}
    FragColor = vec4(vColor,1.0f);
}