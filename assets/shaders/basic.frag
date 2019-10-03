#version 330 core
// Vertex color (interpolated/fragment)
in vec3 vColor;

// Fragment Color
out vec4 FragColor;

void main()
{
    FragColor = vec4(vColor,1.0f);
}