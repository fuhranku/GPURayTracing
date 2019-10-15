#version 330 core
// Atributte 0 of the vertex
layout (location = 0) in vec3 vertexPosition;

// Vertex data out data
out vec3 vPos;
uniform mat4 invVP;

void main()
{
    vPos = (invVP * vec4(vertexPosition,1.0f)).xyz;
    gl_Position =  vec4(vertexPosition, 1.0f);
}