#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

// 二维数组
layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    // lut_tex_size.y是纹理的高度，对应的是Lut全部块数的长度
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba;
    
    // texture(color_grading_lut_texture_sampler, uv)

    //out_color = color;

    // b [0-1] 映射到 LUT的块[0-15](假设有16块)

    highp float b = color.b * _COLORS;
    highp float left = ceil(b);
    highp float right = floor(b);
    highp vec4 color1 = texture(color_grading_lut_texture_sampler, vec2((left + color.r) / _COLORS, color.g));
    highp vec4 color2 = texture(color_grading_lut_texture_sampler, vec2((right + color.r) / _COLORS, color.g));

    out_color = mix(color1, color2, b - left);
}
