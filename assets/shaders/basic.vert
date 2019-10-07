#version 330 core
// Atributte 0 of the vertex
layout (location = 0) in vec3 vertexPosition;
// Atributte 1 of the vertex
layout (location = 1) in vec3 vertexColor;

// Vertex data out data
out vec3 vPos;
out vec3 vColor;
out vec2 texCoords;

void main()
{
	vColor = vertexColor;
    vPos = vertexPosition;
    gl_Position = vec4(vertexPosition, 1.0f);
}