/* 
 * MIT License
 * 
 * Copyright (c) 2022 Nolonar
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//=============================================================================
// Metadata
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 添加雾天气效果。
 * @author Nolonar
 * @url https://github.com/Nolonar/RM_Plugins
 * 
 * 
 * @command fog
 * @text 添加雾
 * @desc 为当前天气添加雾。
 * 
 * @arg intensity
 * @text 强度
 * @desc 雾的强度。0 = 不可见。1 = 强烈。或者更高的值。不推荐使用负值。
 * @type number
 * @decimals 3
 * @default 0.75
 * 
 * @arg fadeInDuration
 * @text 淡入持续时间
 * @desc 雾出现的时间（帧）。
 * @type number
 * @min 0
 * @default 60
 * 
 * @arg isWait
 * @text 等待完成
 * @desc 如果打开，事件将等到雾达到最大强度后再继续。
 * @type boolean
 * @default true
 * @on 打开
 * @off 关闭
 * 
 * @arg color
 * @text 颜色
 * @desc 雾的颜色。支持 CSS 颜色: https://www.w3schools.com/colors/default.asp
 * @type string
 * @default white
 * 
 * 
 * @command removeFog
 * @text 清除雾
 * @desc 清除当前天气的雾
 * 
 * @arg fadeOutDuration
 * @text 淡出持续时间
 * @desc 雾消失的时间（帧）。
 * @type number
 * @min 0
 * @default 60
 * 
 * @arg isWait
 * @text 等待完成
 * @desc 如果打开，事件将等到雾完全消失后再恢复。
 * @type boolean
 * @default true
 * @on 打开
 * @off 关闭
 * 
 * 
 * 
 * @param fogQuality
 * @text 雾品质
 * @desc 雾的品质(1-8)。较高的值会提高质量，但可能会降低性能。
 * @type number
 * @min 1
 * @max 8
 * @default 4
 * 
 * @param fogSpeed
 * @text 雾速
 * @desc 雾移动的速度。如果为0，则雾根本不会移动。
 * @type number
 * @min 0
 * @decimals 3
 * @default 0.25
 * 
 * @param xScale
 * @text X缩放
 * @desc 雾图在水平方向上的缩放。较高的值会使雾看起来更加分散。
 * @type number
 * @min 1
 * @default 400
 * 
 * @param yScale
 * @text Y缩放
 * @desc 雾图在垂直方向上的缩放。较高的值会使雾看起来更加分散。
 * @type number
 * @min 1
 * @default 150
 * 
 * 
 * @help Version 1.4.3
 * ============================================================================
 * 备注标签
 * ============================================================================
 * 地图备注标签:
 *      <noFog>
 *                  禁止该地图出现雾气效果。
 *                  可用于室内室外场景切换。
 * 
 *      <fog: [强度] [颜色]>
 *                 雾在该地图上始终出现。
 *                 地图标签的优先级在插件指令之上。
 * 
 *                  [强度]:
 *                          雾的强度。 0 = 不可见，
 *                          1 = 强烈。或更高的值。不推荐使用负值。
 * 
 *                  [颜色]: (可选)
 *                          雾的颜色。支持CSS颜色:
 *                          https://www.w3schools.com/colors/default.asp
 *                          默认颜色为白色。
 * 
 *                  例子:
 *                      <fog: 0.3>
 *                          地图总是有强度为0.3的白雾。
 * 
 *                      <fog: 0.6 red>
 *                          地图总是有强度为0.6的红雾。
 * 
 *                      <fog: 0.4 #00FF00>
 *                          地图总是有强度为0.4的绿色雾。
 * 
 *                      <fog: 0.1 rgb(0, 0, 255)>
 *                          地图总是有强度为0.1的蓝色雾。
 * 
 * 
 * ============================================================================
 * 插件命令
 * ============================================================================
 * fog [强度] [淡入淡出持续时间] [等待] [颜色]
 *      为当前天气添加雾。
 * 
 *          [强度]: 雾的强度。 0 = 不可见，1 = 强烈。
 *                  或更高的值。不推荐使用负值。
 * 
 *   [淡入持续时间]: 雾出现的时间（帧）。
 *                   必须大于或等于0。
 * 
 *     [等待]:      如果为true, 事件将在继续之前等待[淡入持续时间] 
 *                  在那之前，玩家将无法移动。
 *                  如果为false,则事件将在雾出现时继续。
 *                  玩家可以同时移动。
 * 
 *     [颜色]: (可选)
 *                  雾的颜色。支持CSS颜色：
 *                  https://www.w3schools.com/colors/default.asp
 *                  默认颜色为白色。
 * 
 *     例子:
 *          fog 0.75 60 true
 *                  创建一个浓密的白雾，需要60帧（1秒）才能达到最大强度。
 *                  事件将在之后恢复。在此期间玩家无法移动。
 * 
 *          fog 0.3 600 false
 *                  创建需要600帧（10秒）才能达到最大强度的浅白色雾。
 *                  当雾越来越大时，该事件将继续进行。
 *                  同时，玩家可以移动。
 * 
 *          fog 0.3 0 false #FF0000
 *                  立即制造出淡红色的雾气。
 * 
 *          fog 0.6 0 false green
 *                  立即制造出浓浓的绿色雾气。
 * 
 *          fog 0.3 0 false rgb(0, 0, 255)
 *                  立即制造出淡蓝色的雾气。
 * 
 * 
 * removeFog [淡出持续时间] [等待]
 *      消除当前天气的雾气。
 * 
 *     [淡出持续时间]: 雾消失的时间（帧）。
 *                     必须大于或等于 0。
 * 
 *     [等待]:      如果为true, 事件将在继续之前等待[淡出持续时间] 
 *                  在那之前，玩家将无法移动。
 *                  如果为false,则事件将在雾出现时继续。
 *                  玩家可以同时移动。
 * 
 *     例子:
 *          removeFog 60 true
 *                  在60帧（1 秒）内消除雾。 
 *                  事件将在之后恢复。在此期间玩家无法移动。
 * 
 *          removeFog 600 false
 *                  在600帧（10 秒）内消除雾。
 *                  雾消失后，事件将继续进行。 
 *                  玩家可以在这段时间内移动。
 * 
 * 
 * 注意:
 * 将玩家速度设置为非整数数字(例如4.5而不是4或5),
 *  时存在一个已知错误，雾会随着玩家移动。
 * 
 */

(() => {
    const PLUGIN_NAME = "N_WeatherFog";

    const PLUGIN_COMMANDS = {
        ADD: "fog",
        REMOVE: "removeFog"
    };
    const METATAGS = {
        FOG_ON: "fog",
        FOG_OFF: "noFog"
    };

    const parameters = PluginManager.parameters(PLUGIN_NAME);
    parameters.fogQuality = Math.floor(Number(parameters.fogQuality)) || 4;
    parameters.fogSpeed = parameters.fogSpeed === "0" ? 0 : (Number(parameters.fogSpeed) || 2);
    parameters.xScale = Number(parameters.xScale) || 400;
    parameters.yScale = Number(parameters.yScale) || 150;

    const isPIXIv4 = PIXI.VERSION.split(".")[0] === "4"; // MV compatibility

    function parseCSSColor(colorString, defaultColor) {
        const div = document.createElement("div");
        div.style.display = "none";
        div.style.color = defaultColor; //If colorString is invalid, this color will be used.
        div.style.color = colorString || defaultColor; // Empty string defaults to black.
        document.body.appendChild(div); // Required for getComputedStyle()
        const result = getComputedStyle(div).color.match(/[\.\d]+/g).slice(0, 3).map(v => Number(v) / 255);
        div.remove();

        return result;
    }

    function getMetaTag() {
        const tag = $dataMap ? Object.values(METATAGS).find(t => t in $dataMap.meta) : null;
        return tag ? [tag, $dataMap.meta[tag]] : null;
    }

    const MetaCommands = {
        [METATAGS.FOG_ON]: (meta) => {
            const targetColor = fog.targetColor.slice(0, 3);

            const args = meta.trim().replace(/\s+/g, " ").split(" ");
            const intensity = Number(args[0]);
            const color = args[1] ? parseCSSColor(args.slice(1)) : targetColor;

            return color.concat(intensity || targetColor[3]);
        },
        [METATAGS.FOG_OFF]: () => fog.targetColor.slice(0, 3).concat(0)
    };

    //=============================================================================
    // Plugin commands
    //=============================================================================
    // CANNOT be an anonymous arrow function, because it requires the correct
    // Game_Interpreter context when passed through PluginManager.registerCommand()
    function executeAddFogPluginCommand(args) {
        const intensity = args.intensity === "0" ? 0 : (Number(args.intensity) || 0.75);
        const color = parseCSSColor(args.color, "white");
        const fadeInDuration = args.fadeInDuration === "0" ? 0 : (Number(args.fadeInDuration) || 60);
        const isWait = args.isWait !== "false";

        addFog(color.concat(intensity), fadeInDuration);
        if (isWait) {
            this.wait(fadeInDuration);
        }
    };

    function executeRemoveFogPluginCommand(args) {
        const fadeInDuration = args.fadeInDuration === "0" ? 0 : (Number(args.fadeInDuration) || 60);
        const isWait = args.isWait !== "false";

        removeFog(fadeInDuration);
        if (isWait) {
            this.wait(fadeInDuration);
        }
    }

    if (PluginManager.registerCommand) {
        // RPG Maker MZ
        PluginManager.registerCommand(PLUGIN_NAME, PLUGIN_COMMANDS.ADD, executeAddFogPluginCommand);
        PluginManager.registerCommand(PLUGIN_NAME, PLUGIN_COMMANDS.REMOVE, executeRemoveFogPluginCommand);
    } else {
        // RPG Maker MV
        const MvPluginCommands = {
            [PLUGIN_COMMANDS.ADD.toLowerCase()]: function (args) {
                executeAddFogPluginCommand.call(this, {
                    intensity: args[0],
                    fadeInDuration: args[1],
                    isWait: args[2],
                    color: args.slice(3).join("")
                });
            },
            [PLUGIN_COMMANDS.REMOVE.toLowerCase()]: function (args) {
                executeRemoveFogPluginCommand.call(this, {
                    fadeInDuration: args[0],
                    isWait: args[1]
                });
            }
        };

        const Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
        Game_Interpreter.prototype.pluginCommand = function (command, args) {
            const cmd = command.toLowerCase();
            if (cmd in MvPluginCommands) {
                MvPluginCommands[cmd].call(this, args);
            } else {
                Game_Interpreter_pluginCommand.call(this, command, args);
            }
        };
    }

    //=============================================================================
    // Scene_GameEnd
    //=============================================================================
    const Scene_GameEnd_commandToTitle = Scene_GameEnd.prototype.commandToTitle;
    Scene_GameEnd.prototype.commandToTitle = function () {
        $gameScreen.clearWeather();
        Scene_GameEnd_commandToTitle.call(this);
    };

    //=============================================================================
    // Main code
    //=============================================================================
    function addFog(color, duration) {
        fog.targetColor = color;
        fog.fadeDuration = duration;
    }

    function removeFog(duration) {
        fog.targetColor = fog.targetColor.slice(0, 3).concat(0);
        fog.fadeDuration = duration || 0;
    }

    const Game_Screen_clearWeather = Game_Screen.prototype.clearWeather;
    Game_Screen.prototype.clearWeather = function () {
        Game_Screen_clearWeather.call(this);
        removeFog();
    }

    Weather = class Weather_Ext extends Weather {
        get mapSpriteset() { return SceneManager._scene._spriteset; }
        get originDelta() {
            return {
                x: this.origin.x - this.previousOrigin.x,
                y: this.origin.y - this.previousOrigin.y
            };
        }

        _updateAllSprites() {
            super._updateAllSprites();
            this.updateFog();
        }

        updateFog() {
            if (!this.mapSpriteset) {
                return;
            }
            if (!this.previousOrigin) {
                this.rememberOrigin();
            }

            this.updateFogUniforms();
            this.rememberOrigin();

            const filters = this.mapSpriteset.filters;
            if (!fog.isActive) {
                if (filters) {
                    // PIXI.DisplayObject.filters is immutable in v4
                    this.mapSpriteset.filters = filters.filter(f => f !== fog.filter);
                }
            } else if (!filters) {
                // PIXI.DisplayObject.filters is immutable in v4
                this.mapSpriteset.filters = [fog.filter];
            } else if (!filters.some(f => f === fog.filter)) {
                // PIXI.DisplayObject.filters is immutable in v4
                this.mapSpriteset.filters = filters.concat([fog.filter]);
            }
        }

        updateFogUniforms() {
            const posDelta = this.correctOriginDelta(this.originDelta);
            if (Utils.RPGMAKER_NAME == "MV") {
                posDelta.y *= -1; // TODO: investigate why y-coordinate needs to be inverted for RPG Maker MV.
            }

            fog.uniforms.uTime = performance.now() / 1000 * parameters.fogSpeed;
            fog.uniforms.uOrigin.x += posDelta.x;
            fog.uniforms.uOrigin.y += posDelta.y;
            fog.uniforms.uBaseColor = this.getFogColor();
        }

        getFogColor() {
            const metaTag = getMetaTag();
            if (metaTag !== null) {
                return MetaCommands[metaTag[0]](metaTag[1]);
            }

            const t = fog.targetColor;
            if (fog.fadeDuration === 0) {
                return t;
            }

            const d = fog.fadeDuration--;
            const b = fog.uniforms.uBaseColor;
            return t.map((v, i) => (b[i] * (d - 1) + v) / d);
        }

        rememberOrigin() {
            this.previousOrigin = {
                x: this.origin.x,
                y: this.origin.y
            };
        }

        correctOriginDelta(posDelta) {
            const tilemap = this.mapSpriteset._tilemap;
            const scale = {
                // RPG Maker MV's NWJS does not support optional chaining operator
                x: tilemap ? tilemap._tileWidth : null,
                y: tilemap ? tilemap._tileHeight : null
            }
            for (const axis of ["x", "y"]) {
                const dpf = $gamePlayer.distancePerFrame() * scale[axis];
                const getCorrectDelta = d => d > dpf ? -dpf : d < -dpf ? dpf : d;
                posDelta[axis] = getCorrectDelta(posDelta[axis]);
            }

            return posDelta;
        }
    }

    const fog = new class WeatherFog {
        get uniforms() { return this.filter.uniforms; }
        get _data() {
            if (!$gameScreen) {
                return this.defaultData;
            }

            if (!$gameScreen[PLUGIN_NAME]) {
                $gameScreen[PLUGIN_NAME] = this.defaultData;
            }

            return $gameScreen[PLUGIN_NAME];
        }

        get targetColor() {
            let result = this._data.targetColor;
            if (!result) { // Backwards-compatibility with v1.3.4
                result = this.defaultData.targetColor;
                result[3] = this._data.targetIntensity;
                this._data.targetColor = result;
            }
            return result;
        }
        set targetColor(color) {
            this._data.targetIntensity = color[3]; // Backwards-compatibility with v1.3.4
            this._data.targetColor = color;
        }

        get fadeDuration() { return this._data.fadeDuration; }
        set fadeDuration(duration) { this._data.fadeDuration = duration; }

        constructor() {
            this.filter = new PIXI.Filter(null, this.fragment, this.defaultUniformsData);
        }

        get defaultData() {
            return {
                fadeDuration: 0,
                targetColor: [1, 1, 1, 0]
            };
        }

        get defaultUniformsData() {
            const result = {
                uTime: 0,
                uOrigin: {
                    x: 0,
                    y: 0
                },
                uBaseColor: [1, 1, 1, 0]
            };

            // Uniforms are defined differently in PIXIv4 compared to PIXIv5
            if (isPIXIv4) {
                result.uTime = {
                    type: "float",
                    value: result.uTime
                };
                result.uOrigin = {
                    type: "vec2",
                    value: result.uOrigin
                };
                result.uBaseColor = {
                    type: "vec4",
                    value: result.uBaseColor
                };
            }

            return result;
        }

        get isActive() {
            return !!this.uniforms.uBaseColor[3];
        }

        get fragment() {
            // Perlin noise shader implementation taken from
            // https://observablehq.com/@mbostock/perlin-noise/2
            return `precision highp float;

            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;

            uniform float uTime;
            uniform vec2 uOrigin;
            uniform vec4 uBaseColor;

            const int octaves = ${parameters.fogQuality};
            const vec2 noiseScale = vec2(${parameters.xScale}, ${parameters.yScale});

            vec4 permute(vec4 x) {
                return mod((x * 34.0 + 1.0) * x, 289.0);
            }

            vec4 taylorInvSqrt(vec4 r) {
                return 1.79284291400159 - 0.85373472095314 * r;
            }

            float snoise(vec3 v) {
                const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i = floor(v + dot(v, C.yyy));
                vec3 x0 = v - i + dot(i, C.xxx);
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min(g.xyz, l.zxy);
                vec3 i2 = max(g.xyz, l.zxy);
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod(i, 289.0);
                vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                vec3 ns = D.wyz / 7.0 - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_);
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                vec4 s0 = floor(b0) * 2.0 + 1.0;
                vec4 s1 = floor(b1) * 2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
                m *= m;
                return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
            }

            float onoise(vec3 v) {
                float total = 0.0;
                float frequency = 1.0;
                float amplitude = 1.0;
                float maxValue = 0.0;
                for (int i = 0; i < octaves; i++) {
                    total += snoise(v * frequency) * amplitude;
                    maxValue += amplitude;
                    amplitude *= 0.5;
                    frequency *= 2.0;
                }
                return total / maxValue;
            }

            void main() {
                vec4 sample = texture2D(uSampler, vTextureCoord);
                vec2 coord = gl_FragCoord.xy + uOrigin;

                float noise = uBaseColor.a * (onoise(vec3(coord / noiseScale, uTime)) + 1.0) / 2.0;
                vec4 x = vec4(uBaseColor.rgb * noise, 1.0);

                gl_FragColor = sample * (1.0 - noise) + vec4(uBaseColor.rgb, 1.0) * noise;
            }`;
        }
    }();
})();