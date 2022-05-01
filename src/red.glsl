#version 300 es
 
precision highp float;

uniform float red;
out vec4 outColor;

void main() {
  outColor = vec4(red, 0.5, 0.3, 1.0);
}
