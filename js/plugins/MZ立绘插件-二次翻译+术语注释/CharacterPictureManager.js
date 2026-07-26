//=============================================================================
// CharacterPictureManager.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 3.13.0 2023/05/06 行動中条件、入力中条件の立ち絵は、戦闘中以外では常に条件を満たすよう仕様変更
// 3.12.0 2023/04/09 カスタムメニュープラグインで作成した画面に立ち絵を表示するとき、単一アクターのカスタムメニューなら立ち絵も単一表示になるよう修正
// 3.11.0 2022/12/30 アクターがコマンド入力中のみ立ち絵を表示する機能を追加
// 3.10.0 2022/12/22 フロントビュー採用時、戦闘アニメの表示対象を立ち絵にできる機能を追加
//                   パラメータ「原点」の設定が正常に動作していなかった問題を修正
// 3.9.0 2022/11/10 ショップ画面と装備画面において装備を選んだ時点で立ち絵に反映できる機能を追加
// 3.8.1 2022/11/06 ヘルプの記述を修正
// 3.8.0 2022/10/22 立ち絵の更新を手動(スイッチ)で行える機能を追加
// 3.7.0 2022/10/20 パフォーマンス対策
// 3.6.0 2022/10/08 立ち絵の表示条件にメッセージ表示中かどうかと変数による判定を追加
// 3.5.0 2022/09/11 基準座標が取得できないメンバーがいた場合にエラーになる問題を修正
// 3.4.0 2022/09/07 現在のシーンによって表示する立ち絵画像を出し分けられる機能を追加
// 3.3.0 2022/04/21 シーン設定のパラメータにもタッチスイッチ設定を追加
//                  タッチスイッチ有効時は、他のタッチ処理を無効化するよう変更
// 3.2.0 2022/04/18 タッチ時に任意のスイッチをONにできる機能を追加
// 3.1.0 2022/02/08 立ち絵のフェードイン・アウト機能、アンフォーカス機能、反転表示切替機能を追加
// 3.0.0 2022/01/22 バトラーのモーションに合わせた立ち絵を指定できる機能を追加(パラメータ：ダメージ条件は廃止)
//                  表示座標をパーティメンバーの並び順ではなく、アクターIDごとに設定できる機能を追加
// 2.7.0 2022/01/16 画像ごとにシェイクの対象外にできるオプションを追加
// 2.6.1 2022/01/06 立ち絵リストを空にすると動的ファイル名が参照されなくなる問題を修正
// 2.6.0 2021/12/01 任意のスイッチをトリガーに立ち絵のシェイクできる機能を追加
//                  立ち絵のシェイク時にシェイク方向を指定できる機能を追加
// 2.5.0 2021/11/22 ダメージを受けたときに立ち絵を自動で振動させる機能を追加
// 2.4.2 2021/08/08 APNGピクチャを立ち絵に使用したとき、シーン遷移するとエラーになる場合がある問題を修正
// 2.4.1 2021/05/28 2.3.2の修正によりAPNGピクチャプラグインと連携するとAPNGピクチャ以外が立ち絵として表示できなくなっていた問題を修正
// 2.4.0 2021/05/20 立ち絵の座標に制御文字を使ったとき、変数の変更が即座に反映されるよう修正
// 2.3.2 2021/04/26 ヘルプの記述を修正
//                  APNGピクチャプラグインとの連携でGIFファイルを使用できなかった問題を修正
// 2.3.1 2021/04/06 拡大率をシーン単位で設定できる機能を追加
// 2.3.0 2021/04/06 立ち絵に拡大率を設定できる機能を追加
// 2.2.2 2021/02/15 アクター登録していないメンバーを表示させようとするとエラーになる問題を修正
// 2.2.1 2021/02/14 パラメータの防具条件のデータベースタイプが武器になっていた問題を修正
// 2.2.0 2021/02/14 スプライトシート形式の表示に対応
//                  ドラッグ機能をベースごと動かせるように修正
// 2.1.0 2021/02/14 立ち絵をドラッグして座標の確認と調整ができる機能を追加
// 2.0.0 2021/02/12 MZ向けに仕様から再設計
// 1.0.0 2016/05/01 タクポンさん依頼版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc 立绘展示管理插件
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CharacterPictureManager.js
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @orderAfter SceneCustomMenu
 * @author トリアコンタン
 *
 * @param PictureList
 * @text 立絵列表
 * @desc 每个角色的立绘列表。多个图像可叠加在单个角色上。(列表下方的优先显示在前面)
 * @default []
 * @type struct<StandPictureActor>[]
 *
 * @param SceneList
 * @text 显示目标场景列表
 * @desc 要显示立绘的场景的列表。每个场景可以设置独立的坐标，同一个场景无法定义多组数据。
 * @default ["{\"SceneName\":\"Scene_Title\",\"MemberPosition\":\"[\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"0\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"150\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"300\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\",\\\"{\\\\\\\"X\\\\\\\":\\\\\\\"450\\\\\\\",\\\\\\\"Y\\\\\\\":\\\\\\\"0\\\\\\\"}\\\"]\",\"ScaleX\":\"100\",\"ScaleY\":\"100\",\"ShowPictureSwitch\":\"0\",\"Mirror\":\"false\",\"Priority\":\"0\"}"]
 * @type struct<Scene>[]
 *
 * @param Origin
 * @text 原点
 * @desc 立绘图像的原点，所有立绘共用该设置，立绘显示战斗动画时会设置为『中央下』。
 * @default 2
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @option 中央下
 * @value 2
 *
 * @param UsePointAdjust
 * @text 使用坐标调整功能
 * @desc 启用后，可以在测试时通过拖动立绘来调整坐标。
 * @default true
 * @type boolean
 *
 * @param ShakeOnDamage
 * @text 受伤时摇晃
 * @desc 启动后，受伤时抖动立绘。
 * @default false
 * @type boolean
 *
 * @param ShakePower
 * @text 震动强度
 * @desc 立绘抖动的幅度。
 * @default 5
 * @type number
 * @min 1
 *
 * @param ShakeSpeed
 * @text 震动速度
 * @desc 立绘抖动的速度。
 * @default 8
 * @type number
 * @min 1
 *
 * @param ShakeDuration
 * @text 震动时间
 * @desc 立绘抖动的时间（帧）。
 * @default 30
 * @type number
 * @min 1
 *
 * @param ShakeRotation
 * @text 震动方向
 * @desc 立绘抖动的方向（0~360）。
 * @default 0
 * @type number
 * @min 0
 * @max 360
 *
 * @param UnFocusPower
 * @text 散焦强度
 * @desc 未选中立绘时的亮度，值越大越暗。
 * @default 68
 * @type number
 * @min -255
 * @max 255
 *
 * @param MenuActorOnly
 * @text 仅显示菜单角色立绘
* @desc 装备、技能、状态、名称页面只显示被选中角色的立绘。
 * @default true
 * @type boolean
 *
 * @param DressUp
 * @text 试衣功能
 * @desc 在商店画面和装备画面中选择装备的时候会反映在立绘上。
 * @default true
 * @type boolean
 *
 * @param UseAnimationTarget
 * @text 目标战斗动画
 * @desc 若前视图（SV）作为立绘，请设置显示优先级为『アニメーションの下（动画下方）』。
 * @default false
 * @type boolean
 *
 * @help CharacterPictureManager.js
 *（翻译 Zeldashu）（二次翻译 沧雾白雨）
 * 可以管理和显示由多个图像构成的立绘。
 * 从插件参数中注册图像和显示条件，以及要显示的场景。
 * 特征如下：
 * ・根据HP余量、状态、装备、职业、开关等条件变化立绘
 * ・战斗中根据行动、伤害等情况切换图像
 * ・使用多个图像制作服装差分和表情差分
 * ・可以在战斗画面、菜单画面、地图画面中使用相同的站立画面
 *
 * 还可以和另一个APNG图片插件结合，让立绘变成动图（如眨眼），但请注意
 * 不要过度使用。
 *
 * ●关于专业术语注释
 * ❶スプライトシート(精灵表)是什么意思
 * "スプライトシート"是一个日语术语，也被称为"精灵表"或"精灵图"。它是一种图像处理技术，用于将多个小图像（称为精灵）组合到单个大图像中。这种技术通常应用于游戏开发中，用于管理和渲染游戏角色、动画和特效。
 * 通过将所有精灵组合到一张图像中，可以减少内存占用和渲染负担，提高游戏性能。游戏引擎可以根据需要从精灵表中提取和显示单个精灵，以创建动画效果或呈现不同的游戏角色状态。
 * 精灵表通常由一个包含多个等大小的图像格子组成的矩形网格构成。每个图像格子对应一个特定的精灵图像。通过使用坐标或索引，游戏引擎可以定位并提取所需的精灵图像。
 * 总而言之，精灵表是一种优化游戏图像资源的技术，用于管理和渲染游戏中的角色、动画和特效。
 * 
 * ❷オペランド（操作值）是什么意思
 * "オペランド"是一个日语词汇，源自英语单词"operand"。它在计算机科学和数学领域中使用，表示进行操作或计算的值或数据。
 * 在计算机编程中，"オペランド"是指参与运算或操作的值或数据。例如，加法运算中的两个加数就是操作数。在算术运算中，加法、减法、乘法和除法的操作数都被称为"オペランド"。同样，在逻辑运算中，参与逻辑比较的值也是"オペランド"。
 * 在数学中，"オペランド"是指进行运算的值。例如，在加法运算中，两个相加的数字就是操作数，也可以被称为"オペランド"。
 * 总而言之，"オペランド"是指在计算机科学和数学中参与运算或操作的值或数据。它可以是进行数学运算、逻辑比较或其他类型的操作所使用的值
 * 
 * ❸列番号 与 行番号 是什么意思
 * "列番号"和"行番号"是日语术语，可以对应为以下英文翻译：
 * "列番号" → "Column number" 或 "Column index"
 * "行番号" → "Row number" 或 "Row index"
 * 在数据表、电子表格或类似的二维数据结构中，"列番号"指的是特定列的索引或标识符。它用于唯一标识表中的每一列，使用户或程序可以准确定位和引用该列的数据。
 * 类似地，"行番号"指的是特定行的索引或标识符。它用于唯一标识表中的每一行，以便用户或程序可以准确地定位和引用该行的数据。
 * 通过使用"列番号"和"行番号"，可以在二维数据结构中方便地引用和操作特定的列和行。这在数据处理、编程和电子表格应用中非常常见，可以帮助定位和处理数据。
 * 
 * 
 * ●通过注释栏指定条件
 * 注释栏的显示条件设为『aaa』时，目标角色的数据库(※)
 * 拥有以下备注字样时，将显示立绘。
 * <StandPicture:aaa>
 * ※适用于角色、职业、武器、防具、状态
 *
 * ●图像坐标指定支持
 * 处于测试模式时，可直接拖拽立绘以查看与调整坐标。
 * 屏幕上会显示参考坐标和原有坐标。
 * 若按住Ctrl，则优先选取底层图片，否则优先选择上面的
 * 若按住Shift，则调整参考坐标，否则调整原有坐标。
 *
 * ●立绘文件动态设置（面向大佬）
 * 若想大量使用立绘图片，可更根据命名规范动态决定文件名。
 * 文件不存在则会报错、自动删除未使用的文件。
 * 非大佬勿碰，容易误删。
 * 根据以下规则转换文件名。
 *
 * {hp:40,60,80}
 * HP比率根据指定阈值转换为指数。
 * 上述例子就被转换为以下数值。
 *   0%-39% 时为:0
 *  40%-59% 时为:1
 *  60%-80% 时为:2
 *  80%-100%时为:3
 *
 * {stateId}
 *  转换为最高优先级的状态ID。
 *  状态栏注释了<NoStandPicture>的话，则无效。
 *
 * {switch:3}
 *  开关3为ON时，转换为1，关闭则转换为0。
 *
 * {variable:4}
 *  转换为变量4的值。
 *
 * {action}
 *  行动中为1，否则为0。
 *
 * {damage}
 *  受伤时为1，否则为0。
 *
 * {note}
 *  转换为数据库注释中设置了<StandPicture>的值。
 *  如注释为<StandPicture:aaa>，则转换为aaa。
 *  适用于角色、职业、武器、护甲和状态。
 *
 * 使用此插件需要前置插件『PluginCommonBase.js』。
 * 『PluginCommonBase.js』在MZ的根目录：
 * 
 * dlc/BasicResources/plugins/official
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

/*~struct~StandPictureActor:
 *
 * @param ActorId
 * @text 角色
 * @desc 要显示立绘的角色ID
 * @default 1
 * @type actor
 *
 * @param Name
 * @text 名称
 * @desc 方便你区分的名称，无实际作用。
 * @default
 *
 * @param Opacity
 * @text 不透明度
 * @desc 立绘的不透明度。
 * @default 255
 * @type number
 * @max 255
 *
 * @param X
 * @text 固有X座標
 * @desc 立绘的X坐标。每个场景的基准坐标相加得到的值是实际的显示坐标。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param Y
 * @text 固有Y座標
 * @desc 立绘的Y坐标。每个场景的基准坐标相加得到的值是实际的显示坐标。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param ScaleX
 * @text X拡大率
 * @desc 立绘的横向放大率。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param ScaleY
 * @text Y拡大率
 * @desc 立绘的纵向放大率。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param OutOfShake
 * @text 不可抖动
 * @desc 该图像不触发立绘抖动。
 * @default false
 * @type boolean
 *
 * @param SpriteSheet
 * @text スプライトシート(精灵表❶)
 * @desc 是否从<SpriteSheet>里面获取立绘图像。专业术语,移步插件介绍查看详情
 * @type struct<SpriteSheet>

 * @param FileList
 * @text 立绘列表
 * @desc 立绘显示的图片以及触发条件，只显示一张符合要求的（列表底部优先）。
 * @default []
 * @type struct<StandPicture>[]
 *
 * @param DynamicFileName
 * @text 动态立绘文件名
 * @desc 动态生成立绘文件名。上面那个选项有符合条件的，以它优先。
 * @default
 * @type combo
 * @option image_{hp:40,60,80}
 * @option image_{stateId}
 * @option image_{switch:1}
 * @option image_{variable:1}
 * @option image_{damage}
 * @option image_{action}
 * @option image_{note}
 *
 * @param ShowPictureSwitch
 * @text 显示开关
 * @desc 若设置，则开关为ON时显示立绘。
 * @default 0
 * @type switch
 *
 * @param UnFocusSwitch
 * @text 散焦开关
 * @desc 若设置，打开开关时立绘变暗。
 * @default 0
 * @type switch
 *
 * @param MirrorSwitch
 * @text 反转开关
 * @desc 若指定，打开开关时立绘反转。
 * @default 0
 * @type switch
 *
 * @param TouchSwitch
 * @text 点击图片触发开关
 * @desc 若指定，可点击图片触发开关，但不会考虑图片透明度。
 * @default 0
 * @type switch
 *
 */

/*~struct~StandPicture:
 *
 * @param FileName
 * @text 文件名
 * @desc 这是立绘文件名
 * @default
 * @type file
 * @dir img/pictures
 *
 * @param HpUpperLimit
 * @text HP条件(上限)
 * @desc 当血量比小于指定值时满足显示条件。 如果指定为 0，则不进行条件判断。
 * @default 0
 * @type number
 * @max 100
 * @min 0
 *
 * @param HpLowerLimit
 * @text HP条件(下限)
 * @desc 当血量百分比大于或等于指定值时，满足显示条件。 如果指定为 0，则不进行条件判断。
 * @default 0
 * @type number
 * @max 100
 * @min 0
 *
 * @param Inputting
 * @text 输入条件
 * @desc 操作者输入命令时满足显示条件。战斗中以外总是满足表示条件。
 * @default false
 * @type boolean
 *
 * @param Action
 * @text 行動中条件
 * @desc 如果演员正在行动，则满足显示条件。在战斗中以外总是满足显示条件。
 * @default false
 * @type boolean
 *
 * @param Motion
 * @text 动作条件
 * @desc 当角色采取指定的动作时，满足显示条件。它也可以在前视图（SV）中运行。战斗以外皆不符合显示条件。
 * @default
 * @type select
 * @option 无
 * @value
 * @option 前进
 * @value walk
 * @option 待机
 * @value wait
 * @option 吟唱待机
 * @value chant
 * @option 防御
 * @value guard
 * @option 受伤
 * @value damage
 * @option 躲闪
 * @value evade
 * @option 刺击
 * @value thrust
 * @option 挥砍
 * @value swing
 * @option 投射物
 * @value missile
 * @option 通用技能
 * @value skill
 * @option 魔法
 * @value spell
 * @option 物品
 * @value item
 * @option 逃跑
 * @value escape
 * @option 胜利
 * @value victory
 * @option 濒死
 * @value dying
 * @option 状态异常
 * @value abnormal
 * @option 睡眠
 * @value sleep
 * @option 战斗不能
 * @value dead
 *
 * @param State
 * @text 状态条件
 * @desc 如果指定的状态有效，则满足显示条件。如果指定0，则不进行条件判断。
 * @default 0
 * @type state
 *
 * @param Weapon
 * @text 武器条件
 * @desc 在配备指定武器时满足显示条件。如果指定0，则不进行条件判断。
 * @default 0
 * @type weapon
 *
 * @param Armor
 * @text 防具条件
 * @desc 配备指定的防具时，符合显示条件。如果指定0，则不进行条件判断。
 * @default 0
 * @type armor
 *
 * @param Scene
 * @text 场景条件
 * @desc 当前场景是所选场景时，满足显示条件。
 * @default none
 * @type select
 * @default
 * @option 无条件
 * @value
 * @option 标题
 * @value Scene_Title
 * @option 地图
 * @value Scene_Map
 * @option 游戏结束
 * @value Scene_Gameover
 * @option 战斗
 * @value Scene_Battle
 * @option 主菜单
 * @value Scene_Menu
 * @option 物品
 * @value Scene_Item
 * @option 技能
 * @value Scene_Skill
 * @option 装备
 * @value Scene_Equip
 * @option 状态
 * @value Scene_Status
 * @option 选项
 * @value Scene_Options
 * @option 保存
 * @value Scene_Save
 * @option 载入
 * @value Scene_Load
 * @option 游戏结束
 * @value Scene_End
 * @option 商店
 * @value Scene_Shop
 * @option 名称输入
 * @value Scene_Name
 * @option 调试
 * @value Scene_Debug
 *
 * @param Note
 * @text 注释栏条件
 * @desc 如果数据库中的注释栏<StandPicture：aaa>等于指定值，则满足显示条件。
 * @default
 *
 * @param Message
 * @text 消息条件
 * @desc 如果指定，则仅在显示消息时满足条件。
 * @default false
 * @type boolean
 *
 * @param Face
 * @text 面部条件
 * @desc 若指定，消息显示时切脸图与角色匹配时满足条件。
 * @default false
 * @type boolean
 *
 * @param Speaker
 * @text スピーカー条件（?）
 * @desc 如果指定，则在消息显示中且消息的名称与角色的名称匹配时满足条件。
 * @default false
 * @type boolean
 *
 * @param Switch
 * @text 开关条件
 * @desc 如果指定的开关打开，则满足显示条件。如果指定0，则不进行条件判断。
 * @default 0
 * @type switch
 *
 * @param Variable
 * @text 変量条件
 * @desc 当指定变量满足条件时，显示条件成立。 分别指定判断类型和操作数。
 * @default 0
 * @type variable
 *
 * @param VariableType
 * @parent Variable
 * @text 判定種別
 * @desc 变量与值的比较方式。 变量值在左侧，操作数在右侧。
 * @default 0
 * @type select
 * @option =(等しい)
 * @value 0
 * @option >=(以上)
 * @value 1
 * @option <=(以下)
 * @value 2
 * @option >(より大きい)
 * @value 3
 * @option <(より小さい)
 * @value 4
 * @option !=(異なる)
 * @value 5
 *
 * @param VariableOperand
 * @parent Variable
 * @text オペランド（操作值❷）
 * @desc 要与变量进行比较的值。 如果要与变量值进行比较，请指定控制字符 \v[n]。
 * @default 0
 * @type number
 * @min -999999999
 *
 * @param Script
 * @text 脚本条件
 * @desc 如果指定的脚本返回true，则满足显示条件。 您可以使用 a 来代指角色对象。
 * @default
 * @type combo
 * @option a.mpRate() < 0.5; // MPが50%以下
 * @option a.tpRate() < 0.5; // TPが50%以下
 *
 */

/*~struct~Scene:
 *
 * @param SceneName
 * @text 目标场景
 * @desc 这是要显示的场景。 如果要针对原场景，直接输入场景类名即可。
 * @type select
 * @default Scene_Battle
 * @option 标题
 * @value Scene_Title
 * @option 地图
 * @value Scene_Map
 * @option 游戏结束
 * @value Scene_Gameover
 * @option 战斗
 * @value Scene_Battle
 * @option 主菜单
 * @value Scene_Menu
 * @option 物品
 * @value Scene_Item
 * @option 技能
 * @value Scene_Skill
 * @option 装备
 * @value Scene_Equip
 * @option 状态
 * @value Scene_Status
 * @option 选项
 * @value Scene_Options
 * @option 保存
 * @value Scene_Save
 * @option 载入
 * @value Scene_Load
 * @option 游戏结束
 * @value Scene_End
 * @option 商店
 * @value Scene_Shop
 * @option 名称输入
 * @value Scene_Name
 * @option 调试
 * @value Scene_Debug
 *
 * @param MemberPosition
 * @text 每个角色的参考坐标
 * @desc 每个角色的立绘基准坐标，只登记队伍里的。
 * @default ["{\"X\":\"0\",\"Y\":\"0\"}","{\"X\":\"150\",\"Y\":\"0\"}","{\"X\":\"300\",\"Y\":\"0\"}","{\"X\":\"450\",\"Y\":\"0\"}"]
 * @type struct<Position>[]
 *
 * @param ActorPosition
 * @text 每个角色的参考坐标
 * @desc 如果想以角色为单位决定基准坐标，请指定这里。如果指定，则优先于每个成员的基准坐标。
 * @default []
 * @type struct<ActorPosition>[]
 *
 * @param ScaleX
 * @text X拡大率
 * @desc 立绘的横向放大率。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param ScaleY
 * @text Y拡大率
 * @desc 立绘的纵向放大率。
 * @default 100
 * @type number
 * @max 1000
 *
 * @param ShowPictureSwitch
 * @text 开关显示
 * @desc 指定时，仅在开关接通时显示立绘。
 * @default 0
 * @type switch
 *
 * @param ShakeSwitch
 * @text 震动开关
 * @desc 打开指定的开关后，立绘会振动。振动后，开关自动关闭。
 * @default 0
 * @type switch
 *
 * @param UnFocusSwitch
 * @text 散焦开关
 * @desc 指定时，开关打开时立绘变暗。
 * @default 0
 * @type switch
 *
 * @param MirrorSwitch
 * @text 反转开关
 * @desc 指定时，开关ON时立绘反转。
 * @default 0
 * @type switch
 *
 * @param TouchSwitch
 * @text 点击图片触发开关
 * @desc 如果指定，触摸和单击图片将打开开关。不考虑图片的透明度。
 * @default 0
 * @type switch
 *
 * @param Priority
 * @text 表示優先度
 * @desc 立绘显示的优先度。
 * @default 0
 * @type select
 * @option 最前面
 * @value 0
 * @option 窗口下
 * @value 1
 * @option 动画下（仅对战斗和地图屏幕有效）
 * @value 2
 *
 * @param FadeFrame
 * @text 淡入淡出时间（帧）
 * @desc 如果指定，则立绘在显示/隐藏时会淡入/淡出。
 * @default 0
 * @type number
 *
 * @param UpdateInterval
 * @text 更新間隔
 * @desc 检测立绘显示条件的更新间隔，量多会卡，请更改。
 * @default 1
 * @type number
 *
 * @param UpdateSwitch
 * @text 更新开关
 * @desc 开关接通时，确认立绘的显示条件。启用此设置后，将禁用每帧的自动更新。
 * @default 0
 * @type switch
 *
 */

/*~struct~Position:
 *
 * @param X
 * @text 基準X座標
 * @desc 立绘图片的基本 X 坐标。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param Y
 * @text 基準Y座標
 * @desc 立绘图片的基本 Y 坐标。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 */

/*~struct~ActorPosition:
 *
 * @param ActorId
 * @text 角色ID
 * @desc 要设置基准坐标的角色ID。
 * @default 1
 * @type actor
 *
 * @param X
 * @text 基準X座標
 * @desc 立绘图片的基本 X 坐标。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 * @param Y
 * @text 基準Y座標
 * @desc 立绘图片的基本 Y 坐标。
 * @default 0
 * @type number
 * @min -9999
 * @max 9999
 *
 */

/*~struct~SpriteSheet:
 *
 * @param MaxColumn
 * @text 列数
 * @desc 精灵表中的总列数（垂直方向）。
 * @default 1
 * @type number
 * @min 1
 *
 * @param MaxRow
 * @text 行数
 * @desc 精灵表中的总行数（水平横方向）。
 * @default 1
 * @type number
 * @min 1
 *
 * @param ColumnNumber
 * @text 列番号(❸)
 * @desc 精灵表中的总列数（垂直方向）。
 * @default 1
 * @type number
 * @min 1
 *
 * @param RowNumber
 * @text 行番号(❸)
 * @desc 切精灵表中的总行数（水平横方向）。
 * @default 1
 * @type number
 * @min 1
 *
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.SceneList) {
        PluginManagerEx.throwError('Parameter[SceneList] is not found. ', script);
    }
    if (!param.PictureList) {
        PluginManagerEx.throwError('Parameter[PictureList] is not found. ', script);
    }
    const usePointAdjust = param.UsePointAdjust && Utils.isOptionValid('test');

    /**
     * 分析立绘参数
     */
    class StandPictureParam {
        setup(actor, scene, index) {
            this._actor = actor;
            this._base = this.findBasePosition(scene, index);
            if (!this._base) {
                return false;
            }
            this._shakeSwitch = scene.ShakeSwitch;
            this._standPictures = param.PictureList.filter(picture => picture.ActorId === actor.actorId());
            this._updateCondition = {
                UpdateInterval: scene.UpdateInterval,
                UpdateSwitch: scene.UpdateSwitch
            }
            if (this._standPictures.length <= 0) {
                return false;
            }
            this._standPictures.forEach(picture => this.setupSceneParam(picture, scene));
            this.createCondition();
            this.updatePictureFiles();
            return true;
        }

        changeActorIfNeed(actor) {
            if (this._actor !== actor) {
                this._actor = actor;
            }
        }

        createCondition() {
            const conditions = [];
            conditions.push(file => !file.HpUpperLimit || file.HpUpperLimit >= this._actor.hpRate() * 100);
            conditions.push(file => !file.HpLowerLimit || file.HpLowerLimit <= this._actor.hpRate() * 100);
            conditions.push(file => !file.Motion || this._actor.isMotionTypeValid(file.Motion));
            conditions.push(file => !file.Action || this._actor.isAction() || !$gameParty.inBattle());
            conditions.push(file => !file.Inputting || this._actor.isInputting() || !$gameParty.inBattle());
            conditions.push(file => !file.State || this._actor.isStateAffected(file.State));
            conditions.push(file => !file.Weapon || this._actor.hasWeapon($dataWeapons[file.Weapon]));
            conditions.push(file => !file.Armor || this._actor.hasArmor($dataArmors[file.Armor]));
            conditions.push(file => !file.Scene || SceneManager._scene.isStandPictureScene(file.Scene));
            conditions.push(file => !file.Note || this.findStandPictureMeta() === file.Note);
            conditions.push(file => !file.Message || $gameMessage.isBusy());
            conditions.push(file => !file.Face || $gameMessage.isFaceActor(this._actor));
            conditions.push(file => !file.Speaker || $gameMessage.isSpeakerActor(this._actor));
            conditions.push(file => !file.Switch || $gameSwitches.value(file.Switch));
            conditions.push(file => !file.Variable || this.isVariableValid(file));
            conditions.push(file => !file.Script || eval(file.Script));
            this._conditions = conditions;
        }

        isNeedUpdatePicture() {
            const condition = this._updateCondition;
            if (condition.UpdateSwitch) {
                const value = $gameSwitches.value(condition.UpdateSwitch);
                if (value) {
                    $gameSwitches.setValue(condition.UpdateSwitch, false)
                }
                return value;
            } else if (condition.UpdateInterval) {
                return Graphics.frameCount % condition.UpdateInterval === 0;
            } else {
                return true;
            }
        }

        setupSceneParam(picture, scene) {
            picture.SceneShowPictureSwitch = scene.ShowPictureSwitch;
            picture.SceneMirrorSwitch = scene.MirrorSwitch;
            picture.SceneScaleX = scene.ScaleX;
            picture.SceneScaleY = scene.ScaleY;
            picture.FadeFrame = scene.FadeFrame;
            picture.SceneUnFocusSwitch = scene.UnFocusSwitch;
            picture.SceneTouchSwitch = scene.TouchSwitch;
        }

        findBasePosition(scene, index) {
            if (scene.ActorPosition) {
                const base = scene.ActorPosition.find(item => item.ActorId === this._actor.actorId());
                if (base) {
                    return base;
                }
            }
            if (scene.MemberPosition && scene.MemberPosition[index]) {
                return scene.MemberPosition[index];
            }
            return null;
        }

        getBasePoint() {
            return this._base;
        }

        updatePictureFiles() {
            this._standPictures.forEach(picture => {
                if (picture.FileList) {
                    picture.FileList.clone().reverse().some(file => this.setFileNameIfValid(file, picture));
                }
                if (!picture.FileName && picture.DynamicFileName) {
                    picture.FileName = this.createDynamicFileName(picture.DynamicFileName);
                }
            });
            return this._standPictures;
        }

        setFileNameIfValid(file, picture) {
            picture.FileName = null;
            if (this._conditions.every(condition => condition(file))) {
                picture.FileName = file.FileName;
                return true;
            } else {
                return false;
            }
        }

        isVariableValid(file) {
            const value1 = $gameVariables.value(file.Variable);
            const value2 = file.VariableOperand;
            switch (file.VariableType) {
                case 0:
                    return value1 === value2;
                case 1:
                    return value1 >= value2;
                case 2:
                    return value1 <= value2;
                case 3:
                    return value1 > value2;
                case 4:
                    return value1 < value2;
                case 5:
                    return value1 !== value2;
                default:
                    return false;
            }
        }

        createDynamicFileName(dynamicFileName) {
            return dynamicFileName
                .replace(/{hp:(.*?)}/gi, (_, p1) => this.findHpRateIndex(p1))
                .replace(/{stateId}/gi, () => this.findActorState())
                .replace(/{switch:(\d+?)}/gi, (_, p1) => this.findSwitch(p1))
                .replace(/{variable:(\d+?)}/gi, (_, p1) => this.findVariable(p1))
                .replace(/{note}/gi, () => this.findStandPictureMeta())
                .replace(/{action}/gi, () => this._actor.isAction() ? '1' : '0')
                .replace(/{damage}/gi, () => this._actor.isDamage() ? '1' : '0');
        }

        findHpRateIndex(rateText) {
            const rates = rateText.split(',').map(item => parseInt(item));
            for (let i = 0; i < rates.length + 1; i++) {
                const min = rates[i - 1] || 0;
                const max = rates[i] || 100;
                const rate = this._actor.hpRate() * 100;
                if (rate >= min && rate <= max) {
                    return String(i);
                }
            }
            return '0';
        }

        findActorState() {
            const state = this._actor.states().filter(state => !state.meta.NoStandPicture)[0];
            return String(state ? state.id : 0);
        }

        findSwitch(switchText) {
            return $gameSwitches.value(parseInt(switchText)) ? '1' : '0';
        }

        findVariable(variableText) {
            return String($gameVariables.value(parseInt(variableText)));
        }

        findStandPictureMeta() {
            let meta = '';
            this._actor.traitObjects().some(obj => {
                meta = PluginManagerEx.findMetaValue(obj, 'StandPicture');
                return !!meta;
            });
            return meta;
        }

        isDamage() {
            return this._actor && this._actor.isDamage();
        }

        getShakeSwitch() {
            return this._shakeSwitch;
        }
    }

    Game_Message.prototype.isFaceActor = function(gameActor) {
        return this._faceName === gameActor.faceName() && this._faceIndex === gameActor.faceIndex();
    };

    Game_Message.prototype.isSpeakerActor = function(gameActor) {
        return this._speakerName === gameActor.name();
    };

    /**
     * Game_Actor
     */
    Game_Actor.prototype.requestPictureMotion = function(motionType) {
        this._pictureMotion = motionType;
        this._motionFrame = Graphics.frameCount;
    };

    Game_Actor.prototype.isMotionTypeValid = function(motionType) {
        if (this._pictureMotion !== motionType) {
            return false;
        }
        if (Sprite_Actor.MOTIONS[motionType].loop) {
            return true;
        }
        if (this._motionFrame && this._motionFrame + 30 > Graphics.frameCount) {
            return true;
        }
        this._pictureMotion = '';
        this._motionFrame = 0;
        return false;
    };

    Game_Actor.prototype.isDamage = function() {
        return this.isMotionTypeValid('damage');
    };

    Game_Actor.prototype.isAction = function() {
        return this._performAction;
    };

    const _Game_Actor_performDamage = Game_Actor.prototype.performDamage;
    Game_Actor.prototype.performDamage = function() {
        _Game_Actor_performDamage.apply(this, arguments);
        this.requestPictureMotion('damage');
    };

    const _Game_Actor_performAction = Game_Actor.prototype.performAction;
    Game_Actor.prototype.performAction = function(action) {
        _Game_Actor_performAction.apply(this, arguments);
        this._performAction = true;
    };

    const _Game_Actor_performActionEnd = Game_Actor.prototype.performActionEnd;
    Game_Actor.prototype.performActionEnd = function() {
        _Game_Actor_performActionEnd.apply(this, arguments);
        this._performAction = false;
    };

    const _Game_Battler_requestMotion = Game_Battler.prototype.requestMotion;
    Game_Battler.prototype.requestMotion = function(motionType) {
        _Game_Battler_requestMotion.apply(this, arguments);
        if (this instanceof Game_Actor) {
            this.requestPictureMotion(motionType);
        }
    };

    /**
     * Spriteset_Base
     */
    Spriteset_Base.prototype.appendToEffect = function(displayObject) {
        this._effectsContainer.addChild(displayObject);
    };

    Spriteset_Base.prototype.findTargetStand = function(target) {
        if (target instanceof Game_Actor) {
            return this.parent.findStandSprite(target);
        } else {
            return null;
        }
    };

    const _Spriteset_Battle_findTargetSprite = Spriteset_Battle.prototype.findTargetSprite;
    Spriteset_Battle.prototype.findTargetSprite = function(target) {
        if (!$gameSystem.isSideView() && param.UseAnimationTarget) {
            const sprite = this.findTargetStand(target);
            if (sprite) {
                return sprite;
            }
        }
        return _Spriteset_Battle_findTargetSprite.apply(this, arguments);
    };

    const _Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
    Sprite_Actor.prototype.startMotion = function(motionType) {
        if (this._actor) {
            const newMotion = Sprite_Actor.MOTIONS[motionType];
            if (this._motion !== newMotion) {
                this._actor.requestPictureMotion(motionType);
            }
        }
        _Sprite_Actor_startMotion.apply(this, arguments);
    };

    /**
     * Scene_Base
     */
    const _Scene_Base_createWindowLayer = Scene_Base.prototype.createWindowLayer;
    Scene_Base.prototype.createWindowLayer = function() {
        _Scene_Base_createWindowLayer.apply(this, arguments);
        this.createAllStandPicture();
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.apply(this, arguments);
        if (this._standSpriteScene) {
            this.updateAllStandPicture();
        }
    };

    Scene_Base.prototype.createAllStandPicture = function() {
        this._standSprites = new Map();
        this._standActors = new Set();
        const sceneName = PluginManagerEx.findClassName(this);
        this._standSpriteScene = param.SceneList.filter(item => item.SceneName === sceneName)[0];
        if (this._standSpriteScene) {
            this.createStandPictureContainer();
            this.updateAllStandPicture();
        }
    };

    Scene_Base.prototype.createStandPictureContainer = function() {
        const container = new Sprite();
        const priority = this._standSpriteScene.Priority;
        if (priority === 1) {
            const index = this.children.indexOf(this._windowLayer);
            this.addChildAt(container, index);
        } else if (priority === 2 && this._spriteset) {
            this._spriteset.appendToEffect(container);
        } else {
            this.addChild(container);
        }
        this._standSpriteContainer = container;
    };

    Scene_Base.prototype.updateAllStandPicture = function() {
        const members = this.findStandPictureMember();
        if (!members) {
            return;
        }
        members.forEach((member, index) => {
            this.updateStandPicture(member, index);
        });
        const membersId = members.map(member => member.actorId());
        this._standSprites.forEach((value, key) => {
            if (!membersId.includes(key)) {
                this.removeStandPicture($gameActors.actor(key));
            }
        });
    };

    Scene_Base.prototype.findStandPictureMember = function() {
        return $gameParty ? $gameParty.members() : null;
    };

    Scene_Base.prototype.updateStandPicture = function(actor, index) {
        const id = actor.actorId();
        if (this._standActors.has(id)) {
            this._standSprites.get(id)?.changeActor(actor);
            return;
        }
        this._standActors.add(id);
        const pictureParam = new StandPictureParam();
        const existPicture = pictureParam.setup(actor, this._standSpriteScene, index);
        if (!existPicture) {
            return;
        }
        const sprite = usePointAdjust ? new Sprite_StandPictureWithDrag(pictureParam) :
            new Sprite_StandPicture(pictureParam);
        this._standSpriteContainer.addChild(sprite);
        this._standSprites.set(id, sprite);
    };

    Scene_Base.prototype.findStandSprite = function(actor) {
        return this._standSprites.get(actor.actorId());
    };

    Scene_Base.prototype.removeStandPicture = function(actor) {
        const id = actor.actorId();
        if (!this._standSprites.has(id)) {
            return;
        }
        this._standSpriteContainer.removeChild(this._standSprites.get(id));
        this._standSprites.delete(id);
        this._standActors.delete(id)
    };

    const _Scene_Base_terminate = Scene_Base.prototype.terminate;
    Scene_Base.prototype.terminate = function() {
        _Scene_Base_terminate.apply(this, arguments);
        if (this._standSprites) {
            this._standSprites.forEach(picture => picture.destroyStandApng());
        }
    };

    Scene_Base.prototype.isStandPictureScene = function(sceneName) {
        return this._standSpriteScene?.SceneName === sceneName;
    };

    Scene_Skill.prototype.findStandPictureMember = function() {
        return param.MenuActorOnly ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
    };

    Scene_Equip.prototype.findStandPictureMember = function() {
        const tempActor = this._statusWindow?.getTempActor();
        if (param.MenuActorOnly) {
            return tempActor ? [tempActor] : [this.actor()];
        } else {
            const member = Scene_Base.prototype.findStandPictureMember.call(this);
            return member.map(actor => actor.actorId() === tempActor?.actorId() ? tempActor : actor);
        }
    };

    Scene_Status.prototype.findStandPictureMember = function() {
        return param.MenuActorOnly ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
    };

    Scene_Name.prototype.findStandPictureMember = function() {
        return param.MenuActorOnly ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
    };

    Scene_Shop.prototype.findStandPictureMember = function() {
        const tempActors = this._statusWindow?.getTempActors();
        const member = Scene_Base.prototype.findStandPictureMember.call(this);
        return member.map(actor => tempActors?.has(actor.actorId()) ? tempActors.get(actor.actorId()) : actor);
    };

    if (window.Scene_CustomMenu){
        Scene_CustomMenu.prototype.findStandPictureMember = function() {
            const changeable = !!this._customData.WindowList.find(win => win.ActorChangeable);
            return param.MenuActorOnly && changeable ? [this.actor()] : Scene_Base.prototype.findStandPictureMember.call(this);
        };
    }

    Window_EquipStatus.prototype.getTempActor = function() {
        return param.DressUp ? this._tempActor : null;
    };

    const _Window_ShopStatus_refresh = Window_ShopStatus.prototype.refresh;
    Window_ShopStatus.prototype.refresh = function() {
        this._tempActors = new Map();
        _Window_ShopStatus_refresh.apply(this, arguments);
    };

    Window_ShopStatus.prototype.getTempActors = function() {
        return param.DressUp ? this._tempActors : null;
    };

    const _Window_ShopStatus_drawActorEquipInfo = Window_ShopStatus.prototype.drawActorEquipInfo;
    Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
        _Window_ShopStatus_drawActorEquipInfo.apply(this, arguments);
        if (param.DressUp) {
            this.appendTempActor(actor);
        }
    };

    Window_ShopStatus.prototype.appendTempActor = function(actor) {
        if (!actor.canEquip(this._item)) {
            return;
        }
        const slotId = this.findSlotId(actor);
        if (slotId !== -1) {
            const tempActor = JsonEx.makeDeepCopy(actor);
            tempActor.forceChangeEquip(slotId, this._item);
            this._tempActors.set(actor.actorId(), tempActor);
        }
    };

    Window_ShopStatus.prototype.findSlotId = function(actor) {
        return actor.equipSlots().findIndex(slot => slot === this._item.etypeId);
    };

    /**
     * Sprite_StandPicture
     */
    class Sprite_StandPicture extends Sprite {
        constructor(pictureParam) {
            super();
            this.setup(pictureParam);
        }

        setup(pictureParam) {
            this._pictures = pictureParam;
            this._pictures.updatePictureFiles().forEach(picture => this.addChild(this.createChild(picture)));
            this._shake = 0;
            this.updatePosition();
            if (param.Origin === 1) {
                this.anchor.x = 0.5;
                this.anchor.y = 0.5;
            } else if (param.Origin === 2) {
                this.anchor.x = 0.5;
                this.anchor.y = 1.0;
            }
        }

        changeActor(actor) {
            this._pictures.changeActorIfNeed(actor);
        }

        updatePosition() {
            const basePoint = this._pictures.getBasePoint();
            this.x = basePoint.X + this.getShakeX();
            this.y = basePoint.Y + this.getShakeY();
            this.children.forEach(child => {
                if (child.isOutOfShake()) {
                    child.x -= this.getShakeX();
                    child.y -= this.getShakeY();
                }
            })
        }

        setupShake() {
            if (this._pictures.isDamage() && param.ShakeOnDamage) {
                if (!this._damage) {
                    this._damage = true;
                    this.shake();
                }
            } else {
                this._damage = false;
            }
            const shakeSwitch = this._pictures.getShakeSwitch();
            if ($gameSwitches.value(shakeSwitch)) {
                $gameSwitches.setValue(shakeSwitch, false);
                this.shake();
            }
        }

        shake() {
            this._shakePower     = param.ShakePower || 1;
            this._shakeSpeed     = param.ShakeSpeed || 1;
            this._shakeDuration  = param.ShakeDuration || 30;
            this._shakeRotation  = (param.ShakeRotation || 0) * Math.PI / 180;
            this._shakeDirection = 1;
        }

        updateShake() {
            const delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
                this._shake = 0;
            } else {
                this._shake += delta;
            }
            if (this._shake > this._shakePower * 2) {
                this._shakeDirection = -1;
            }
            if (this._shake < -this._shakePower * 2) {
                this._shakeDirection = 1;
            }
            this._shakeDuration--;
        }

        getShakeX() {
            return this._shake ? this._shake * Math.cos(this._shakeRotation) : 0;
        }

        getShakeY() {
            return this._shake ? this._shake * Math.sin(this._shakeRotation) : 0;
        }

        createChild(picture) {
            return new Sprite_StandPictureChild(picture);
        }

        update() {
            if (this._pictures.isNeedUpdatePicture()) {
                this._pictures.updatePictureFiles();
            }
            super.update();
            this.setupShake();
            if (this._shakeDuration > 0 || this._shake !== 0) {
                this.updateShake();
            } else {
                this._shakeDuration = 0;
            }
            this.updatePosition();
        }

        destroyStandApng() {
            this.children.forEach(child => {
                if (child.destroyApngIfNeed) {
                    child.destroyApngIfNeed();
                }
            })
        }
    }

    /**
     * Sprite_StandPictureChild
     */
    class Sprite_StandPictureChild extends Sprite_Clickable {
        constructor(picture) {
            super();
            this.setup(picture);
        }

        setup(picture) {
            this._picture = picture;
            this._openness = 0;
            if (param.Origin === 1) {
                this.anchor.x = 0.5;
                this.anchor.y = 0.5;
            } else if (param.Origin === 2) {
                this.anchor.x = 0.5;
                this.anchor.y = 1.0;
            }
            this.update();
        }

        updatePosition() {
            this.x = this._picture.X;
            this.y = this._picture.Y;
        }

        isOutOfShake() {
            return this._picture.OutOfShake;
        }

        update() {
            super.update();
            this.updatePosition();
            this.updateBitmap();
            this.updateScale();
            this.updateVisibility();
            this.updateFocus();
        }

        updateBitmap() {
            const file = this._picture.FileName;
            if (this._fileName === file) {
                return;
            }
            if (this.addApngChild) {
                this.addApngChild(file);
            }
            if (!this._apngSprite && file) {
                const bitmap = ImageManager.loadPicture(file);
                bitmap.addLoadListener(() => this.setBitmap(bitmap));
            }
            this._fileName = file;
        }

        onPress() {
            if (!this.isShowing()) {
                return;
            }
            if (this._picture.TouchSwitch > 0) {
                $gameSwitches.setValue(this._picture.TouchSwitch, true);
                TouchInput.clear();
            }
            if (this._picture.SceneTouchSwitch > 0) {
                $gameSwitches.setValue(this._picture.SceneTouchSwitch, true);
                TouchInput.clear();
            }
        }

        setBitmap(bitmap) {
            this.bitmap = bitmap;
            const sheet = this._picture.SpriteSheet;
            if (sheet) {
                const width = this.bitmap.width / sheet.MaxColumn;
                const height = this.bitmap.height / sheet.MaxRow;
                const x = (sheet.ColumnNumber - 1) * width;
                const y = (sheet.RowNumber - 1) * height;
                this.setFrame(x, y, width, height);
            }
        }

        updateVisibility() {
            this._openness = (this._openness + this.calcDeltaOpenness()).clamp(0, 1);
            this.opacity = this._picture.Opacity * this._openness;
        }

        calcDeltaOpenness() {
            const openness = 1 / (this._picture.FadeFrame || 1);
            return this.isShowing() ? openness : -openness;
        }

        isShowing() {
            if (!this._fileName) {
                return false;
            }
            const switchId = this._picture.ShowPictureSwitch;
            if (switchId && !$gameSwitches.value(switchId)) {
                return false;
            }
            const sceneSwitchId = this._picture.SceneShowPictureSwitch;
            if (sceneSwitchId && !$gameSwitches.value(sceneSwitchId)) {
                return false;
            }
            return true;
        }

        updateScale() {
            this.scale.x = (this._picture.ScaleX / 100) || 1;
            this.scale.y = (this._picture.ScaleY / 100) || 1;
            if (this._picture.SceneScaleX) {
                this.scale.x *= this._picture.SceneScaleX / 100;
            }
            if (this._picture.SceneScaleY) {
                this.scale.y *= this._picture.SceneScaleY / 100;
            }
            if (this.isMirror()) {
                this.scale.x *= -1;
            }
        }

        updateFocus() {
            if (this.isUnFocus()) {
                const power = param.UnFocusPower || 0;
                this.setColorTone([-power, -power, -power, 0]);
            } else {
                this.setColorTone([0, 0, 0, 0]);
            }
        }

        isUnFocus() {
            const switchId = this._picture.UnFocusSwitch;
            if (switchId && $gameSwitches.value(switchId)) {
                return true;
            }
            const sceneSwitchId = this._picture.SceneUnFocusSwitch;
            if (sceneSwitchId && $gameSwitches.value(sceneSwitchId)) {
                return true;
            }
            return false;
        }

        isMirror() {
            const switchId = this._picture.MirrorSwitch;
            if (switchId && $gameSwitches.value(switchId)) {
                return true;
            }
            const sceneSwitchId = this._picture.SceneMirrorSwitch;
            if (sceneSwitchId && $gameSwitches.value(sceneSwitchId)) {
                return true;
            }
            return false;
        }

        loadApngSprite(name) {
            return SceneManager.tryLoadApngPicture(name);
        }
    }

    // for Drag by test play
    if (!usePointAdjust) {
        return;
    }

    let anySpriteDrag = false;

    /**
     * Sprite_StandPictureWithDrag
     */
    class Sprite_StandPictureWithDrag extends Sprite_StandPicture {
        constructor(pictureParam) {
            super(pictureParam);
        }

        createChild(picture) {
            return new Sprite_StandPictureChildWithDrag(picture);
        }

        update() {
            super.update();
            const children = Input.isPressed('control') ? this.children : this.children.clone().reverse()
            children.forEach(sprite => sprite.updateDrag());
        }
    }

    /**
     * Sprite_StandPictureChildWithDrag
     */
    class Sprite_StandPictureChildWithDrag extends Sprite_StandPictureChild {
        constructor(picture) {
            super(picture);
            this._drag = false;
        }

        updateDrag() {
            this.startDragIfNeed();
            if (!this._drag) {
                return;
            }
            const dx = TouchInput.x - this._dx;
            const dy = TouchInput.y - this._dy;
            if (this._baseDrag) {
                this.parent.x = dx;
                this.parent.y = dy;
            } else {
                this.x = dx;
                this.y = dy;
            }
            Graphics.drawPositionInfo(`BaseX:${this.parent.x} BaseY:${this.parent.y} PictureX:${this.x} PictureY:${this.y} `);
            if (!TouchInput.isPressed()) {
                this.stopDrag();
            }
        }

        startDragIfNeed() {
            if (!this._requestDrag && !this._drag) {
                return;
            }
            this._requestDrag = false;
            if (this._drag || anySpriteDrag) {
                return;
            }
            anySpriteDrag = true;
            this._drag = true;
            if (Input.isPressed("shift")) {
                this._dx = TouchInput.x - this.parent.x;
                this._dy = TouchInput.y - this.parent.y;
                this._baseDrag = true;
            } else {
                this._dx = TouchInput.x - this.x;
                this._dy = TouchInput.y - this.y;
                this._baseDrag = false;
            }
            this.setBlendColor([255, 255, 255, 128]);
        }

        stopDrag() {
            anySpriteDrag = false;
            this._drag = false;
            this.setBlendColor([0, 0, 0, 0]);
        }

        onPress() {
            super.onPress();
            if (this.canDrag()) {
                this._requestDrag = true;
            }
        }

        canDrag() {
            if (this._apngSprite) {
                return true;
            }
            const pos = this.findLocalTouchPos();
            return this.bitmap.getAlphaPixel(pos.x, pos.y) !== 0;
        }

        findLocalTouchPos() {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            const pos = this.worldTransform.applyInverse(touchPos);
            pos.x += this.width * this.anchor.x;
            pos.y += this.height * this.anchor.y;
            return pos;
        }
    }

    const _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements        = function() {
        _Graphics__createAllElements.apply(this, arguments);
        this._createPositionInfo();
    };

    Graphics._createPositionInfo = function() {
        const div            = document.createElement('div');
        div.id               = 'position';
        div.style.display    = 'none';
        div.style.position   = 'absolute';
        div.style.left       = '100px';
        div.style.top        = '5px';
        div.style.background = '#222';
        div.style.opacity    = '0.8';
        div.style['z-index'] = '8';
        div.style.color      = '#fff';
        this._positionDiv     = div;
        document.body.appendChild(div);
    };

    Graphics.drawPositionInfo = function(text) {
        if (text) {
            this._positionDiv.style.display = 'block';
            this._positionDiv.textContent   = text;
        } else {
            this._positionDiv.style.display = 'none';
        }
    };
})();
