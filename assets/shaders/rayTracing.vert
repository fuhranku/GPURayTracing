#version 330 core
// Atributte 0 of the vertex
layout (location = 0) in vec3 vertexPosition;

// Uniforms
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out mat4 mvp;


// Vertex data out data
out vec3 vPos;

void main()
{
    mvp = projection * view * model;
    vPos = (vertexPosition + 1)/2;
    gl_Position =  /*mvp */vec4(vertexPosition, 1.0f);
}