//==========================================================
// RPG Maker MZ QJ-Lighting.js
//==========================================================
/*:
 * @target MZ
 * @plugindesc Light and Shadows [V2.1]
 * @author Qiu Jiu
 * @orderAfter UltraMode7
 *
 *
 * @help
 * QJ-Lighting.js
 * ===============================================================================
 * 零.特殊说明
 * ===============================================================================
 * 1.此插件可与UM7插件使用，使用时请将此插件放在UM7插件之下。
 *
 *
 * ===============================================================================
 * 一.插件基础说明
 * ===============================================================================
 * 1.插件结构(逻辑结构,并非实际的图层结构)
 *
 *
 * ========================
 * 遮挡层(地图遮罩/黑色部分)
 * ========================
 *   ^
 *   |
 *   |          ============================
 *   |       -->简易灯光(用于区域灯光/定时灯光)
 * =====    /   ============================        ======================
 * 灯光层--<                                      -->实时阴影(地形或者区域)
 * =====    \   ======================          /   ======================
 *           -->完整灯光(用于事件/玩家)----------<    
 *              ======================          \   =============
 *                                               -->事件/玩家阴影
 *                                                  =============
 *
 *
 * 2.灯光总共分为两种：完整灯光和简易灯光。
 *   完整灯光：|有完整的灯光参数，可以产生实时阴影和事件阴影|消耗资源比较多，数量上限低|只能绑定在玩家或者事件身上    |
 *   简易灯光：|只有基础的灯光参数，不可以产生阴影         |消耗资源少，数量上限高    |只能绑定在指定位置(区域或地形)|
 *   ***在以后的版本中，可以使用弹幕插件(QJ-Bullet)也可以将上述两种灯光绑定在弹幕上，可以通过操控弹幕的移动来控制灯光的行为***
 * 3.要创建一个 完整灯光 ,必须首先在右方的插件参数"灯光预设数据"中设置一个灯光,然后此灯光便可(且只能)依照"灯光编号"来绑定在事件或者
 *   玩家身上.<<<仅仅能绑定在玩家或者事件上>>>
 *   (1)要绑定在玩家身上时,可以在右方插件参数"玩家初始灯光"中写上玩家最开始时所需要设置的灯光编号.游戏运行时要改变的话,就使用
 *   下方指定的脚本指令.
 *   (2)要绑定在事件身上时,需将该事件的某个事件页的第一个指令设置为"注释",且在该注释指令中写下方"二.事件注释"中的文字.
 *   不同的事件页可以设置不同的灯光,切换事件页后对应的灯光也会重新加载,故而:在游戏运行时想要修改事件的灯光,可以使用独立开关
 *   来切换事件页,从而改变灯光.
 *   (3)灯光的图片在数据库中设置后,会在游戏载入时进行预加载,可以提高系统稳定性,大幅提高效率.
 *      灯光图片放在img/lights下.设定的灯光图片名前面加上$符号时,灯光图片将被横向分为四行,每一行分别代表此
 *      事件/玩家朝向 下 左 右 上 时的灯光图片.
 *      灯光图片名后面可以加上 [总帧数,间隔时间] ,灯光图片将被纵向分为"总帧数"格,每隔"间隔时间"帧,灯光图片就
 *      会对应着动态变化.
 * 4.要创建一个 简易灯光，需在右方插件参数中"简易灯光数据"中设置灯光数据。
 *   可在“区域灯光”中将指定编号的简易灯光绑定在区域上，这样所有的该区域均会生成一个灯光.
 *   或者使用脚本指令在指定地方生成一个临时灯光，具体请查看 三.脚本指令 中的 5.定时简易灯光.
 * 5.地图中的阴影有两种:区域实时阴影和事件阴影。
 *   (1)区域实时阴影:
 *      区域实时阴影是指以某个区域的正方形块为图形进行投影，投射的点只能是这个正方形的四个角，此功能与大部分灯光插件的实时阴影功能
 *      相同。
 *      区域上方也可以显示各种形状的纯色遮罩，此功能主要是为了做"屋顶"的效果。灵活使用此效果可以制作其他灯光插件所说的"多高度阴影"
 *      (multi-height shadows)的效果。如果不想设置纯色遮罩，则将遮罩的颜色设置为白色(#ffffff).
 *      纯色遮罩的形状除了预设的那些外也可以自己写，但是此功能稍显复杂。
 *
 *      形状的基础设定方式是在数组中写各个点的对象。点的基础坐标为该块的左上角。
 *      例如 [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 *      就代表着从(0,0)点画横线到(48,0)，再画横线到(48,48)，再画横线到(0,48)，最后首位相连，然后在画成的轨迹中进行涂色。
 *      其中x和y分别代表着相对于"该块的左上角"的坐标，t代表此点到下一个点的绘制方式。
 *      t的值和对应的绘制方式:
 *          0直线
 *          1顺时针画圆弧(朝外部)
 *          2顺时针画圆弧(朝内部)
 *          3逆时针画圆弧(朝外部)
 *          4逆时针画圆弧(朝内部)
 *          5将此点与初始点相连并在生成的图形中涂色，然后另开新的起始点画下一个部分
 *
 *   (2)事件阴影:
 *      可以指定某个光源可以让事件产生投影，然后可以指定哪个事件可以产生投影。
 *      某个光源是否可以让事件产生投影，得在插件参数的"灯光预设"中设定。
 *      事件能否产生投影得在某个事件的某个事件页的注释中写对应指令，具体可查看  二.事件注释  中的  3.事件阴影设置。
 *      事件是否默认产生阴影可以在右方的插件参数中的"默认开启事件阴影"中设定。
 *
 *      队友和领队(玩家)均可以产生阴影，队友的阴影参数与玩家相同.
 *
 * 6.灯光数据后面加*的数据,均可使用如下格式的字符串来设计动态变化效果(类似于设置关键帧):[!!!!!!!!!!!!!!!!!!!!特别重要!!!!!!!!!!!!!!!!!!!!]
 *   持续时间|对应值~持续时间|对应值~持续时间|对应值
 *   例如设置灯光的不透明度(0-1,1为最明亮)时,若写(不加空格,不加引号,不加逗号) 60|0.2~60|0.6~60|1 ,
 *      那么该灯光的不透明度在0-60帧时是0.2,60-120帧时是0.6,120-180帧时是1,然后 进行循环 .
 *   分割 持续时间 和 对应值的是符号|,除了|外,也可以使用/或者%.
 *   |代表到达该时间段内时,该数据的值瞬间变成对应值.例如50|0.5~10|1,该数据在第50帧时会由0.5瞬间变成1,持续10帧后再瞬间变回0.5.
 *   /代表在此时间段内,该数据的值由上一个值线性变为该对应值.例如50|0.5~10/1~50|1~10/0.5,
 *      该数据在第50帧后,会在10帧内由0.5线性变为1,在第60到第110帧内一直是1,然后在接下来的10帧内再次由1线性渐变为0.5.然后进行循环.
 *   %与/同理,不过/代表线性渐变,%代表曲线渐变(圆).
 *   !!!注意!!!该格式的第一个 持续时间|对应值 中分割 持续时间 和 对应值的符号只能是|,不能是/或者%.因为此时没有初值供其进行变化.
 * ================================================================
 *
 *
 *
 * ===============================================================================
 * 二.事件注释(每个事件的事件页中第一个事件指令)
 * ===============================================================================
 * 1.基础注释,为事件设置光效:(Qiu Jiu Light Layer)
 *   <QJLL:id>
 *   id:在数据库中指定的灯光id.
 * ================================================================
 * 2.修改事件光效数据:(Qiu Jiu Light Layer)
 *   以<QJLL:id>设置的指定数据库中的数据为基础,设置该事件该事件页灯光的对应数据,注意,在此处不能修改光效图片。
 *   在此处没有写的数据则不能修改.
 *   <QJLL-scaleX:value>                     例如  <QJLL-scaleX:1>
 *   <QJLL-scaleY:value>                     例如  <QJLL-scaleY:1>
 *   <QJLL-tint:value>                       例如  <QJLL-tint:#ff00ff>
 *   <QJLL-offsetX:value>                    例如  <QJLL-offsetX:0>
 *   <QJLL-offsetY:value>                    例如  <QJLL-offsetY:0>
 *   <QJLL-dirOffsetX:value>                 例如  <QJLL-dirOffsetX:0~0~0~0>
 *   <QJLL-dirOffsetY:value>                 例如  <QJLL-dirOffsetY:0~0~0~0>
 *   <QJLL-opacity:value>                    例如  <QJLL-opacity:1>
 *   <QJLL-rotation:value>                   例如  <QJLL-rotation:0>
 *   <QJLL-rotationAuto:value>               例如  <QJLL-rotationAuto:0>
 *   <QJLL-dirRotation:value>                例如  <QJLL-dirRotation:0~0~0~0>
 *   <QJLL-shadowCharacter:false/true>       例如  <QJLL-shadowCharacter:false>
 *   <QJLL-shadowCharacterOffsetX:value>     例如  <QJLL-shadowCharacterOffsetX:0>
 *   <QJLL-shadowCharacterOffsetY:value>     例如  <QJLL-shadowCharacterOffsetY:0>
 *   <QJLL-shadowCharacterMaxOpacity:value>  例如  <QJLL-shadowCharacterMaxOpacity:1>
 *   <QJLL-shadowCharacterMaxDistance:value> 例如  <QJLL-shadowCharacterMaxDistance:150>
 * ================================================================
 * 3.事件阴影设置:(Qiu Jiu Character Shadow)
 *   设置事件的阴影,灯光属性shadowCharacter打开时,灯光便会投射该事件的阴影。
 *   <QJCS-status:false/true>:是否显示该事件的阴影.默认是false.需要手动设置来打开.例如<QJCS-status:true>.
 *   <QJCS-imgName:value>:阴影默认采用事件的当前行走图作为阴影,但若想重新设置对应的阴影,可以在此设置阴影图片.
 *      1.阴影图片也放在img/lights下.设定的阴影图片名前面加上$符号时,阴影图片将被横向分为四行,每一行分别代表此
 *      事件朝向 下 左 右 上 的阴影图片.
 *      2.阴影默认采用事件的当前行走图作为阴影时,影子会随事件/玩家的行走图的变化而变化,但若设置成固定的阴影图片,
 *      则阴影不会随着事件的行走图的变化而变化.
 *      3.系统会将行走图完全变成黑色.若想单独指定该事件阴影的颜色,可以使用<QJCS-tint:value>来指定颜色.
 *      4.！！！注意！！！阴影图片在这里指定后,还必须在插件参数的"阴影图片预载"中同样写上此图片名.
 *      此举的目的是使所有用到的光影图片都被预加载,提高系统稳定性,大幅提高效率.
 *   <QJCS-tint:value>:阴影颜色.例如<QJCS-tint:#000000>.
 *   <QJCS-opacity:value>:阴影不透明度.例如<QJCS-opacity:1>.
 *   <QJCS-offsetX:value>:阴影底部的x偏移.例如<QJCS-offsetX:0>.
 *   <QJCS-offsetY:value>:阴影底部的y偏移.例如<QJCS-offsetY:0>.
 *   <QJCS-offsetDirX:朝下~朝左~朝右~朝上>:朝各个方向时阴影底部的x偏移.例如<QJCS-offsetDirX:0~0~0~0>.
 *   <QJCS-offsetDirY:朝下~朝左~朝右~朝上>:朝各个方向时阴影底部的y偏移.例如<QJCS-offsetDirY:0~0~0~0>.
 *   <QJCS-model:value>:此事件投影的模式.默认为D[].不同字符对应的效果为:例如<QJCS-model:DM[48]>.
 *
 *      D[]影子只会根据光源与事件的方向进行旋转,不会有任何变形.适合行走图比较小,脚很小的人物.
 *      DM[value]同D[],且光源离事件越近,影子越影子越短.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写48.
 *      DW[value]同D[],且光源离事件越近,影子越影子越长.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写96.
 *
 *      B[]影子的底部不变化,但是影子会根据光源与事件的方向进行形变.当光源与影子在同一水平线上时,影子会变得很窄很窄.适合行走图比
 *          较大,很宽的门.
 *      BM[value]同B[],且光源离事件越近,影子越影子越短.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写48.
 *      BW[value]同B[],且光源离事件越近,影子越影子越长.value代表影子与原图的大小比例为1:1时光源与事件的距离(像素值).一格为48.
 *          value适合写96.
 *   <QJCS-yCut:value>:在原阴影图的基础上，将锚点上浮value个像素,然后切除锚点之下的图片。在QJCS-model的值为D[]或DM[]或DW[]时，
 *      此效果能使阴影的旋转更自然，value的默认值是0，建议写的值为24.:例如<QJCS-yCut:24>.
 * ================================================================
 *
 *
 *
 * ===============================================================================
 * 三.脚本指令
 * ===============================================================================
 * 1.打开或者关闭灯光效果.
 *   QJ.LL.open():打开光效.注意!若使用过QJ.LL.tint来将画面整体颜色调整为"#ffffff"(白色,相当于没有光效),那么使用此指令将无效!
 *      需先使用QJ.LL.tint来将画面整体颜色变为其他颜色.
 *   QJ.LL.close():关闭光效.
 * ================================================================
 * 2.调节画面整体的默认颜色.
 *   QJ.LL.tint(time,color):调节光效整体颜色.
 *      time:渐变时间,单位为帧,写0时瞬间变化.
 *      color:目标颜色.
 *   若原本光效就关闭着,那么系统会自动打开光效,且光效颜色将从"#ffffff"渐变为目标颜色(color).
 *   同样地，若目标颜色(color)为"#ffffff"，系统会在渐变完后自动关闭光效。
 * ================================================================
 * 3.重设玩家光效.(set player light -> spl)(delete player light -> dpl)(add player light -> apl)
 *   QJ.LL.splHide(lightId):暂时隐藏玩家的某个灯光。lightId写null时隐藏所有灯光。
 *   QJ.LL.splShow(lightId):打开玩家的某个灯光。lightId写null时打开所有灯光。
 *
 *   QJ.LL.spl(lightId):删除所有灯光，然后为玩家增加一个新的灯光。
 *   QJ.LL.apl(lightId):为玩家新增一个灯光，若玩家已有此灯光，则无效。
 *   QJ.LL.dpl(lightId):删除玩家的指定灯光，lightId写null时删除所有玩家灯光。
 *
 *   QJ.LL.splScaleX(lightId,value):重设当前灯光的x缩放数据。
 *   QJ.LL.splScaleY(lightId,value):重设当前灯光的y缩放数据。
 *   QJ.LL.splTint(lightId,value):重设当前灯光的色调。
 *   QJ.LL.splOffsetX(lightId,value):重设当前灯光的x偏移。
 *   QJ.LL.splOffsetY(lightId,value):重设当前灯光的y偏移。
 *   QJ.LL.splDirOffsetX(lightId,value):重设当前灯光的x朝向偏移。
 *   QJ.LL.splDirOffsetY(lightId,value):重设当前灯光的y朝向偏移。
 *   QJ.LL.splOpacity(lightId,value):重设当前灯光的不透明度。
 *   QJ.LL.splRotation(lightId,value):重设当前灯光的角度。
 *   QJ.LL.splDirRotation(lightId,value):重设当前灯光的朝向角度。
 *   （其余诸如imgName等的数据只能通过QJ.LL.spl(lightId)重设.）
 * ================================================================
 * 4.重设玩家阴影.(set player shadow -> sps)
 *   QJ.LL.spsStatus(false/true):关闭/打开玩家阴影.
 *   QJ.LL.spsImgName(value):重设玩家阴影图片,使用QJ.LL.imgName("")或者QJ.LL.imgName(null)来使用玩家行走图作为阴影.
 *   QJ.LL.spsTint(value):重设玩家阴影色调.
 *   QJ.LL.spsOpacity(value):重设玩家阴影不透明度.
 *   QJ.LL.spsOffsetX(value):重设玩家阴影x偏移.
 *   QJ.LL.spsOffsetY(value):重设玩家阴影y偏移.
 *   QJ.LL.spsOffsetDirX(朝下~朝左~朝右~朝上):重设玩家阴影x朝向偏移.
 *   QJ.LL.spsOffsetDirY(朝下~朝左~朝右~朝上):重设玩家阴影y朝向偏移.
 *   QJ.LL.spsModel(value):重设玩家阴影模式.
 *   QJ.LL.spsYCut(value):重设玩家阴影的剪切.
 * ================================================================
 * 5.定时简易灯光
 *   QJ.LL.tempLight(lightId,during,x,y)在指定位置生成一个定时消失的灯光.
 *      lightId:简易灯光编号,指插件参数的 简易灯光数据 中设置的灯光.
 *      during:存在的时间，单位为帧，写-1时代表永远存在.
 *      x/y:显示的位置，单位为像素.
 * ================================================================
 * 6.设置事件灯光.(set event light -> spl)(delete event light -> dpl)(add event light -> apl)
 *   除了在注释中设置灯光外，还可以使用脚本指令来修改当前事件的灯光。
 *   在事件的事件页被修改后，整个事件的所有灯光都会被清空。
 *   QJ.LL.selHide(lightId):暂时隐藏事件的某个灯光。lightId写null时隐藏所有灯光。
 *   QJ.LL.selShow(lightId):打开事件的某个灯光。lightId写null时打开所有灯光。
 *
 *   QJ.LL.sel(lightId):删除所有灯光，然后为事件增加一个新的灯光。
 *   QJ.LL.ael(eventId,lightId):为事件新增一个灯光，若事件已有此灯光，则无效。
 *   QJ.LL.del(eventId,lightId):删除事件的指定灯光，lightId写null时删除所有事件灯光。
 *
 *   QJ.LL.selScaleX(eventId,lightId,value):重设当前灯光的x缩放数据。
 *   QJ.LL.selScaleY(eventId,lightId,value):重设当前灯光的y缩放数据。
 *   QJ.LL.selTint(eventId,lightId,value):重设当前灯光的色调。
 *   QJ.LL.selOffsetX(eventId,lightId,value):重设当前灯光的x偏移。
 *   QJ.LL.selOffsetY(eventId,lightId,value):重设当前灯光的y偏移。
 *   QJ.LL.selDirOffsetX(eventId,lightId,value):重设当前灯光的x朝向偏移。
 *   QJ.LL.selDirOffsetY(eventId,lightId,value):重设当前灯光的y朝向偏移。
 *   QJ.LL.selOpacity(eventId,lightId,value):重设当前灯光的不透明度。
 *   QJ.LL.selRotation(eventId,lightId,value):重设当前灯光的角度。
 *   QJ.LL.selDirRotation(eventId,lightId,value):重设当前灯光的朝向角度。
 *   （其余诸如imgName等的数据只能通过QJ.LL.sel(lightId)重设.）
 * ================================================================
 *
 *
 * ===============================================================================
 * 四.图块备注(在数据库-图块-备注中写的数据，可用于使用当前图块的地图)
 * ===============================================================================
 * 1.有时候我们感觉使用区域来制作实时阴影/遮盖有点麻烦，要大范围地设置墙壁，则需要为每一个绘制了相同图块的格子
 *   都再绘制一次区域.此时我们可以使用“地形”来简化此步骤。（Qiu Jiu Terraintag Shadow）
 *   在地图图块的备注中写<QJTS-1:value>或<QJTS-2:value>或……或<QJTS-7:value>（地形最大为7）
 *   则可以使这个地图图块的某个地形拥有id为value的区域的阴影效果。
 *   例如在插件参数的“区域阴影设置”中指定了区域255的数据，若在某个地图图块的备注中写<QJTS-1:255>，则可以使当前地图图块地形为
 *   1的图块有区域255的相关阴影效果.
 *   ***当一个地方既有地形所代指的区域效果，本身又设置了区域，则以区域为主***
 * ================================================================
 * 2.有时候我们要让一大片区域的每一格都生成灯光，若感觉使用区域比较麻烦，可使用<QJL-1:value>等指令让某个地形生成和id为
 *   value一样的区域生成的灯光相同的灯光.
 *   例如在插件参数的“简易灯光预设”中指定了区域100的数据，若在某个地图图块的备注中写<QJL-2:100>，则可以使当前地图图块地形为
 *   2的图块有区域100的灯光效果.
 *   ***当一个地方既有地形所代指的区域效果，本身又设置了区域，则以区域为主***
 * ================================================================
 *
 * ===============================================================================
 * 五.使用
 * ===============================================================================
 * 此插件可免费用于您的任何非盈利游戏。
 * 但是这个插件对以任何方式获得经济利益的游戏是不免费的。
 * 您需要为您的商业游戏付费。
 * 您可以选择在itch.io上购买。
 * https://qiujiu.itch.io/qj-lighting
 * 或者从下列网页中获取我的联系方式进行购买。
 *
 *
 * ===============================================================================
 * 六.时间系统
 * ===============================================================================
 * 1.时间系统只有基础的“秒，分，时”三个量，这三个量的必须分别对应一个变量。
 *   时间系统分两个模式：
 *     （1）兼容其他时间系统：灯光插件并不会改变那三个变量的值，系统只会根据那三个量的值改变画面色调。
 *     （2）自主运行：灯光插件会自动改变那三个变量的值来改变当前的时间，从而改变画面色调。
 *   您可以直接改变这三个变量的值来改变时间。在载入游戏时就改变这三个变量的值便可修改“初始时间”。
 * 2.脚本：
 *   QJ.LL.setTimeSystem(true/false);       打开或者关闭时间系统。
 *   QJ.LL.setTimeRunStatus(true/false);    打开或者关闭时间流逝(时间系统的模式为“自主运行”时此脚本才有用)。
 *   QJ.LL.setTimeHubStatus(true/false);    打开或者关闭时间系统的UI。
 *   $gameMap.addLightingSecondQJ(value);   增加一定秒。
 *   $gameMap.addLightingMiniteQJ(value);   增加一定分。
 *   $gameMap.addLightingHourQJ(value);     增加一定时。
 * 3.地图注释
 *   在地图备注中写<indoor>则使用室内的色调变换模式，否则使用室外的色调变换模式。
 *
 * ===============================================================================
 * 七.地图注释
 * ===============================================================================
 * 1.在地图备注中写<QJScreenTint:value>可以在载入地图时自动改变地图色调。
 *   此改变会覆盖时间系统中的色调。
 * 
 *
 *
 * @param chaos
 * @text 基础数据设置
 * 
 * @param lightPreset
 * @type struct<presetData>[]
 * @text 灯光预设数据[0]
 * @desc 灯光预设数据[0]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset1
 * @type struct<presetData>[]
 * @text 灯光预设数据[1]
 * @desc 灯光预设数据[1]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset2
 * @type struct<presetData>[]
 * @text 灯光预设数据[2]
 * @desc 灯光预设数据[2]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset3
 * @type struct<presetData>[]
 * @text 灯光预设数据[3]
 * @desc 灯光预设数据[3]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset4
 * @type struct<presetData>[]
 * @text 灯光预设数据[4]
 * @desc 灯光预设数据[4]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset5
 * @type struct<presetData>[]
 * @text 灯光预设数据[5]
 * @desc 灯光预设数据[5]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset6
 * @type struct<presetData>[]
 * @text 灯光预设数据[6]
 * @desc 灯光预设数据[6]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset7
 * @type struct<presetData>[]
 * @text 灯光预设数据[7]
 * @desc 灯光预设数据[7]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset8
 * @type struct<presetData>[]
 * @text 灯光预设数据[8]
 * @desc 灯光预设数据[8]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 * 
 * @param lightPreset9
 * @type struct<presetData>[]
 * @text 灯光预设数据[9]
 * @desc 灯光预设数据[9]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[0]
 * @desc 简易灯光预设数据[0]
 * @parent chaos
 * @default []
 *
 * @param miniLights1
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[1]
 * @desc 简易灯光预设数据[1]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights2
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[2]
 * @desc 简易灯光预设数据[2]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights3
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[3]
 * @desc 简易灯光预设数据[3]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights4
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[4]
 * @desc 简易灯光预设数据[4]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights5
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[5]
 * @desc 简易灯光预设数据[5]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights6
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[6]
 * @desc 简易灯光预设数据[6]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights7
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[7]
 * @desc 简易灯光预设数据[7]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights8
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[8]
 * @desc 简易灯光预设数据[8]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param miniLights9
 * @type struct<miniLightsData>[]
 * @text 简易灯光预设数据[9]
 * @desc 简易灯光预设数据[9]，分成0 1 2 3...只是为了方便，可以以此来分类。实际上都等效。
 * @parent chaos
 * @default []
 *
 * @param region
 * @type struct<regionData>[]
 * @text 区域阴影设置
 * @desc 设置区域的阴影效果.
 * @parent chaos
 * @default []
 *
 * @param regionLights
 * @type struct<regionLightsData>[]
 * @text 区域灯光设置
 * @desc 区域灯光设置，在某区域上生成指定id的简易灯光
 * @parent chaos
 * @default []
 *
 * @param characterShadowList
 * @type file[]
 * @dir img/lights
 * @text 事件阴影图片列表
 * @desc 事件阴影图片列表，要设置事件的特殊阴影时，必须在此写上文件名进行预加载.
 * @parent chaos
 * @default []
 *
 * @param shadowDefault
 * @text 阴影默认设置
 *
 * @param characterShadowDefault
 * @type struct<characterShadowDefaultDetail>
 * @text 事件阴影默认值
 * @desc 事件阴影默认值
 * @parent shadowDefault
 * @default {"status":"false","tint":"#000000","opacity":"1","offsetX":"0","offsetY":"0","offsetDirX":"0~0~0~0","offsetDirY":"0~0~0~0","model":"D[]","yCut":"0"}
 *
 * @param playerShadowDefault
 * @type struct<playerShadowDefaultDetail>
 * @text 玩家阴影默认值
 * @desc 玩家阴影默认值
 * @parent shadowDefault
 * @default {"status":"false","tint":"#000000","opacity":"1","offsetX":"0","offsetY":"0","offsetDirX":"0~0~0~0","offsetDirY":"0~0~0~0","model":"D[]","yCut":"0"}
 *
 * @param defaultSetting
 * @text 其他设置
 *
 * @param playerInitLight
 * @type text
 * @text 玩家初始灯光
 * @desc 玩家初始灯光
 * @parent defaultSetting
 * @default 
 *
 * @param maskInitColor
 * @type text
 * @text 背景初始颜色
 * @desc 背景初始颜色,建议的值为：特黑#191919 较黑#202020 一般#292929 较明#393939 明#555555 特明#666666
 * @parent defaultSetting
 * @default #292929
 *
 * @param hidePrimordialShadow
 * @type boolean
 * @text 隐藏系统原生阴影
 * @desc 隐藏系统原生阴影
 * @parent defaultSetting
 * @default true
 *
 * @param defaultOpen
 * @type boolean
 * @text 默认打开灯光效果
 * @desc 默认打开灯光效果
 * @parent defaultSetting
 * @default true
 *
 * @param lightLayerZ
 * @type boolean
 * @text 灯光层是否在图片层之上
 * @desc 灯光层是否在图片层之上
 * @parent defaultSetting
 * @default true
 *
 * @param timeSystem
 * @text 时间系统设置
 *
 * @param timeSystemInit
 * @type boolean
 * @text 时间系统
 * @desc 是否使用时间系统
 * @parent timeSystem
 * @default false
 *
 * @param timeSystemStatus
 * @type boolean
 * @text 时间流逝
 * @desc 是否默认开启时间流逝
 * @parent timeSystem
 * @default false
 *
 * @param timeSystemSpeed
 * @type number
 * @text 与现实的流逝关系
 * @desc 现实中一秒等于游戏中多少秒
 * @parent timeSystem
 * @default 360
 *
 * @param timeSystemMode
 * @type boolean
 * @text 时间系统模式
 * @on 兼容其他时间系统
 * @off 自主运行
 * @desc true-有其他时间系统，灯光插件只会读取这些变量并改变画面色调。false-无其他时间系统，灯光插件自动使时间流逝。
 * @parent timeSystem
 * @default false
 *
 * @param timeSystemData1
 * @type variable
 * @text 秒所使用的变量
 * @desc 秒所使用的变量(0-59)
 * @parent timeSystem
 * @default 21
 *
 * @param timeSystemData2
 * @type variable
 * @text 分所使用的变量
 * @desc 分所使用的变量(0-59)
 * @parent timeSystem
 * @default 22
 *
 * @param timeSystemData3
 * @type variable
 * @text 时所使用的变量
 * @desc 时所使用的变量(0-23)
 * @parent timeSystem
 * @default 23
 *
 * @param timeSystemSwitch
 * @type switch
 * @text 夜晚开关
 * @desc 进入夜晚时打开此开关
 * @parent timeSystem
 * @default 20
 *
 * @param timeSystemMain
 * @type struct<timeSystemSettingList>[]
 * @text 时间节点设置
 * @desc 时间节点设置
 * @parent timeSystem
 * @default ["{\"startHour\":\"0\",\"indoorColor\":\"#292929\",\"outdoorColor\":\"#292929\",\"colorChangeDur\":\"30\",\"isNight\":\"true\"}","{\"startHour\":\"5\",\"indoorColor\":\"#555555\",\"outdoorColor\":\"#555555\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"7\",\"indoorColor\":\"#888888\",\"outdoorColor\":\"#ffffff\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"17\",\"indoorColor\":\"#ffa72e\",\"outdoorColor\":\"#ffa72e\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"19\",\"indoorColor\":\"#555555\",\"outdoorColor\":\"#555555\",\"colorChangeDur\":\"30\",\"isNight\":\"false\"}","{\"startHour\":\"20\",\"indoorColor\":\"#292929\",\"outdoorColor\":\"#292929\",\"colorChangeDur\":\"30\",\"isNight\":\"true\"}"]
 *
 * @param timeSystemHub
 * @type struct<timeSystemHub>
 * @text 时间系统UI设置
 * @desc 时间系统UI设置，这个是可选的，可以选择不显示ui。
 * @parent timeSystem
 * @default {"timeSystemHubStatus":"false","timeSystemHub":"0","timeSystemHubX":"0","timeSystemHubY":"0","timeSystemHubImg1":"ColckImage","timeSystemHubImg2":"HourHand","timeSystemHubImg3":"MiniteHand","timeSystemHubImg4":"SecondHand"}
 *
*/
/*~struct~timeSystemSettingList:
 *
 * @param startHour
 * @type number
 * @text 一个时间段的起始时间
 * @desc 一个时间段的起始时间
 * @default 0
 *
 * @param indoorColor
 * @type text
 * @text 此段的室内色调
 * @desc 此段的室内色调
 * @default #000000
 *
 * @param outdoorColor
 * @type text
 * @text 此段的室外色调
 * @desc 此段的室外色调
 * @default #000000
 *
 * @param colorChangeDur
 * @type number
 * @text 进入此段的色调变化时间
 * @desc 进入此段的色调变化时间(帧)
 * @default 30
 *
 * @param isNight
 * @type boolean
 * @text 是否是夜晚
 * @desc 是否是夜晚
 * @default false
 *
 *
 *
*/
/*~struct~timeSystemHub:
 *
 * @param timeSystemHubStatus
 * @type boolean
 * @text 时间地图ui默认显示
 * @desc 时间系统在地图上的UI是否默认显示
 * @default false
 *
 * @param timeSystemHub
 * @type select
 * @text UI类型
 * @desc 时间系统的地图UI类型
 * @option 表盘
 * @value 0
 * @option 数字
 * @value 1
 * @default 0
 *
 * @param timeSystemHubX
 * @type number
 * @text UI的X偏移
 * @desc UI的X偏移，“表盘”的默认X位置为画面宽度减100，“数字”的默认X位置为画面中间。
 * @default 0
 *
 * @param timeSystemHubY
 * @type number
 * @text UI的Y偏移
 * @desc UI的Y偏移，“表盘”的默认Y位置为0，“数字”的默认Y位置为0。
 * @default 0
 *
 * @param timeSystemHubImg1
 * @type file
 * @dir img/system/
 * @text UI的表盘图片
 * @desc 当“UI类型”为表盘时，使用的表盘图片。
 * @default ColckImage
 *
 * @param timeSystemHubImg2
 * @type file
 * @dir img/system/
 * @text 表盘UI的时针图片
 * @desc 当“UI类型”为表盘时，使用表盘时针图片。
 * @default HourHand
 *
 * @param timeSystemHubImg3
 * @type file
 * @dir img/system/
 * @text 表盘UI的分针图片
 * @desc 当“UI类型”为表盘时，使用表盘分针图片。
 * @default MiniteHand
 *
 * @param timeSystemHubImg4
 * @type file
 * @dir img/system/
 * @text 数字时钟的背景
 * @desc 当“UI类型”为数字时，数字时钟的背景图片。
 * @default NumberBackground
*/
/*~struct~presetData:
 *
 * @param ======0
 *
 * @param id
 * @type text
 * @text 灯光编号
 * @desc 灯光编号
 * @default test
 *
 * @param ======1
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text 灯光图像
 * @desc 灯光图像
 * @default circle
 *
 * @param ======2
 *
 * @param scaleX
 * @type text
 * @text x放大率*
 * @desc x放大率,1为标准大小.
 * @default 1
 *
 * @param scaleY
 * @type text
 * @text y放大率*
 * @desc y放大率,1为标准大小.
 * @default 1
 *
 * @param ======3
 *
 * @param tint
 * @type text
 * @text 附加颜色*
 * @desc 附加颜色.
 * @default #FFFFFF
 *
 * @param ======4
 *
 * @param offsetX
 * @type text
 * @text 基础X偏移*
 * @desc 基础X偏移.
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text 基础y偏移*
 * @desc 基础y偏移.
 * @default 0
 *
 * @param dirOffsetX
 * @type text
 * @text 方向附加x偏移
 * @desc 方向附加x偏移,指定当当前光效绑定事件时,光效的位置随事件的朝向变化而变化.格式为 朝下时的x偏移~朝左~朝右~朝上.
 * @default 0~0~0~0
 *
 * @param dirOffsetY
 * @type text
 * @text 方向附加y偏移
 * @desc 方向附加y偏移,指定当当前光效绑定事件时,光效的位置随事件的朝向变化而变化.格式为 朝下时的y偏移~朝左~朝右~朝上.
 * @default 0~0~0~0
 *
 * @param ======5
 *
 * @param opacity
 * @type text
 * @text 不透明度*
 * @desc 不透明度,写0-1的数字.
 * @default 1
 *
 * @param ======6
 *
 * @param rotation
 * @type text
 * @text 角度*
 * @desc 角度,写0-360的数字.
 * @default 0
 *
 * @param rotationMouse
 * @type boolean
 * @text 是否附加朝向鼠标的角度
 * @desc 是否附加朝向鼠标的角度，打开此开关后，最好将其他的角度都设置成0.
 * @default false
 *
 * @param dirRotation
 * @type text
 * @text 方向角度
 * @desc 光的角度与事件的朝向有对应关系.格式为 朝下时的转角~朝左~朝右~朝上.例如:180~270~90~0。写8个时指八方移动的角度。
 * @default 0~0~0~0
 *
 * @param dirRotationFrame
 * @type text
 * @text 方向角改变速度
 * @desc 度每帧.在事件的朝向改变时，若dirRotation有对应的值，则动态变化dirRotation,建议写10
 * @default 0
 *
 * @param rotationAuto
 * @type text
 * @text 旋转速度
 * @desc 度每帧.旋转速度,在角度和方向角度的前提下,每帧为其增加一定的角度.
 * @default 0
 *
 * @param ======7
 *
 * @param shadowWall
 * @type boolean
 * @text 是否显示区域投影
 * @desc 是否显示区域投影
 * @default false
 *
 * @param ======8
 *
 * @param shadowCharacter
 * @type boolean
 * @text 是否显示事件投影
 * @desc 是否显示事件投影
 * @default false
 *
 * @param shadowCharacterOffsetX
 * @type text
 * @text 投影点x偏移
 * @desc 投影点x偏移
 * @default 0
 *
 * @param shadowCharacterOffsetY
 * @type text
 * @text 投影点y偏移
 * @desc 投影点y偏移
 * @default 0
 *
 * @param shadowCharacterMaxOpacity
 * @type text
 * @text 事件投影最大不透明度
 * @desc 事件投影最大不透明度
 * @default 0.6
 *
 * @param shadowCharacterMaxDistance
 * @type text
 * @text 事件投影最大半径
 * @desc 事件投影最大半径
 * @default 150
 *
 * @param shadowCharacterShakeX
 * @type select
 * @text 事件投影抖动
 * @desc 事件投影抖动的纵向抖动(实际为纵向放大率,可同标*的数据一样自由设计)
 * @default 1
 * @option 不抖动
 * @value 1
 * @option 轻微抖动
 * @value 40|1~5/1.01~5/1~10|1~5/1.01~5/1
 * @option 一般抖动
 * @value 40|1~5/1.02~5/1~10|1~5/1.02~5/1
 * @option 较强烈抖动
 * @value 40|1~5/1.03~5/1~10|1~5/1.03~5/1
 * @option 强烈抖动
 * @value 40|1~5/1.04~5/1~10|1~5/1.04~5/1
 *
 * @param ======9
 *
 * 
 *
*/
/*~struct~regionLightsData:
 *
 * @param ======0
 *
 * @param id
 * @type number
 * @min 1
 * @max 255
 * @text 区域id
 * @desc 区域id
 * @default 1
 *
 * @param lightId
 * @type text
 * @text 简易灯光id
 * @desc 简易灯光id
 * @default 1
 *
 * @param ======1
 *
 * @param showCondition
 * @type select
 * @text 显示条件
 * @desc 显示条件
 * @default 0
 * @option 一直显示
 * @value 0
 * @option 玩家身处此区域时显示
 * @value 1
 * @option 玩家身处此格时显示
 * @value 2
 *
 * @param showConditionExtra
 * @type note
 * @text 显示条件扩展
 * @desc 显示条件扩展,在此处写js代码来返回(return)决定是否显示的布尔值，使用ifShow获取上方“显示条件”的判定结果.
 * @default ""
 *
 *
 * @param ======2
 *
*/
/*~struct~miniLightsData:
 *
 * @param ======0
 *
 * @param id
 * @type text
 * @text 简易灯光id
 * @desc 简易灯光id
 * @default 1
 *
 * @param ======1
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text 灯光图像
 * @desc 灯光图像
 * @default circle
 *
 * @param ======2
 *
 * @param scaleX
 * @type text
 * @text x放大率*
 * @desc x放大率,1为标准大小.
 * @default 1
 *
 * @param scaleY
 * @type text
 * @text y放大率*
 * @desc y放大率,1为标准大小.
 * @default 1
 *
 * @param ======3
 *
 * @param tint
 * @type text
 * @text 附加颜色*
 * @desc 附加颜色.
 * @default #FFFFFF
 *
 * @param ======4
 *
 * @param offsetX
 * @type text
 * @text 基础X偏移*
 * @desc 基础X偏移.
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text 基础y偏移*
 * @desc 基础y偏移.
 * @default 0
 *
 * @param ======5
 *
 * @param opacity
 * @type text
 * @text 不透明度*
 * @desc 不透明度,写0-1的数字.
 * @default 1
 *
 * @param ======6
 *
 * @param rotation
 * @type text
 * @text 角度*
 * @desc 角度,写0-360的数字.
 * @default 0
 *
 * @param ======7
 *
 * 
 *
*/
/*~struct~regionData:
 *
 * @param ======0
 * @default 
 *
 * @param id
 * @type number
 * @min 1
 * @max 255
 * @text 区域id
 * @desc 区域id
 * @default 1
 *
 * @param ======1
 *
 * @param rectOpacity
 * @type text
 * @text 遮挡阴影不透明度
 * @desc 上方遮挡不透明度,范围是0-1之间的小数.
 * @default 1
 *
 * @param rectTint
 * @type text
 * @text 遮挡阴影特殊颜色
 * @desc 遮挡阴影特殊颜色,#000000会让此区块有黑色遮挡,#ffffff会让此区块完全明亮
 * @default #000000
 *
 * @param rectShape
 * @type select
 * @text 遮挡阴影形状
 * @desc 遮挡阴影的颜色,除了可以选择外,也可以进行手动输入,请根据范例的格式来写.(0直线1顺圆弧正2顺圆弧逆3逆圆弧正4逆圆弧逆5新开原点)
 * @default [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 不遮挡
 * @value []
 * @option 正方形(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 中心正方形1/2(24*24)
 * @value [{t:0,x:12,y:12},{t:0,x:36,y:12},{t:0,x:36,y:36},{t:0,x:12,y:36}]
 * @option 圆形(48*48)
 * @value [{t:1,x:24,y:0,r:24},{t:1,x:24,y:48,r:24}]
 * @option 中心圆形1/2(48*48)
 * @value [{t:1,x:24,y:12,r:12},{t:1,x:24,y:36,r:12}]
 * @option 左上方三角(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:0,y:48}]
 * @option 右上方三角(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:0},{t:0,x:48,y:48}]
 * @option 右下方三角(48*48)
 * @value [{t:0,x:48,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 左下方三角(48*48)
 * @value [{t:0,x:0,y:0},{t:0,x:48,y:48},{t:0,x:0,y:48}]
 * @option 左上方1/4圆(48*48)
 * @value [{t:0,x:0,y:0},{t:1,x:48,y:0,r:48},{t:0,x:0,y:48}]
 * @option 右上方1/4圆(48*48)
 * @value [{t:0,x:48,y:0},{t:1,x:48,y:48,r:48},{t:0,x:0,y:0}]
 * @option 右下方1/4圆(48*48)
 * @value [{t:0,x:48,y:48},{t:1,x:0,y:48,r:48},{t:0,x:48,y:0}]
 * @option 左下方1/4圆(48*48)
 * @value [{t:0,x:0,y:48},{t:1,x:0,y:0,r:48},{t:0,x:48,y:48}]
 * @option 左上方三角1/2(24*24)
 * @value [{t:0,x:0,y:0},{t:0,x:24,y:0},{t:0,x:0,y:24}]
 * @option 右上方三角1/2(24*24)
 * @value [{t:0,x:24,y:0},{t:0,x:48,y:0},{t:0,x:48,y:24}]
 * @option 右下方三角1/2(24*24)
 * @value [{t:0,x:48,y:24},{t:0,x:48,y:48},{t:0,x:24,y:48}]
 * @option 左下方三角1/2(24*24)
 * @value [{t:0,x:0,y:24},{t:0,x:24,y:48},{t:0,x:0,y:48}]
 * @option 左上方1/4圆1/2(24*24)
 * @value [{t:0,x:0,y:0},{t:1,x:24,y:0,r:24},{t:0,x:0,y:24}]
 * @option 右上方1/4圆1/2(24*24)
 * @value [{t:0,x:48,y:0},{t:1,x:48,y:24,r:24},{t:0,x:24,y:0}]
 * @option 右下方1/4圆1/2(24*24)
 * @value [{t:0,x:48,y:48},{t:1,x:24,y:48,r:24},{t:0,x:48,y:24}]
 * @option 左下方1/4圆1/2(24*24)
 * @value [{t:0,x:0,y:48},{t:1,x:0,y:24,r:24},{t:0,x:24,y:48}]
 * @option 左方1/2圆(24*48)
 * @value [{t:0,x:0,y:0},{t:3,x:0,y:48,r:24},{t:0,x:0,y:0}]
 * @option 上方1/2圆(48*24)
 * @value [{t:0,x:48,y:0},{t:3,x:0,y:0,r:24},{t:0,x:48,y:0}]
 * @option 右方1/2圆(24*48)
 * @value [{t:0,x:48,y:48},{t:3,x:48,y:0,r:24},{t:0,x:48,y:48}]
 * @option 下方1/2圆(48*24)
 * @value [{t:0,x:0,y:48},{t:3,x:48,y:48,r:24},{t:0,x:0,y:48}]
 *
 * @param ======2
 *
 * @param shadowShow
 * @type boolean
 * @text 实时阴影
 * @desc 是否产生实时阴影
 * @default false
 *
 * @param shadowHeight
 * @type number
 * @min 0
 * @max 8
 * @text 实时阴影高度
 * @desc 实时阴影显示的高度
 * @default 0
 *
 * @param shadowTint
 * @type text
 * @text 实时阴影颜色
 * @desc 实时阴影颜色。虽然预留了此参数，但是并不建议修改。
 * @default #000000
 *
 * @param ======3
 *
*/
/*~struct~characterShadowDefaultDetail:
 *
 * @param status
 * @type boolean
 * @text 是否默认显示
 * @desc 是否默认显示
 * @default false
 *
 * @param tint
 * @type text
 * @text 阴影色调
 * @desc 阴影色调，#000000为黑色，#ffffff为白色.
 * @default #000000
 *
 * @param opacity
 * @type text
 * @text 阴影不透明度
 * @desc 阴影不透明度
 * @default 1
 *
 * @param offsetX
 * @type text
 * @text 阴影底部的x偏移
 * @desc 阴影底部的x偏移
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text 阴影底部的y偏移
 * @desc 阴影底部的y偏移
 * @default 0
 *
 * @param offsetDirX
 * @type text
 * @text 朝各个方向时阴影底部的x偏移
 * @desc 朝各个方向时阴影底部的x偏移
 * @default 0~0~0~0
 *
 * @param offsetDirY
 * @type text
 * @text 朝各个方向时阴影底部的y偏移
 * @desc 朝各个方向时阴影底部的y偏移
 * @default 0~0~0~0
 *
 * @param model
 * @type text
 * @text 投影模式
 * @desc 投影模式
 * @default D[]
 *
 * @param yCut
 * @type text
 * @text 截取与上浮
 * @desc 截取与上浮
 * @default 0
 *
*/
/*~struct~playerShadowDefaultDetail:
 *
 * @param status
 * @type boolean
 * @text 是否默认显示
 * @desc 是否默认显示
 * @default false
 *
 * @param imgName
 * @type file
 * @dir img/lights
 * @text 影子图像
 * @desc 影子图像，留空则使用玩家的当前行走图作为影子.
 * @default 
 *
 * @param tint
 * @type text
 * @text 阴影色调
 * @desc 阴影色调，#000000为黑色，#ffffff为白色.
 * @default #000000
 *
 * @param opacity
 * @type text
 * @text 阴影不透明度
 * @desc 阴影不透明度
 * @default 1
 *
 * @param offsetX
 * @type text
 * @text 阴影底部的x偏移
 * @desc 阴影底部的x偏移
 * @default 0
 *
 * @param offsetY
 * @type text
 * @text 阴影底部的y偏移
 * @desc 阴影底部的y偏移
 * @default 0
 *
 * @param offsetDirX
 * @type text
 * @text 朝各个方向时阴影底部的x偏移
 * @desc 朝各个方向时阴影底部的x偏移
 * @default 0~0~0~0
 *
 * @param offsetDirY
 * @type text
 * @text 朝各个方向时阴影底部的y偏移
 * @desc 朝各个方向时阴影底部的y偏移
 * @default 0~0~0~0
 *
 * @param model
 * @type text
 * @text 投影模式
 * @desc 投影模式
 * @default D[]
 *
 * @param yCut
 * @type text
 * @text 截取与上浮
 * @desc 截取与上浮
 * @default 0
 *
*/
//==========================================================
//
//==========================================================
var QJ = QJ || {};
QJ.LL = QJ.LL || {};
var Imported = Imported || {};
Imported.QJLighting = true;
//==========================================================
//
//==========================================================
QJ.LL.globalText = [
"PIXI版本过低，请更新。",
"设定的灯光图像未加载成功。图像名: ",
"指定事件的阴影时，需将阴影图片名写在插件参数的 事件阴影列表 中。\n没有做此操作的事件的阴影名，事件id和地图id分别为:",
"未设置此灯光。此灯光的id为：",
"未设置此区域灯光。此灯光的id为：",
"在区域上设置了显示简易灯光，但是没有此id的简易灯光。区域和简易灯光id为：",
"使用QJ.LL.tempLight生成临时灯光，但是指定的要生成的简易灯光并未设置，要设置的简易灯光id为："
];
QJ.LL.error = (content)=>{throw new Error(content+".");}
QJ.LL.isOnMapAndHaveLoaded = function() {
    return SceneManager._scene&&SceneManager._scene._spriteset&&
        SceneManager._scene.constructor.name == "Scene_Map";
}
//==========================================================
//
//==========================================================
if (Number(PIXI.VERSION[0])<5) {throw new Error(QJ.LL.globalText[0]);}
//==========================================================
//
//==========================================================
function QJFrameLight() {
    this.initialize.apply(this, arguments);
}
function Game_QJLightLayer() {
    this.initialize.apply(this, arguments);
}
function Game_QJLightLayerMini() {
    this.initialize.apply(this, arguments);
}
//==========================================================
//
//==========================================================
(($ = {})=>{
//==========================================================
//preset
//==========================================================
const pluginName = "QJ-Lighting";
const parameters = PluginManager.parameters(pluginName);
const hidePrimordialShadow = eval(parameters.hidePrimordialShadow);
const characterShadowPresetList = [];
const characterShadowDefault = JsonEx.parse(parameters.characterShadowDefault);
const playerShadowDefault = JsonEx.parse(parameters.playerShadowDefault);
const characterShadowPresetListTexture = {};
const presetDataList = {};
const miniLightsData = {};
const regionLightsData = {};
const regionData = {};
const saveTexture = {};//save texture to pretend reloading or rerendering
const standardTile = 48;//standardTile
const standardExpand = 96;//standardExpand
const lightLayerZ = eval(parameters.lightLayerZ);
//==========================================================
//
//==========================================================
let dx=0,dy=0,dx48=0,dy48=0,gw=0,gh=0,gws=0,ghs=0;//map display x/y.graphhics width/height.
//============================
//============================
//============================
//============================
//============================
//============================
//==========================================================
//ImageManager
//==========================================================
ImageManager.loadLightQJLL = function(filename) {
    let bit = this.loadBitmap('img/lights/', filename);
    bit._name = filename;
    return bit;
};
//==========================================================
//
//==========================================================
let mouseX=0,mouseY=0;
const LL_TouchInput__onTouchMove = TouchInput._onTouchMove;
TouchInput._onTouchMove = function(event) {
    LL_TouchInput__onTouchMove.call(this,event);
    mouseX = Graphics.pageToCanvasX(event.pageX);
    mouseY = Graphics.pageToCanvasY(event.pageY);
};
const LL_TouchInput__onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event) {
    LL_TouchInput__onMouseMove.call(this,event);
    mouseX = Graphics.pageToCanvasX(event.pageX);
    mouseY = Graphics.pageToCanvasY(event.pageY);
};
//==========================================================
//
//==========================================================
QJ.LL.calculateAngleByTwoPoint=function(x,y,ex,ey){
    let ro;
    if (ex>x&&ey<y)  ro=(-Math.atan((x-ex)/(y-ey)));
    if (ex>x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey<y)  ro=(2*Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex==x&&ey>y) ro=Math.PI;
    if (ex==x&&ey<y) ro=0;
    if (ex>x&&ey==y) ro=Math.PI/2;
    if (ex<x&&ey==y) ro=Math.PI*3/2;
    if (ex==x&&ey==y)ro=null;
    return ro;
};
QJ.LL.calculateShape = function(data) {
    if (!data||data.length==0) return [];
    for (let i=0,il=data.length,
        cpx,cpy,r,x,y,nx,ny,chax,chay,cx,cy,pl,al,initX=data[0].x,initY=data[0].y;i<il;i++) {
        if (data[i].t==0) continue;
        else if (data[i].t==5) {
            initX=data[i].x;
            initY=data[i].y;
            continue;
        }
        x = data[i].x;
        y = data[i].y;
        nx = data[i+1]?data[i+1].x:initX;
        ny = data[i+1]?data[i+1].y:initY;
        chax = x-nx;
        chay = y-ny;
        r = data[i].r;
        cpx = (x+nx)/2;
        cpy = (y+ny)/2;
        pl = Math.sqrt(chax*chax+chay*chay);
        al = Math.sqrt(r*r-pl*pl/4);
        if (data[i].t==1) {
            data[i].cx = cpx+al*(chay/pl||0);
            data[i].cy = cpy-al*(chax/pl||0);
            data[i].ccw = false;
        } else if (data[i].t==2) {
            data[i].cx = cpx+al*(chay/pl||0);
            data[i].cy = cpy-al*(chax/pl||0);
            data[i].ccw = false;
        } else if (data[i].t==3) {
            data[i].cx = cpx-al*(chay/pl||0);
            data[i].cy = cpy+al*(chax/pl||0);
            data[i].ccw = true;
        } else if (data[i].t==4) {
            data[i].cx = cpx-al*(chay/pl||0);
            data[i].cy = cpy+al*(chax/pl||0);
            data[i].ccw = true;
        }
        data[i].cx = Math.round(data[i].cx);
        data[i].cy = Math.round(data[i].cy);
        data[i].sa = QJ.LL.calculateAngleByTwoPoint(data[i].cx,data[i].cy, x, y)-Math.PI/2;
        data[i].ea = QJ.LL.calculateAngleByTwoPoint(data[i].cx,data[i].cy,nx,ny)-Math.PI/2;
    }
    return data;
};
QJ.LL.calculateDirAttribute = function(data,attributeName,rotate) {
    try{
        let detail = data[attributeName].split("~");
        if (detail.length==4) {
            data[attributeName] = [0,0,Number(detail[0])*(rotate?Math.PI/180:1),0,Number(detail[1])*(rotate?Math.PI/180:1),0,
                Number(detail[2])*(rotate?Math.PI/180:1),0,Number(detail[3])*(rotate?Math.PI/180:1),0];
        } else {
            data[attributeName] = [0,
                Number(detail[0])*(rotate?Math.PI/180:1),
                Number(detail[1])*(rotate?Math.PI/180:1),
                Number(detail[2])*(rotate?Math.PI/180:1),
                Number(detail[3])*(rotate?Math.PI/180:1),
                0,
                Number(detail[4])*(rotate?Math.PI/180:1),
                Number(detail[5])*(rotate?Math.PI/180:1),
                Number(detail[6])*(rotate?Math.PI/180:1),
                Number(detail[7])*(rotate?Math.PI/180:1)];
        }
    } catch(e) {
        QJ.LL.error(attributeName + " can not be "+data[attributeName]);
    }
};
QJ.LL.getCSModel = function(value) {
    if (value[0]=="D") {
        if (value[1]=="[") {
            return [0,0];
        } else if (value[1]=="M") {
            return [0,1,Number(value.match(/DM\[([^\]]+)\]/)[1])];
        } else if (value[1]=="W") {
            return [0,2,Number(value.match(/DW\[([^\]]+)\]/)[1])];
        }
    } else if (value[0]=="B") {
        if (value[1]=="[") {
            return [1,0];
        } else if (value[1]=="M") {
            return [1,1,Number(value.match(/BM\[([^\]]+)\]/)[1])];
        } else if (value[1]=="W") {
            return [1,2,Number(value.match(/BW\[([^\]]+)\]/)[1])];
        }
    }
    return [0,0];
};
(()=>{
    //===================================
    let detail;
    //===================================
    characterShadowDefault.status=eval(characterShadowDefault.status);
    characterShadowDefault.opacity=Number(characterShadowDefault.opacity);
    characterShadowDefault.offsetX=Number(characterShadowDefault.offsetX);
    characterShadowDefault.offsetY=Number(characterShadowDefault.offsetY);
    characterShadowDefault.yCut=Number(characterShadowDefault.yCut);
    //===================================
    playerShadowDefault.status=eval(playerShadowDefault.status);
    playerShadowDefault.opacity=Number(playerShadowDefault.opacity);
    playerShadowDefault.offsetX=Number(playerShadowDefault.offsetX);
    playerShadowDefault.offsetY=Number(playerShadowDefault.offsetY);
    playerShadowDefault.yCut=Number(playerShadowDefault.yCut);
    QJ.LL.calculateDirAttribute(playerShadowDefault,"offsetDirX");
    QJ.LL.calculateDirAttribute(playerShadowDefault,"offsetDirY");
    playerShadowDefault.model=QJ.LL.getCSModel(playerShadowDefault.model);
    //===================================
    let sR=eval(parameters.region);
    for (let i of sR) {
        detail = JsonEx.parse(i);
        detail.id = Number(detail.id);
        detail.rectOpacity = Number(detail.rectOpacity);
        detail.rectTint = detail.rectTint;
        detail.rectShape = QJ.LL.calculateShape(eval(detail.rectShape));
        detail.shadowShow = eval(detail.shadowShow);
        detail.shadowOpacity = 1;//Number(detail.shadowOpacity);
        detail.shadowTint = Number("0x"+detail.shadowTint.substr(1));
        detail.shadowHeight = Number(detail.shadowHeight);
        regionData[detail.id] = detail;
    }
    //===================================
    let ps=eval(parameters.lightPreset);
    for (let i=1;i<=9;i++) ps.push.apply(ps,eval(parameters["lightPreset"+i]));
    for (let i of ps) {
        detail = JsonEx.parse(i);
        //===============================================
        detail.character = null;
        detail.anchorX=0.5;
        detail.anchorY=0.5;
        //===============================================
        QJ.LL.calculateDirAttribute(detail,"dirOffsetX");
        QJ.LL.calculateDirAttribute(detail,"dirOffsetY");
        QJ.LL.calculateDirAttribute(detail,"dirRotation",true);
        //===============================================
        saveTexture[detail.imgName] = detail.imgName;
        detail.dirRotationFrame = Number(detail.dirRotationFrame);
        detail.rotationAuto = Number(detail.rotationAuto)*Math.PI/180;
        detail.shadowCharacter = eval(detail.shadowCharacter);
        detail.shadowWall = eval(detail.shadowWall);
        detail.shadowCharacterOffsetX = Number(detail.shadowCharacterOffsetX);
        detail.shadowCharacterOffsetY = Number(detail.shadowCharacterOffsetY);
        detail.shadowCharacterMaxOpacity = Number(detail.shadowCharacterMaxOpacity);
        detail.shadowCharacterMaxDistance = Number(detail.shadowCharacterMaxDistance);
        //===============================================
        detail.rotationMouse = detail.rotationMouse?eval(detail.rotationMouse):false;
        //===============================================
        presetDataList[detail.id] = detail;
        //===============================================
    }
    //===================================
    ps=eval(parameters.miniLights);
    for (let i=1;i<=9;i++) ps.push.apply(ps,eval(parameters["miniLights"+i]));
    for (let i of ps) {
        detail = JsonEx.parse(i);
        //===============================================
        saveTexture[detail.imgName] = detail.imgName;
        detail.anchorX=0.5;
        detail.anchorY=0.5;
        detail.during = -1;
        //===============================================
        miniLightsData[detail.id] = detail;
        //===============================================
    }
    //===================================
    ps=eval(parameters.regionLights);
    for (let i of ps) {
        detail = JsonEx.parse(i);
        //===============================================
        if (miniLightsData[detail.lightId]) {
            regionLightsData[Number(detail.id)] = JsonEx.makeDeepCopy(miniLightsData[detail.lightId]);
            regionLightsData[Number(detail.id)].showCondition = Number(detail.showCondition);
            regionLightsData[Number(detail.id)].showConditionExtra = detail.showConditionExtra.length>2?
                eval("(function(ifShow){"+eval(detail.showConditionExtra)+"})"):null;
        } else {
            QJ.LL.error(QJ.LL.globalText[5]+id+" "+detail.lightId);
        }
        //===============================================
    }
    //===================================
    for (let i of characterShadowPresetList) {
        characterShadowPresetListTexture[i] = i;
    }
    //===================================
})();
//==========================================================
//hidePrimordialShadow
//==========================================================
if (hidePrimordialShadow) {
    Tilemap.prototype._addShadow = function(bitmap, shadowBits, dx, dy) {
    
    };
}
//==========================================================
//saveTexture
//==========================================================
$.Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    if (!$.Scene_Boot_isReady.apply(this,arguments)) {
        return false;
    }
    if (!DataManager.LightingQJPreLoad) {
        for (let i in saveTexture) {
            saveTexture[i] = ImageManager.loadLightQJLL(saveTexture[i]);
        }
        for (let i in characterShadowPresetListTexture) {
            characterShadowPresetListTexture[i] = ImageManager.loadLightQJLL(characterShadowPresetListTexture[i]);
        }
        DataManager.LightingQJPreLoad = true;
    }
    if (!DataManager.LightingQJPreLoadOver) {
        for (let i in saveTexture) {
            if (!saveTexture[i]) return false;
            if (!saveTexture[i].width) return false;
            if (!saveTexture[i].copyTexture) {
                QJ.LL.addTexture(i,saveTexture[i]);
            }
        }
        for (let i in characterShadowPresetListTexture) {
            if (!characterShadowPresetListTexture[i]) return false;
            if (!characterShadowPresetListTexture[i].width) return false;
            if (!characterShadowPresetListTexture[i].copyTexture) {
                QJ.LL.addShadowTexture(i,characterShadowPresetListTexture[i]);
            }
        }
        QJ.LL.addMaskTexture("#000000",gws,ghs);
        DataManager.LightingQJPreLoadOver = true;
    }
    //==================================
    return true;
};
//==========================================================
//saveTexture
//==========================================================
QJ.LL.generateMultiTextureShader = function() {
    let vertexSrc = `
        precision highp float;
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute vec4 aColor;
        attribute float aTextureId;
        uniform mat3 projectionMatrix;
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        varying float vTextureId;
        void main(void){
            gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
            vTextureCoord = aTextureCoord;
            vTextureId = aTextureId;
            vColor = aColor;
        }
    `;
    let fragmentSrc = `
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        varying float vTextureId;
        uniform sampler2D uSamplers[2];
        uniform float sRSin;
        uniform float sRCos;
        uniform float sROffsetX;
        uniform float sROffsetY;
        uniform float sRScaleX;
        uniform float sRScaleY;
        uniform float sRScaleX2;
        uniform float sRScaleY2;
        uniform float frameX;
        uniform float frameY;
        uniform float frameW;
        uniform float frameH;
        uniform float startX;
        uniform float startY;
        void main(void){
            if (vTextureCoord.x<startX||vTextureCoord.y<startY||vTextureCoord.x>1.0-startX||vTextureCoord.y>1.0-startY) {
                gl_FragColor = vec4(0,0,0,0);
            } else {
                vec4 color0 = texture2D(uSamplers[0],vec2(
                    (vTextureCoord.x-startX)/(1.0-2.0*startX)/frameW+frameX,
                    (vTextureCoord.y-startY)/(1.0-2.0*startY)/frameH+frameY));
                vec4 color1 = texture2D(uSamplers[1],vec2(
                    (vTextureCoord.x*sRCos*sRScaleX-vTextureCoord.y*sRSin*sRScaleY)*sRScaleX2+sROffsetX,
                    (vTextureCoord.y*sRCos*sRScaleY+vTextureCoord.x*sRSin*sRScaleX)*sRScaleY2+sROffsetY));
                gl_FragColor = color0 * color1 * vColor;
                
            }
        }
    `;
    return new PIXI.Shader.from(vertexSrc, fragmentSrc, {
        uSamplers: [0,1],
        projectionMatrix: new PIXI.Matrix(),
        sRSin:0,
        sRCos:0,
        sROffsetX:0,
        sROffsetY:0,
        sRScaleX:0,
        sRScaleY:0,
        sRScaleX2:0,
        sRScaleY2:0,
        frameX:0,
        frameY:0,
        frameW:0,
        frameH:0,
        startX:0,
        startY:0
    });
}
//==========================================================
//saveTexture
//==========================================================
QJ.LL.addShadowTexture = function(imgName,bitmap) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    let w=bitmap.width,h=bitmap.height;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.globalCompositeOperation = 'source-over';
    lscontext.drawImage(bitmap._canvas?bitmap._canvas:bitmap._image,0,0,w,h,0,0,w,h);
    lsBaseTexture.update();
    lsBaseTexture.copyTexture = true;
    characterShadowPresetListTexture[imgName] = lsBaseTexture;
};
QJ.LL.addTexture = function(imgName,bitmap) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    let w=bitmap.width,h=bitmap.height;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.globalCompositeOperation = 'source-over';
    lscontext.drawImage(bitmap._canvas?bitmap._canvas:bitmap._image,0,0,w,h,0,0,w,h);
    lsBaseTexture.update();
    lsBaseTexture.copyTexture = true;
    saveTexture[imgName] = lsBaseTexture;
};
QJ.LL.addMaskTexture  = function(color,w,h) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.fillStyle = color;
    lscontext.fillRect(0,0,w,h);
    lsBaseTexture.update();
    lsBaseTexture.copyTexture = true;
    saveTexture["___"] = lsBaseTexture;
};
QJ.LL.findSprite = function(character) {
    if (!QJ.LL.isOnMapAndHaveLoaded()) return null;
    for (let i of SceneManager._scene._spriteset._characterSprites) {
        if (i._character == character) return i;
    }
    return null;
}
QJ.LL.getCharacter = function(id) {
    if (id==-1) return $gamePlayer;
    else return $gameMap.event(id);
}
QJ.LL.calculateAnnotation = function(event) {
    let page=null,content="";
    try{
        page=event.page();
    } catch(e) {
        page=null;
    }
    if (page) {
        if (page.list[0].code === 108) {
            let i=0;
            while (page.list[i].code === 408 || page.list[i].code === 108) {
                content=content + page.list[i].parameters[0];
                i++;
            }
        }
    }
    return content;
};
QJ.LL.getLLData = function(event,annotation) {
    if (annotation.length<=0) return "";
    let detail = annotation.match(/<QJLL:[^>]*>/i);
    return detail?(detail[0].substr(6,detail[0].length-7)):"";
}
QJ.LL.getLLDataDetail = function(detail,annotation) {
    for (let i=0,id=annotation.match(/<QJLL-[^:]*:[^>]*>/ig)||[],il=id.length,detailData;i<il;i++) {
        detailData = id[i].match(/<QJLL-([^:]*):([^>]*)>/i);
        detail[detailData[1]] = detailData[2];
        if (detailData[1]=="dirOffsetX") QJ.LL.calculateDirAttribute(detail,"dirOffsetX");
        else if (detailData[1]=="dirOffsetY") QJ.LL.calculateDirAttribute(detail,"dirOffsetY");
        else if (detailData[1]=="dirRotation") QJ.LL.calculateDirAttribute(detail,"dirRotation",true);
        else if (detailData[1]=="dirRotationFrame") detail.dirRotationFrame = Number(detail.dirRotationFrame);
        else if (detailData[1]=="rotationAuto") detail.rotationAuto = Number(detail.rotationAuto)*Math.PI/180;
        else if (detailData[1]=="shadowCharacter") detail.shadowCharacter = eval(detail.shadowCharacter);
        else if (detailData[1]=="shadowWall") detail.shadowWall = eval(detail.shadowWall);
        else if (detailData[1]=="shadowCharacterMaxOpacity") detail.shadowCharacterMaxOpacity = Number(detail.shadowCharacterMaxOpacity);
        else if (detailData[1]=="shadowCharacterMaxDistance") detail.shadowCharacterMaxDistance = Number(detail.shadowCharacterMaxDistance);
        else if (detailData[1]=="rotationMouse") detail.rotationMouse = eval(detail.rotationMouse);
    }
}
QJ.LL.getCSData = function(detail,annotation) {
    let csData = JsonEx.makeDeepCopy(characterShadowDefault);
    csData.imgName = '';
    for (let i=0,id=annotation.match(/<QJCS-[^:]*:[^>]*>/ig)||[],il=id.length,detailData;i<il;i++) {
        detailData = id[i].match(/<QJCS-([^:]*):([^>]*)>/i);
        csData[detailData[1]] = detailData[2];
    }
    csData.model=QJ.LL.getCSModel(csData.model);
    QJ.LL.calculateDirAttribute(csData,"offsetDirX");
    QJ.LL.calculateDirAttribute(csData,"offsetDirY");
    csData.offsetX=Number(csData.offsetX);
    csData.offsetY=Number(csData.offsetY);
    csData.opacity=Number(csData.opacity);
    csData.status=eval(csData.status);
    csData.tint=Number("0x"+csData.tint.substr(1));
    csData.yCut=Number(csData.yCut);
    return csData;
}
QJ.LL.preset = function(id,character) {
    //===============================================
    if (!presetDataList[id]) {
        QJ.LL.error(QJ.LL.globalText[3]+id);
    }
    //===============================================
    let detail = JsonEx.makeDeepCopy(presetDataList[id]);
    //===============================================
    if (character) QJ.LL.getLLDataDetail(detail,character.annotation);
    //===============================================
    detail.scaleX = new QJFrameLight("scaleX",detail.scaleX,0);
    detail.scaleY = new QJFrameLight("scaleY",detail.scaleY,0);
    detail.tint = new QJFrameLight("tint",detail.tint,1);
    detail.offsetX = new QJFrameLight("offsetX",detail.offsetX,0);
    detail.offsetY = new QJFrameLight("offsetY",detail.offsetY,0);
    detail.opacity = new QJFrameLight("opacity",detail.opacity,0);
    detail.shadowCharacterOffsetX = new QJFrameLight("shadowCharacterOffsetX",detail.shadowCharacterOffsetX,0);
    detail.shadowCharacterOffsetY = new QJFrameLight("shadowCharacterOffsetY",detail.shadowCharacterOffsetY,0);
    detail.rotation = new QJFrameLight("rotation",detail.rotation,2);
    detail.shadowCharacterShakeX = new QJFrameLight("shadowCharacterShakeX",detail.shadowCharacterShakeX,0);
    //===============================================
    return detail;
    //===============================================
}
QJ.LL.hexToRgb = function (hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {r: parseInt(result[1],16),g: parseInt(result[2], 16),b: parseInt(result[3], 16)};
}
QJ.LL.rgbToHex = function (rgb) {
    let r=rgb.r.toString(16),g=rgb.g.toString(16),b=rgb.b.toString(16);
    return "#"+(r.length==1?("0"+r):r)+(g.length==1?("0"+g):g)+(b.length==1?("0"+b):b);
}
QJ.LL.dealRegionLights = function(id) {
    //===============================================
    if (!regionLightsData[id]) {
        QJ.LL.error(QJ.LL.globalText[4]+id);
    }
    //===============================================
    let detail = JsonEx.makeDeepCopy(regionLightsData[id]);
    //===============================================
    detail.scaleX = new QJFrameLight("scaleX",detail.scaleX,0);
    detail.scaleY = new QJFrameLight("scaleY",detail.scaleY,0);
    detail.tint = new QJFrameLight("tint",detail.tint,1);
    detail.offsetX = new QJFrameLight("offsetX",detail.offsetX,0);
    detail.offsetY = new QJFrameLight("offsetY",detail.offsetY,0);
    detail.opacity = new QJFrameLight("opacity",detail.opacity,0);
    detail.rotation = new QJFrameLight("rotation",detail.rotation,2);
    //===============================================
    return detail;
    //===============================================
}
QJ.LL.dealMiniLights = function(id) {
    //===============================================
    if (!miniLightsData[id]) {
        QJ.LL.error(QJ.LL.globalText[6]+id);
    }
    //===============================================
    let detail = JsonEx.makeDeepCopy(miniLightsData[id]);
    //===============================================
    detail.scaleX = new QJFrameLight("scaleX",detail.scaleX,0);
    detail.scaleY = new QJFrameLight("scaleY",detail.scaleY,0);
    detail.tint = new QJFrameLight("tint",detail.tint,1);
    detail.offsetX = new QJFrameLight("offsetX",detail.offsetX,0);
    detail.offsetY = new QJFrameLight("offsetY",detail.offsetY,0);
    detail.opacity = new QJFrameLight("opacity",detail.opacity,0);
    detail.rotation = new QJFrameLight("rotation",detail.rotation,2);
    //===============================================
    return detail;
    //===============================================
}
//==========================================================
//
//==========================================================
QJ.LL.open = function () {
    $gameSystem.showLights = true;

}
QJ.LL.close = function () {
    $gameSystem.showLights = false;
}
QJ.LL.tint = function (time,color,ifSystem) {
    if (time==0) {
        $gameSystem.lightStaticChange = [0,null,color,
                ifSystem?$gameSystem.lightStaticChange[3]:color];
    } else {
        $gameSystem.lightStaticChange = [time,
            new QJFrameLight("___","0|"+$gameSystem.lightStaticChange[2]+"~"+time+"/"+color,1),color,
                ifSystem?$gameSystem.lightStaticChange[3]:color];
    }
}
//==========================================================
//
//==========================================================
QJ.LL.splHide = function (lightId) {
    if ($gameSystem.playerLight) {
        if (!lightId) {
            Object.values($gameSystem.playerLight).forEach((light)=>{
                light.visible = false;
            });
        } else if ($gameSystem.playerLight[lightId]) {
            $gameSystem.playerLight[lightId].visible = false;
        }
    }
}
QJ.LL.splShow = function (lightId) {
    if ($gameSystem.playerLight) {
        if (!lightId) {
            Object.values($gameSystem.playerLight).forEach((light)=>{
                light.visible = true;
            });
        } else if ($gameSystem.playerLight[lightId]) {
            $gameSystem.playerLight[lightId].visible = true;
        }
    }
}
QJ.LL.spl = function (lightId) {
    QJ.LL.dpl(null);
    QJ.LL.apl(lightId);
}
QJ.LL.apl = function (lightId) {
    if (!lightId||$gameSystem.playerLight[lightId]) {
        return;
    } else {
        $gameSystem.playerLight[lightId] = new Game_QJLightLayer(-1,QJ.LL.preset(lightId));
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight($gameSystem.playerLight[lightId]);
    }
}
QJ.LL.dpl = function (lightId) {
    if (!lightId) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(-1,null);
        Object.values($gameSystem.playerLight).forEach((light)=>{
            light.setDead();
        });
    } else if ($gameSystem.playerLight[lightId]) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(-1,lightId);
        $gameSystem.playerLight[lightId].setDead();
    }
}
QJ.LL.splScaleX = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.scaleX = new QJFrameLight("scaleX",value,0);
    }
}
QJ.LL.splScaleY = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.scaleY = new QJFrameLight("scaleY",value,0);
    }
}
QJ.LL.splTint = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.tint = new QJFrameLight("tint",value,1);
    }
}
QJ.LL.splOffsetX = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetX = new QJFrameLight("offsetX",value,0);
    }
}
QJ.LL.splOffsetY = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetY = new QJFrameLight("offsetY",value,0);
    }
}
QJ.LL.splDirOffsetX = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetDirX = value;
        QJ.LL.calculateDirAttribute($gameSystem.playerLight[lightId].initData,"offsetDirX");
    }
}
QJ.LL.splDirOffsetY = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.offsetDirY = value;
        QJ.LL.calculateDirAttribute($gameSystem.playerLight[lightId].initData,"offsetDirY");
    }
}
QJ.LL.splOpacity = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.opacity = new QJFrameLight("opacity",value,0);
    }
}
QJ.LL.splRotation = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.opacity = new QJFrameLight("opacity",value,2);
    }
}
QJ.LL.splDirRotation = function (lightId,value) {
    if ($gameSystem.playerLight[lightId]) {
        $gameSystem.playerLight[lightId].initData.dirRotation = value;
        QJ.LL.calculateDirAttribute($gameSystem.playerLight[lightId].initData,"dirRotation",true);
    }
}
//==========================================================
//
//==========================================================
QJ.LL.selHide = function (eventId,lightId) {
    if ($gameSystem.characterLights[eventId]) {
        if (!lightId) {
            Object.values($gameSystem.characterLights[eventId]).forEach((light)=>{
                light.visible = false;
            });
        } else if ($gameSystem.characterLights[eventId][lightId]) {
            $gameSystem.characterLights[eventId][lightId].visible = false;
        }
    }
}
QJ.LL.selShow = function (eventId,lightId) {
    if ($gameSystem.characterLights[eventId]) {
        if (!lightId) {
            Object.values($gameSystem.characterLights[eventId]).forEach((light)=>{
                light.visible = true;
            });
        } else if ($gameSystem.characterLights[eventId][lightId]) {
            $gameSystem.characterLights[eventId][lightId].visible = true;
        }
    }
}
QJ.LL.sel = function (eventId,lightId) {
    QJ.LL.del(eventId,null);
    QJ.LL.ael(eventId,lightId);
}
QJ.LL.ael = function (eventId,lightId) {
    if (!lightId||!$gameSystem.characterLights[eventId]||$gameSystem.characterLights[eventId][lightId]) {
        return;
    } else {
        let sprite = new Game_QJLightLayer(eventId,QJ.LL.preset(lightId));
        $gameSystem.characterLights[eventId][lightId] = sprite;
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight(sprite);
    }
}
QJ.LL.del = function (eventId,lightId) {
    if (!lightId&&$gameSystem.characterLights[eventId]) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(eventId,null);
        Object.values($gameSystem.characterLights[eventId]).forEach((light)=>{
            light.setDead();
        });
    } else if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.removeTargetLight(eventId,lightId);
        $gameSystem.characterLights[eventId][lightId].setDead();
    }
}
QJ.LL.selScaleX = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.scaleX = new QJFrameLight("scaleX",value,0);
    }
}
QJ.LL.selScaleY = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.scaleY = new QJFrameLight("scaleY",value,0);
    }
}
QJ.LL.selTint = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.tint = new QJFrameLight("tint",value,1);
    }
}
QJ.LL.selOffsetX = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetX = new QJFrameLight("offsetX",value,0);
    }
}
QJ.LL.selOffsetY = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetY = new QJFrameLight("offsetY",value,0);
    }
}
QJ.LL.selDirOffsetX = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetDirX = value;
        QJ.LL.calculateDirAttribute($gameSystem.characterLights[eventId][lightId].initData,"offsetDirX");
    }
}
QJ.LL.selDirOffsetY = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.offsetDirY = value;
        QJ.LL.calculateDirAttribute($gameSystem.characterLights[eventId][lightId].initData,"offsetDirY");
    }
}
QJ.LL.selOpacity = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.opacity = new QJFrameLight("opacity",value,0);
    }
}
QJ.LL.selRotation = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.opacity = new QJFrameLight("opacity",value,2);
    }
}
QJ.LL.selDirRotation = function (eventId,lightId,value) {
    if ($gameSystem.characterLights[eventId]&&$gameSystem.characterLights[eventId][lightId]) {
        $gameSystem.characterLights[eventId][lightId].initData.dirRotation = value;
        QJ.LL.calculateDirAttribute($gameSystem.characterLights[eventId][lightId].initData,"dirRotation",true);
    }
}
//==========================================================
//
//==========================================================
QJ.LL.spsStatus = function (value) {
    $gamePlayer.QJSC.status = value;
    if ($gameMap) {
        $gameMap.characterShadowList[-1] = value;
        $gamePlayer.refreshFollowersShadow();
    }
}
QJ.LL.spsImgName = function (value) {
    $gamePlayer.QJSC.imgName = value;
    $gamePlayer.textureForShadowNeedRefresh = true;
}
QJ.LL.spsTint = function (value) {
    $gamePlayer.QJSC.tint = value;
}
QJ.LL.spsOpacity = function (value) {
    $gamePlayer.QJSC.opacity = value;
}
QJ.LL.spsOffsetX = function (value) {
    $gamePlayer.QJSC.offsetX = value;
}
QJ.LL.spsOffsetY = function (value) {
    $gamePlayer.QJSC.offsetY = value;
}
QJ.LL.spsOffsetDirX = function (value) {
    $gamePlayer.QJSC.offsetDirX = value;
    QJ.LL.calculateDirAttribute($gamePlayer.QJSC,"offsetDirX");
}
QJ.LL.spsOffsetDirY = function (value) {
    $gamePlayer.QJSC.offsetDirY = value;
    QJ.LL.calculateDirAttribute($gamePlayer.QJSC,"offsetDirY");
}
QJ.LL.spsModel = function (value) {
    $gamePlayer.QJSC.model=QJ.LL.getCSModel(value);
}
QJ.LL.spsYCut = function (value) {
    $gamePlayer.QJSC.yCut = value;
}
//==========================================================
//
//==========================================================
QJ.LL.tempLight = function (lightId,during,x,y) {
    let initData = QJ.LL.dealMiniLights(lightId);
    initData.during = Math.max(0,during);
    let odata = new Game_QJLightLayerMini({type:0,
        x:x+dx48+standardExpand/2,
        y:y+dy48+standardExpand/2
    },initData,$gameSystem.miniLights.length);
    $gameSystem.miniLights.push(odata);
    if (QJ.LL.isOnMapAndHaveLoaded()) {
        SceneManager._scene._spriteset.addQJMiniLight(odata);
    }
}
QJ.LL.miniLightObjectFunction = {

};
/*
迷你灯光的对象绑定：
type:   0固定位置    1地形    2对象
这里对2对象进行详细描述：
首先需要在新的插件中在QJ.LL.miniLightObjectFunction内插入固定的变化函数，属性名为新插件唯一的属性名，属性值为一个对象。
这个对象中可以写如下函数来使Game_QJLightLayerMini进行call。
以灯光插件为例：
QJ.LL.miniLightObjectFunction["QJLighting"] = {
    update:function() {},
    updatePosition:function() {},//必须写，确定灯光位置。
    updateRotation:function() {},
    updateScale:function() {},
    updateOpacity:function() {},
    setDead:function() {}
}
在以上的函数中使用函数来实现:
this.setDead()来删除此灯光。
this.attach读取您在attachData中的数据，且会加上type:2和attributeName:attributeName。

然后，生成一个新的插件的方法为：
QJ.LL.miniLightObject(minLightId,attributeName,attachData);
attributeName:在上面写的东西，比如"QJLighting"。
*/
QJ.LL.miniLightObject = function (minLightId,attributeName,attachData = {}) {
    let initData = QJ.LL.dealMiniLights(minLightId);
    attachData.type = 2;
    attachData.attributeName = attributeName;
    initData.during = -1;
    let odata = new Game_QJLightLayerMini(attachData,initData,$gameSystem.miniLights.length);
    $gameSystem.miniLights.push(odata);
    if (QJ.LL.isOnMapAndHaveLoaded()) {
        SceneManager._scene._spriteset.addQJMiniLight(odata);
    }
}
//==========================================================
//
//==========================================================
QJ.LL.lightObjectFunction = {

};
/*
灯光的对象绑定：
首先需要在新的插件中在QJ.LL.mlightObjectFunction内插入固定的变化函数，属性名为新插件唯一的属性名，属性值为一个对象。
这个对象中可以写如下函数来使Game_QJLightLayer进行call。
以灯光插件为例：
QJ.LL.miniLightObjectFunction["QJLighting"] = {
    makeName:(value)=>value,//必须写，确定绑定的灯光容器名
    updateRotation:function() {}
}
在以上的函数中使用函数来实现:
this.setDead()来删除此灯光。
this.attach读取您在attachData中的数据，且会加上attributeName:attributeName。
绑定的对象必须重写QJ.LL.character对象来使其可读取新的绑定对象。
且在绑定的对象中需要写上
direction() //如果不需要朝向，那么最好是不变的2
_realX
_realY
screenX()
screenY()
这几个属性。
从根本上说，简易灯光是完全由新增的函数来控制的，而这个灯光主要是由这些绑定对象的属性或者方法来控制的。

然后，生成一个新的插件的方法为：
QJ.LL.lightObject(lightId,boundObjectId,attributeName,attachData);
attributeName:在上面写的东西，比如"QJLighting"。
*/
QJ.LL.lightObject = function (lightId,boundObjectId,attributeName,attachData = {}) {
    let lightShowId = QJ.LL.lightObjectFunction[attributeName].makeName(boundObjectId);
    let lightData = QJ.LL.preset(lightId);
    attachData.attributeName = attributeName;
    lightData.attach = attachData;
    let sprite = new Game_QJLightLayer(lightShowId,lightData);
    if (!$gameSystem.characterLights[lightShowId]) {
        $gameSystem.characterLights[lightShowId] = {};
    }
    $gameSystem.characterLights[lightShowId][lightId] = sprite;
    if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight(sprite);
}
//==========================================================
//
//==========================================================
QJ.LL.setTimeSystem = function (value) {
    $gameSystem.timeSystemQJLighting.use = !!value;
}
QJ.LL.setTimeRunStatus = function (value) {
    $gameSystem.timeSystemQJLighting.status = !!value;
}
QJ.LL.setTimeHubStatus = function (value) {
    $gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus = !!value;
    if ($gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus&&QJ.LL.isOnMapAndHaveLoaded()) {
        SceneManager._scene._spriteset.createTimeSpriteLightingQJ();
    }
}
//==========================================================
//
//==========================================================
QJ.LL.calculateAngleByTwoPoint=function(x,y,ex,ey){
    let ro;
    if (ex>x&&ey<y)  ro=(-Math.atan((x-ex)/(y-ey)));
    if (ex>x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex<x&&ey<y)  ro=(2*Math.PI-Math.atan((x-ex)/(y-ey)));
    if (ex==x&&ey>y) ro=Math.PI;
    if (ex==x&&ey<y) ro=0;
    if (ex>x&&ey==y) ro=Math.PI/2;
    if (ex<x&&ey==y) ro=Math.PI*3/2;
    if (ex==x&&ey==y)ro=null;//说明在同一点
    return ro;
};
//==========================================================
//
//==========================================================
const LL_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
Scene_Map.prototype.updateMain = function() {
    LL_Scene_Map_updateMain.call(this);
    dx = $gameMap.displayX();
    dy = $gameMap.displayY();
    dx48 = Math.floor(dx*48-standardExpand/2);
    dy48 = Math.floor(dy*48-standardExpand/2);
    if ($gameSystem.showLights) {
        let charList;
        for (let i in $gameSystem.characterLights) {
            charList = $gameSystem.characterLights[i];
            if (charList) {
                for (let j in charList) {
                    if (charList[j]) {
                        charList[j].update();
                    }
                }
            }
        }
        let mL = $gameSystem.miniLights;
        for (let i of mL) {
            if (i) i.update();
        }
    }
};
//==========================================================
//
//==========================================================
const tempTimeList = {};
let tempTimeCountTime = 0;
let tempTimeCountTimeData = null;
JsonEx.parse(parameters.timeSystemMain).forEach((value)=>{
    let detail = JsonEx.parse(value);
    let num = Number(detail.startHour);
    if (tempTimeCountTimeData) {
        for (let i=tempTimeCountTime;i<num;i++) {
            tempTimeList[i] = tempTimeCountTimeData;
        }
        tempTimeCountTime = num;
    }
    tempTimeCountTimeData = {
        colorChangeDur:Number(detail.colorChangeDur),
        indoorColor:detail.indoorColor,
        outdoorColor:detail.outdoorColor,
        isNight:eval(detail.isNight)
    };
});
for (let i=tempTimeCountTime;i<24;i++) {
    tempTimeList[i] = tempTimeCountTimeData;
}
const tempTimeHubData = JsonEx.parse(parameters.timeSystemHub);
$.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    $.Game_System_initialize.apply(this,arguments);
    this.showLights = eval(parameters.defaultOpen);
    this.lightStaticChange = [0,null,parameters.maskInitColor,parameters.maskInitColor];
    this.characterLights = {};
    this.characterLights[-1] = {};
    this.miniLights = [];
    this.timeSystemQJLighting = {
        use:eval(parameters.timeSystemInit),
        status:eval(parameters.timeSystemStatus),
        mode:eval(parameters.timeSystemStatus),
        second:Number(parameters.timeSystemData1),
        minite:Number(parameters.timeSystemData2),
        hour:Number(parameters.timeSystemData3),
        nightSwitch:Number(parameters.timeSystemSwitch),
        speed:(isNaN(Number(parameters.timeSystemSpeed))?60:Number(parameters.timeSystemSpeed))/60,
        list:tempTimeList,
        hubStatus:eval(parameters.timeSystemHubShow),
        nowMapIndoor:false,
        nowMapTint:null,
        hub:{
            timeSystemHub: tempTimeHubData.timeSystemHub=="0"?true:false,
            timeSystemHubImg1: tempTimeHubData.timeSystemHubImg1,
            timeSystemHubImg2: tempTimeHubData.timeSystemHubImg2,
            timeSystemHubImg3: tempTimeHubData.timeSystemHubImg3,
            timeSystemHubImg4: tempTimeHubData.timeSystemHubImg4,
            timeSystemHubStatus: eval(tempTimeHubData.timeSystemHubStatus),
            timeSystemHubX: Number(tempTimeHubData.timeSystemHubX),
            timeSystemHubY: Number(tempTimeHubData.timeSystemHubY)
        }
    };
}
Object.defineProperties(Game_System.prototype, {
    playerLight: {
        get: function() {
            return this.characterLights[-1];
        },
        set: function(value) {
            this.characterLights[-1] = value;
        },
        configurable: true
    }
});
//==========================================================
//
//==========================================================
$.Graphics_resize = Graphics.resize;
Graphics.resize = function(width, height) {
    $.Graphics_resize.apply(this,arguments);
    gw = Graphics.width;
    gh = Graphics.height;
    gws = Math.floor(gw+standardExpand);
    ghs = Math.floor(gh+standardExpand);
};
//==========================================================
//
//==========================================================
const LL_Game_Map_setup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function(mapId) {
    //===========================================
    let oldPlayerLights = $gameSystem.characterLights[-1];
    $gameSystem.characterLights = {};
    $gameSystem.characterLights[-1] = oldPlayerLights;
    //===========================================
    $gameSystem.miniLights = [];
    this.characterShadowList = {};
    this.characterShadowList[-1] = $gamePlayer.QJSC.status;
    $gamePlayer.refreshFollowersShadow();
    //======================================
    LL_Game_Map_setup.call(this,mapId);
    //======================================
    let tilesetData = $dataTilesets[this._tilesetId].meta
    //======================================
    this.terrainTagToRegion = [0,  0,0,0,0,0,0,0];
    for (let i=1,regionId;i<8;i++) {
        if (tilesetData["QJTS-"+i]) {
            regionId = Number(tilesetData["QJTS-"+i]);
            if (regionData[regionId]) {
                this.terrainTagToRegion[i] = regionId;
            }
        }
    }
    //======================================
    this.terrainTagToRegionLights = [0,  0,0,0,0,0,0,0];
    for (let i=1,regionId;i<8;i++) {
        if (tilesetData["QJL-"+i]) {
            regionId = Number(tilesetData["QJL-"+i]);
            if (regionLightsData[regionId]) {
                this.terrainTagToRegionLights[i] = regionId;
            }
        }
    }
    //======================================
    this.shadowDataQJLL = new Array(this.width());
    for (let i=0,il=this.width(),j,jl=this.height(),id,lsid,k,heightY;i<il;i++) {
        this.shadowDataQJLL[i] = new Array(this.height());
        for (j=0;j<jl;j++) {
            //========================
            id = this.regionIdForLight(i,j);
            if (regionLightsData[id]) {
                //type 0固定位置 1地形 2对象
                $gameSystem.miniLights.push(new Game_QJLightLayerMini({
                    type:1,regionId:id,
                    x:i*48+24,y:j*48+24,
                    mapX:i,mapY:j
                    },QJ.LL.dealRegionLights(id),$gameSystem.miniLights.length));
            }
            //========================
            id = this.regionIdForShadow(i,j);
            if (regionData[id]) {
                heightY = regionData[id].shadowHeight;
                for (k=1;k<=regionData[id].shadowHeight;k++) {
                    lsid = this.regionIdForShadow(i,j+k);
                    if (regionData[lsid]) {
                        heightY=k-1;
                        break;
                    }
                }
                for (k=0;k<=heightY;k++) {
                    this.shadowDataQJLL[i][j+k] = j+heightY;
                }
                j+=heightY;
            } else this.shadowDataQJLL[i][j]=-1;
        }
    }
    //======================================
    this.lightingNoteGetQJ();
    this.updateTrueLightingTintQJ();
    //======================================
};
Game_Map.prototype.lightingNoteGetQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let meta = $dataMap.meta;
    lightingData.nowMapTint = meta.QJScreenTint?meta.QJScreenTint:null;
    lightingData.nowMapIndoor = ("indoor" in meta)?true:false;
};
Game_Map.prototype.updateTrueLightingTintQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let hour = this.getLightingHourQJ();
    if (lightingData.nowMapTint) {
        QJ.LL.tint(0,lightingData.nowMapTint,true);
    } else if (lightingData.use) {
        let hourData = lightingData.list[hour];
        if (lightingData.nightSwitch>0) $gameSwitches.setValue(lightingData.nightSwitch,hourData.isNight);
        if (lightingData.nowMapIndoor) {
            QJ.LL.tint(hourData.colorChangeDur,hourData.indoorColor,true);
        } else {
            QJ.LL.tint(hourData.colorChangeDur,hourData.outdoorColor,true);
        }
        this.remHourLightingQJ = hour;
    } else {
        QJ.LL.tint(0,$gameSystem.lightStaticChange[3],true);
    }
};
const LL_Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    LL_Game_Map_update.call(this,sceneActive);
    if ($gameSystem.timeSystemQJLighting.use) {
        let lightingData = $gameSystem.timeSystemQJLighting;
        if (lightingData.status) {
            this.addLightingSecondQJ(lightingData.speed);
        }
        let hour = this.getLightingHourQJ();
        if (this.remHourLightingQJ != hour) {
            this.updateTrueLightingTintQJ();
        }
    }
};
Game_Map.prototype.getLightingHourQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    return lightingData.hour>0?$gameVariables.value(lightingData.hour):0;
};
Game_Map.prototype.getLightingMiniteQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    return lightingData.minite>0?$gameVariables.value(lightingData.minite):0;
};
Game_Map.prototype.getLightingSecondQJ = function() {
    let lightingData = $gameSystem.timeSystemQJLighting;
    return lightingData.second>0?$gameVariables.value(lightingData.second):0;
};
Game_Map.prototype.addLightingHourQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.hour)+(value==undefined?1:value);
    $gameVariables.setValue(lightingData.hour,valueNew%24);
};
Game_Map.prototype.addLightingMiniteQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.minite)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingHourQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.minite,valueNew%60);
};
Game_Map.prototype.addLightingSecondQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.second)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingMiniteQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.second,valueNew%60);
};
Game_Map.prototype.setLightingHourQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.hour)+(value==undefined?1:value);
    $gameVariables.setValue(lightingData.hour,valueNew%24);
};
Game_Map.prototype.setLightingMiniteQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.minite)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingHourQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.minite,valueNew%60);
};
Game_Map.prototype.setLightingSecondQJ = function(value) {
    let lightingData = $gameSystem.timeSystemQJLighting;
    let valueNew = $gameVariables.value(lightingData.second)+(value==undefined?1:value);
    if (Math.floor(valueNew/60)>0) {
        this.addLightingMiniteQJ(Math.floor(valueNew/60));
    }
    $gameVariables.setValue(lightingData.second,valueNew%60);
};
Game_Map.prototype.regionIdForShadow = function(x, y) {
    let id = this.regionId(x,y),terrainTag;
    if (!regionData[id]&&this.terrainTagToRegion) {
        terrainTag = this.terrainTag(x,y);
        if (this.terrainTagToRegion[terrainTag]>0) {
            id = this.terrainTagToRegion[terrainTag];
        }
    }
    return id;
};
Game_Map.prototype.regionIdForLight = function(x, y) {
    let id = this.regionId(x,y),terrainTag;
    if (!regionLightsData[id]&&this.terrainTagToRegionLights) {
        terrainTag = this.terrainTag(x,y);
        if (this.terrainTagToRegionLights[terrainTag]>0) {
            id = this.terrainTagToRegionLights[terrainTag];
        }
    }
    return id;
};
//==========================================================
//
//==========================================================
const LL_Game_Player_initMembers = Game_Player.prototype.initMembers;
Game_Player.prototype.initMembers = function() {
    LL_Game_Player_initMembers.call(this);
    let orginData = parameters.playerInitLight;
    if (!!orginData) $gameSystem.playerLight[orginData] = new Game_QJLightLayer(-1,QJ.LL.preset(orginData));
    this.QJSC = JsonEx.makeDeepCopy(playerShadowDefault);
    for (let i of this._followers._data) {
        i.QJSC = this.QJSC;
    }
    this.textureForShadowNeedRefresh = true;
    this.reSetX = 0;
    this.reSetY = 0;
    this.remRegionId = 0;
};
Game_Player.prototype.refreshFollowersShadow = function() {
    for (let i=0,il=this._followers._data.length,vis=this._followers._visible&&$gamePlayer.QJSC.status;i<il;i++) {
        $gameMap.characterShadowList[-(i+2)] = vis;
    }
};
const LL_Game_Player_showFollowers = Game_Player.prototype.showFollowers;
Game_Player.prototype.showFollowers = function() {
    LL_Game_Player_showFollowers.call(this);
    this.refreshFollowersShadow();
};
const LL_Game_Player_hideFollowers = Game_Player.prototype.hideFollowers;
Game_Player.prototype.hideFollowers = function() {
    LL_Game_Player_hideFollowers.call(this);
    this.refreshFollowersShadow();
};
const LL_Game_Player_update = Game_Player.prototype.update;
Game_Player.prototype.update = function(sa) {
    LL_Game_Player_update.call(this,sa);
    this.reSetX = Math.floor(this._realX+0.5);
    this.reSetY = Math.floor(this._realY+0.5);
    this.remRegionId = $gameMap.regionId(this.reSetX,this.reSetY);
};
//==========================================================
//
//==========================================================
const LL_Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    LL_Game_Event_setupPage.call(this);
    if ($gameSystem.characterLights[this._eventId]) {
        for (let i of Object.values($gameSystem.characterLights[this._eventId])) {
            i.setDead();
        }
        if (QJ.LL.isOnMapAndHaveLoaded()) {
            SceneManager._scene._spriteset.removeTargetLight(this._eventId,null);
        }
    }
    $gameSystem.characterLights[this._eventId] = {};
    this.annotation = QJ.LL.calculateAnnotation(this);
    let lightId = QJ.LL.getLLData(this,this.annotation);
    if (lightId) {
        let odata = new Game_QJLightLayer(this._eventId,QJ.LL.preset(lightId,this));
        $gameSystem.characterLights[this._eventId][lightId] = odata;
        if (QJ.LL.isOnMapAndHaveLoaded()) SceneManager._scene._spriteset.addQJLight(odata);
    }
    this.QJSC = QJ.LL.getCSData(this,this.annotation);
    $gameMap.characterShadowList[this._eventId] = this.QJSC.status;
    this.textureForShadowNeedRefresh = true;
};
/*const LL_Game_Event_update = Game_Event.prototype.update;
Game_Event.prototype.update = function() {
    LL_Game_Event_update.call(this);

};*/
//==========================================================
//Load all layer container.
//==========================================================
let mapCharacterSpriteReSaveList = {};
//==========================================================
const LL_Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
Spriteset_Base.prototype.initialize = function() {
    //======================================
    mapCharacterSpriteReSaveList = {};
    //======================================
    LL_Spriteset_Base_initialize.call(this);
    //======================================
};
const LL_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function() {
    //======================================
    if (!lightLayerZ) {
        this.lightSystemSprite = new Sprite_QJLightSystem(this);
        this.addChild(this.lightSystemSprite);
    }
    //======================================
    LL_Spriteset_Map_createUpperLayer.call(this);
    //======================================
    if (lightLayerZ) {
        this.lightSystemSprite = new Sprite_QJLightSystem(this);
        this.addChild(this.lightSystemSprite);
    }
    //======================================
    this.lightCharacterShadowContainer = new Sprite_QJCharacterShadowLayer(this,this.lightSystemSprite);
    this._tilemap.addChildAt(this.lightCharacterShadowContainer,0);
    //====================================
    if ($gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus) {
        this.createTimeSpriteLightingQJ();
    }
    //====================================
};
Spriteset_Map.prototype.addQJLight = function(odata) {
    return this.lightSystemSprite.addQJLight(odata);
};
Spriteset_Map.prototype.addQJMiniLight = function(odata) {
    return this.lightSystemSprite.addQJMiniLight(odata);
};
Spriteset_Map.prototype.removeTargetLight = function(id,lightId) {
    return this.lightSystemSprite.removeTargetLight(id,lightId);
};
Spriteset_Map.prototype.createTimeSpriteLightingQJ = function() {
    this.timeSystemSpriteQJ = new Sprite_timeSystemSpriteQJ();
    this.addChild(this.timeSystemSpriteQJ);
};
//==========================================================
//Sprite_timeSystemSpriteQJ
//==========================================================
function Sprite_timeSystemSpriteQJ() {
    this.initialize.apply(this, arguments);
}
Sprite_timeSystemSpriteQJ.prototype = Object.create(Sprite.prototype);
Sprite_timeSystemSpriteQJ.prototype.constructor = Sprite_timeSystemSpriteQJ;
Sprite_timeSystemSpriteQJ.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    let hub = $gameSystem.timeSystemQJLighting.hub;
    this.timeSystemHubX = hub.timeSystemHubX;
    this.timeSystemHubY = hub.timeSystemHubY;
};
Sprite_timeSystemSpriteQJ.prototype.update = function() {
    if (!$gameSystem.timeSystemQJLighting.hub.timeSystemHubStatus) {
        this.parent.removeChild(this);
        this.destroy();
        return;
    }
    let s=$gameMap.getLightingSecondQJ();
    let m=$gameMap.getLightingMiniteQJ();
    let h=$gameMap.getLightingHourQJ();
    if (this.model != $gameSystem.timeSystemQJLighting.hub.timeSystemHub) {
        this.model = $gameSystem.timeSystemQJLighting.hub.timeSystemHub;
        this.refreshData();
    }
    if (this.working&&(this.s!=s||this.m!=m||this.h!=h)) {
        this.s = s;
        this.m = m;
        this.h = h;
        this.updateData();
    }
};
Sprite_timeSystemSpriteQJ.prototype.refreshData = function() {
    let hub = $gameSystem.timeSystemQJLighting.hub;
    if ((this.model&&(!ImageManager.loadSystem(hub.timeSystemHubImg1).width||
        !ImageManager.loadSystem(hub.timeSystemHubImg2).width||
        !ImageManager.loadSystem(hub.timeSystemHubImg3).width))||
        (!this.model&&(!ImageManager.loadSystem(hub.timeSystemHubImg4).width))) {
        setTimeout(this.refreshData.bind(this),5);
        return;
    }
    this.removeChildren();
    this.s = -1;
    this.m = -1;
    this.h = -1;
    this.working = true;
    let baseX = this.timeSystemHubX,baseY = this.timeSystemHubY;
    if (this.model) {
        //==================================================
        let sprite1 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg1));
        sprite1.x = Graphics.width-sprite1.width+baseX;
        sprite1.y = baseY;
        this.sprite1 = sprite1;
        this.addChild(sprite1);
        //==================================================
        let sprite2 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg2));
        sprite2.anchor.x = 0.5; 
        sprite2.anchor.y = (sprite2.height-sprite2.width/2)/sprite2.height;
        sprite2.x = sprite1.x+sprite1.width/2;
        sprite2.y = sprite1.y+sprite1.height/2;
        this.addChild(sprite2);
        this.sprite2 = sprite2;
        //==================================================
        let sprite3 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg3));
        sprite3.anchor.x = 0.5; 
        sprite3.anchor.y = (sprite3.height-sprite3.width/2)/sprite3.height;
        sprite3.x = sprite1.x+sprite1.width/2;
        sprite3.y = sprite1.y+sprite1.height/2;
        this.addChild(sprite3);
        this.sprite3 = sprite3;
        //==================================================
    } else {
        //==================================================
        let sprite4 = new Sprite(ImageManager.loadSystem(hub.timeSystemHubImg4));
        sprite4.anchor.x = 0.5; 
        sprite4.x = Graphics.width/2+baseX;
        sprite4.y = baseY;
        this.addChild(sprite4);
        this.sprite4 = sprite4;
        //==================================================
        let bitmap5 = new Bitmap(sprite4.width,sprite4.height);
        bitmap5.fontSize = 24;
        let sprite5 = new Sprite(bitmap5);
        sprite5.anchor.x = 0.5; 
        sprite5.x = Graphics.width/2;
        sprite5.y = baseY;
        this.addChild(sprite5);
        this.sprite5 = sprite5;
        this.bitmap5 = bitmap5;
        //==================================================
    }
};
Sprite_timeSystemSpriteQJ.prototype.updateData = function() {
    let hub = $gameSystem.timeSystemQJLighting.hub;
    if (this.model) {
        this.sprite3.rotation = (this.m+this.s/60)%60/60*Math.PI*2;
        this.sprite2.rotation = (this.h+this.m/60+this.s/3600)%12/12*Math.PI*2;
    } else {
        this.bitmap5.clear();
        this.bitmap5.drawText((this.h>9?this.h:("0"+this.h))+":"+(this.m>9?this.m:("0"+this.m)),0,0,
            this.sprite5.width,this.sprite5.height,"center");
    }
};
//==========================================================
//Sprite_Character.
//==========================================================
const QJLL_Sprite_Character_setCharacter = Sprite_Character.prototype.setCharacter;
Sprite_Character.prototype.setCharacter = function(character) {
    QJLL_Sprite_Character_setCharacter.call(this,character);
    this.refreshTextureForShadow();
    if (this.constructor.name!="Sprite_Character") return;
    if (character._eventId) mapCharacterSpriteReSaveList[character._eventId] = this;
    else if (character==$gamePlayer) mapCharacterSpriteReSaveList[-1] = this;
    else {
        for (let data=$gamePlayer._followers._data,i=0,il=data.length;i<il;i++) {
            if (character==data[i]) mapCharacterSpriteReSaveList[-(i+2)] = this;
        }
    }
};
const QJLL_Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    QJLL_Sprite_Character_update.call(this);
    if (this._character.textureForShadowNeedRefresh) {
        this.refreshTextureForShadow();
    }
    if (this.textureLLSpecial&&this.textureLLSpecial.dirMode) {
        let newY = this.textureLLSpecial.frame.height*(this._character.direction()/2-1);
        if (this.textureLLSpecial.frame.y!=newY) {
            this.textureLLSpecial.frame.y = newY;
            this.textureLLSpecial.frame = this.textureLLSpecial.frame;
        }
    }
};
Sprite_Character.prototype.refreshTextureForShadow = function() {
    this._character.textureForShadowNeedRefresh = false;
    let qjsc = this._character.QJSC;
    if (!qjsc) return;
    if (!qjsc.imgName) {
        this.textureLLSpecial = null;
    } else {
        if (!characterShadowPresetListTexture[qjsc.imgName]) {
            QJ.LL.error(QJ.LL.globalText[2]+qjsc.imgName+" "+this._eventId+" "+$gameMap.mapId());
        } else {
            let baseTextureNeed = characterShadowPresetListTexture[qjsc.imgName];
            this.textureLLSpecial = new PIXI.Texture(baseTextureNeed);
            if (qjsc.imgName[0]=="$") {
                this.textureLLSpecial.dirMode = true;
                this.textureLLSpecial.frame = new PIXI.Rectangle(0,0,0,0);
                this.textureLLSpecial.frame.height = baseTextureNeed.height/4;
                this.textureLLSpecial.frame.width = baseTextureNeed.width;
                this.textureLLSpecial.frame.x = 0;
                this.textureLLSpecial.frame.y = this.textureLLSpecial.frame.height*(this._character.direction()/2-1);
                this.textureLLSpecial.frame = this.textureLLSpecial.frame;
            } else {
                this.textureLLSpecial.dirMode = false;
            }
        }
    }
};
//==========================================================
//
//==========================================================
const LL_Sprite_Character_setTileBitmap = Sprite_Character.prototype.setTileBitmap;
Sprite_Character.prototype.setTileBitmap = function() {
    LL_Sprite_Character_setTileBitmap.call(this);
    if (this.bitmap) this.bitmap.addLoadListener((bit)=>this.transfromTextureLL(bit));
    else this.textureLL = null;
};
const LL_Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
    LL_Sprite_Character_setCharacterBitmap.call(this);
    if (this.bitmap) this.bitmap.addLoadListener((bit)=>this.transfromTextureLL(bit));
    else this.textureLL = null;
};
Sprite_Character.prototype.transfromTextureLL = function(bit) {
    bit=bit?bit:this.bitmap;
    if (bit&&bit._image) {
        if (!bit.textureLL) {
            let source = bit._image;
            let lsCanvas = document.createElement('canvas');
            let w = source.width,h = source.height;
            lsCanvas.width = w;
            lsCanvas.height = h;
            let lsContext = lsCanvas.getContext('2d');
            lsContext.drawImage(source,0,0,w,h,0,0,w,h);
            bit.textureLL = new PIXI.BaseTexture(lsCanvas);
        }
        this.textureLL = new PIXI.Texture(bit.textureLL);
    } else this.textureLL = null;
};
//==========================================================
//To contain extra layer.
//==========================================================
function Sprite_QJLLContainer() {
    this.initialize.apply(this, arguments);
}
Sprite_QJLLContainer.prototype = Object.create(PIXI.Container.prototype);
Sprite_QJLLContainer.prototype.constructor = Sprite_QJLLContainer;
Sprite_QJLLContainer.prototype.initialize = function() {
    PIXI.Container.call(this);
}
Sprite_QJLLContainer.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};
//==========================================================
//Filter_QJLight.
//==========================================================
function Filter_QJLight() {
    this.initialize.apply(this, arguments);
}
Filter_QJLight.prototype = Object.create(PIXI.Filter.prototype);
Filter_QJLight.prototype.constructor = Filter_QJLight;
Filter_QJLight.prototype.initialize = function() {
    //delete some redundant native values about filter and mask.
    let vertexSrc = `
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;
    uniform mat3 projectionMatrix;
    void main(void){
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord ;
    }`;
    //simple background set.
    let fragmentSrc = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform vec4 backgroundColor;
    void main(void){
       vec4 sample = texture2D(uSampler, vTextureCoord);
       gl_FragColor = sample + backgroundColor;
    }`;
    PIXI.Filter.call(this,vertexSrc,fragmentSrc,{backgroundColor:[0,0,0,0]});
};
Filter_QJLight.prototype.setBackgroundColor = function(r,g,b,a) {
    this.uniforms.backgroundColor[0] = r*a;
    this.uniforms.backgroundColor[1] = g*a;
    this.uniforms.backgroundColor[2] = b*a;
    this.uniforms.backgroundColor[3] = a;
};
//==========================================================
//Sprite_QJLightLayer.Main light layer.
//==========================================================
function Sprite_QJLightSystem() {
    this.initialize.apply(this, arguments);
}
Sprite_QJLightSystem.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_QJLightSystem.prototype.constructor = Sprite_QJLightSystem;
Sprite_QJLightSystem.prototype.initialize = function(spriteset) {
    //====================================
    this._spriteset = spriteset;
    this.mw = $gameMap.width()*48+standardExpand;
    this.mh = $gameMap.height()*48+standardExpand;
    this.oldFilterColor = null;
    this.averageColorAlpha = 1;
    this.whiteVisible = false;
    //====================================
    PIXI.Sprite.call(this);
    this.x = -standardExpand/2;
    this.y = -standardExpand/2;
    this.filterMask = new Filter_QJLight();
    this.filterMask.blendMode = 2;
    this.filters = [this.filterMask];
    this.filterArea = new Rectangle(0,0,gws,ghs);
    this.updateFilterColor();
    //====================================
    this.miniLightsContainer = new PIXI.Container();
    this.addChild(this.miniLightsContainer);
    //====================================
    let lsCanvas,lsContext,lsBaseTexture = null;
    lsCanvas = document.createElement('canvas');
    lsContext = lsCanvas.getContext('2d');
    lsCanvas.width = this.mw;
    lsCanvas.height = this.mh;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
    lsBaseTexture.width = this.mw;
    lsBaseTexture.height = this.mh;
    this.blockContext = lsContext;
    this.blocklsBaseTexture = lsBaseTexture;
    this.blockTexture = new PIXI.Texture(lsBaseTexture);
    this.blockSprite = new PIXI.Sprite(this.blockTexture);
    this.blockSprite.blendMode = 2;
    this.setBlock(this.blockContext,this.blocklsBaseTexture);
    this.updateBlocklsTextureFrame();
    this.addChild(this.blockSprite);
    //====================================
    let charList;
    for (let i in $gameSystem.characterLights) {
        charList = $gameSystem.characterLights[i];
        for (let j in charList) {
            this.addQJLight(charList[j]);
        }
    }
    for (let i of $gameSystem.miniLights) {
        if (i) this.addQJMiniLight(i);
    }
    //====================================
};
Sprite_QJLightSystem.prototype.updateBlocklsTextureFrame = function() {
    let realX = (dx48+0).clamp(0, this.mw),realY = (dy48+0).clamp(0, this.mh);
    let realW = (gws - realX + dx48).clamp(0, this.mw - realX);
    let realH = (ghs - realY + dy48).clamp(0, this.mh - realY);
    this.blockTexture.frame.x = realX;
    this.blockTexture.frame.y = realY;
    this.blockTexture.frame.width = realW;
    this.blockTexture.frame.height = realH;
    this.blockSprite.pivot.x = dx48 - realX;
    this.blockSprite.pivot.y = dy48 - realY;
    this.blockTexture.frame = this.blockTexture.frame;
}
Sprite_QJLightSystem.prototype.addQJLight = function(odata) {
    let lightSprite = new Sprite_QJLightLayer(this._spriteset,odata);
    this.addChildAt(lightSprite,0);
    return lightSprite;
};
Sprite_QJLightSystem.prototype.addQJMiniLight = function(odata) {
    let lightSprite = new Sprite_QJLightLayerMini(this._spriteset,odata);
    this.miniLightsContainer.addChild(lightSprite);
    return lightSprite;
};
Sprite_QJLightSystem.prototype.removeTargetLight = function(id,lightId) {
    if (!lightId) {
        for (let i of this.children) {
            if (i.character==id) {
                i.setDead();
            }
        }
    } else {
        for (let i of this.children) {
            if (i.character==id&&i.lightId==lightId) {
                i.setDead();
                break;
            }
        }
    }
};
Sprite_QJLightSystem.prototype.refreshFilter = function(color) {
    let r=parseInt(color.substr(1,2),16)/255;
    let g=parseInt(color.substr(3,2),16)/255;
    let b=parseInt(color.substr(5,2),16)/255;
    this.averageColorAlpha = Math.floor((1-(r+g+b)/3)*100)/100;
    this.oldFilterColor=color;
    if (!this.whiteVisible) {
        if (this.oldFilterColor!="#ffffff") {
            this.whiteVisible = true;
        }
    } else {
        if (this.oldFilterColor=="#ffffff") {
            this.whiteVisible = false;
        }
    }
    this.filterMask.setBackgroundColor(r,g,b,1);
};
Sprite_QJLightSystem.prototype.updateFilterColor = function() {
    if ($gameSystem.lightStaticChange[0]>0) {
        if (!$gameSystem.lightStaticChange[1]) {
            $gameSystem.lightStaticChange[0] = 0;
            $gameSystem.lightStaticChange[1] = null;
            if (this.oldFilterColor!=$gameSystem.lightStaticChange[2]) {
                this.refreshFilter($gameSystem.lightStaticChange[2]);
            }
        } else {
            $gameSystem.lightStaticChange[0]--;
            let tarColor = $gameSystem.lightStaticChange[1].get();
            if (this.oldFilterColor!=tarColor) {
                this.refreshFilter(tarColor);
            }
            if ($gameSystem.lightStaticChange[0]==0) $gameSystem.lightStaticChange[1]=null;
        }
    } else {
        if (this.oldFilterColor!=$gameSystem.lightStaticChange[2]) {
            this.refreshFilter($gameSystem.lightStaticChange[2]);
        }
    }
};
Sprite_QJLightSystem.prototype.update = function() {
    this.updateFilterColor();
    this.visible = $gameSystem.showLights && this.whiteVisible;
    if (this.visible) {
        this.children.forEach((child)=>{
            if (child.update) child.update();
        });
        this.miniLightsContainer.children.forEach((child)=>{
            if (child.update) child.update();
        });
        this.updateBlocklsTextureFrame();
    }
};
Sprite_QJLightSystem.prototype.setBlock = function(bctx,bbt) {
    let regionId,blockShape,nextLineType,x48,y48,terrainTag;
    for (let i=0,il=$gameMap.width();i<il;i++) {
        for (let j=0,jl=$gameMap.height();j<jl;j++) {
            regionId = $gameMap.regionIdForShadow(i,j);
            if (regionData[regionId]&&regionData[regionId].rectShape.length>0) {
                //===========================
                x48 = i*48;
                y48 = j*48;
                //===========================
                blockShape = regionData[regionId].rectShape;
                //===========================
                bctx.save();
                bctx.fillStyle = regionData[regionId].rectTint;
                bctx.globalAlpha = regionData[regionId].rectOpacity;
                bctx.translate(x48,y48);
                for (let k=0,mk=0,kl=blockShape.length,initX=blockShape[0].x,initY=blockShape[0].y,x,y;k<kl;k++) {
                    if (mk==0) {
                        bctx.beginPath();
                        bctx.moveTo(initX,initY);
                    }
                    nextLineType = blockShape[k].t;
                    mk++;
                    x = blockShape[k+1]?blockShape[k+1].x:initX;
                    y = blockShape[k+1]?blockShape[k+1].y:initY;
                    if (nextLineType==0) {
                        bctx.lineTo(x,y);
                    } else if (nextLineType==5) {
                        bctx.closePath();
                        bctx.fill();
                        if (!blockShape[k+1]) break;
                        initX=blockShape[k+1].x;
                        initY=blockShape[k+1].y;
                        mk=0;
                        continue;
                    } else {
                        bctx.arc(blockShape[k].cx,blockShape[k].cy,blockShape[k].r,blockShape[k].sa,blockShape[k].ea,blockShape[k].ccw);
                    }
                    if (k==kl-1) {
                        bctx.closePath();
                        bctx.fill();
                    }
                }
                bctx.restore();
                //===========================
            }
        }
    }
    bbt.update();
}
//==========================================================
//Game_QJLightLayer
//==========================================================
Game_QJLightLayer.prototype.initialize = function(characterId,initLightData) {
    //=========================================
    this.lightId = initLightData.id;
    this.character = characterId;
    this.dead = false;
    this.shadowWall = initLightData.shadowWall;
    this.shadowCharacter = initLightData.shadowCharacter;
    this.visible = true;
    this.attach = initLightData.attach||null;
    //=========================================
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.opacity = 1;
    this.rotation = 0;
    this.rotationAuto = 0;
    this.tint = "#FFFFFF";
    this.initData = initLightData;
    this.dirRotationFrame = [0,0,0,0];//时间，速度，起始，终止
    this.shadowCharacterShakeX = 1;
    //=========================================
    this.dialogLength = 0;
    //=========================================
    this.needRefreshFrame = false;
    this.lightSpriteFrame = [0,0,1,1];
    let baseTextureData = saveTexture[initLightData.imgName];
    this.bimtapWidth = baseTextureData.width;
    this.bimtapHeight = baseTextureData.height;
    if (initLightData.imgName.includes("$")) {
        this.lightSpriteFrame[3] = 4;
        this.dirImgFrame = true;
    } else this.lightSpriteFrame[3] = 1;
    let animEffect = initLightData.imgName.match(/\[([^,]+)\,([^]+)\]/i);
    if (animEffect) {
        this.dramaticBitmap = [0,Number(animEffect[2]),0,Number(animEffect[1])];
        this.lightSpriteFrame[2] = this.dramaticBitmap[3];
    } else this.lightSpriteFrame[2] = 1;
    //=========================================
    this.dialogLength = Math.floor(Math.sqrt(this.bimtapWidth*this.bimtapWidth/this.lightSpriteFrame[2]/this.lightSpriteFrame[2]+
        this.bimtapHeight*this.bimtapHeight/this.lightSpriteFrame[3]/this.lightSpriteFrame[3]));
    this.startX = (1-this.bimtapWidth /this.lightSpriteFrame[2]/this.dialogLength)/2;
    this.startY = (1-this.bimtapHeight/this.lightSpriteFrame[3]/this.dialogLength)/2;
    //=========================================
    this.update();
    //=========================================
};
Game_QJLightLayer.prototype.updateFrame = function(character) {
    //=========================================
    if (!this.dirImgFrame&&!this.dramaticBitmap) return;
    let tarX=0,tarY=0;
    if (this.dirImgFrame) tarY = (character.direction()/2-1)/4;
    else tarY = 0;
    if (this.dramaticBitmap) {
        this.dramaticBitmap[0]++;
        if (this.dramaticBitmap[0]>=this.dramaticBitmap[1]) {
            this.dramaticBitmap[0] = 0;
            this.dramaticBitmap[2]++;
            if (this.dramaticBitmap[2]>=this.dramaticBitmap[3]) {
                this.dramaticBitmap[2]=0;
            }
        }
        tarX = this.dramaticBitmap[2]/this.dramaticBitmap[3];
    } else tarX = 0;
    if (tarX!=this.lightSpriteFrame[0]||tarY!=this.lightSpriteFrame[1]) {
        this.needRefreshFrame = true;
        this.lightSpriteFrame[0] = tarX;
        this.lightSpriteFrame[1] = tarY;
    }
    //=========================================
};
Game_QJLightLayer.prototype.update = function() {
    //=========================================
    let character = QJ.LL.getCharacter(this.character);
    if (!character) {this.setDead();return;}
    let od = this.initData;
    //=========================================
    this.updateFrame(character);
    //=========================================
    this.rotationAuto+=od.rotationAuto;
    //=========================================
    let d = character.direction();
    //为SSMBS_Avartar适配的八方移动，这插件作者实现八方移动的方式真……
    if (character._direction8dir!=undefined) {
        if (character._direction8dir==1||character._direction8dir==3||
            character._direction8dir==7||character._direction8dir==9) {
            d = character._direction8dir;
        }
    }
    //_/
    this.updatePosition(od,character,d);
    this.updateRotation(od,character,d);
    this.updateScale(od,character,d);
    this.updateOpacity(od,character,d)
    this.shadowCharacterOffsetX = od.shadowCharacterOffsetX.get();
    this.shadowCharacterOffsetY = od.shadowCharacterOffsetY.get();
    if (this.dirRotationFrame[3]!=od.dirRotation[d]) {
        if (od.dirRotationFrame>0) {
            this.dirRotationFrame[0] = od.dirRotationFrame;
            let changeDegree = od.dirRotation[d]-this.dirRotationFrame[3];
            if (Math.abs(changeDegree)>Math.PI) {
                this.dirRotationFrame[1] = -Math.sign(changeDegree)*(Math.abs(changeDegree)-Math.PI)/od.dirRotationFrame;
            } else {
                this.dirRotationFrame[1] = changeDegree/od.dirRotationFrame;
            }
            this.dirRotationFrame[2] = this.dirRotationFrame[3];
            this.dirRotationFrame[3] = od.dirRotation[d];
        } else {
            this.dirRotationFrame[0] = 0;
            this.dirRotationFrame[3] = od.dirRotation[d];
        }
    }
    if (this.dirRotationFrame[0]==0) {
        this.rotation+=this.dirRotationFrame[3];
    } else {
        this.dirRotationFrame[2]+=this.dirRotationFrame[1];
        this.dirRotationFrame[0]--;
        this.rotation+=this.dirRotationFrame[2];
    }
    this.tint = od.tint.get();
    this.shadowCharacterShakeX = od.shadowCharacterShakeX.get();
    //=========================================
    //=========================================
    //=========================================
    //=========================================
};
Game_QJLightLayer.prototype.updatePosition = function(od,character,d) {
    //=========================================
    if (!$dataMap) return; 
    this.x = character._realX*standardTile+
        od.offsetX.get()+od.dirOffsetX[d];
    this.y = character._realY*standardTile+
        od.offsetY.get()+od.dirOffsetY[d];
    //=========================================
};
Game_QJLightLayer.prototype.updateRotation = function(od,character,d) {
    //=========================================
    this.rotation = od.rotation.get()+this.rotationAuto;
    if (od.rotationMouse) this.rotation+=QJ.LL.calculateAngleByTwoPoint(character.screenX(),character.screenY(),
        mouseX+standardExpand/2,mouseY+standardExpand/2);
    if (this.attach) {
        let functions = QJ.LL.lightObjectFunction[this.attach.attributeName];
        if (functions.updateRotation) {
            functions.updateRotation.call(this,od,character,d);
            return;
        }
    }
    //=========================================
};
Game_QJLightLayer.prototype.updateScale = function(od,character,d) {
    //=========================================
    this.scaleX = od.scaleX.get();
    this.scaleY = od.scaleY.get();
    //=========================================
};
Game_QJLightLayer.prototype.updateOpacity = function(od,character,d) {
    //=========================================
    this.opacity = od.opacity.get();
    //=========================================
};
Game_QJLightLayer.prototype.setDead = function() {
    //=========================================
    delete $gameSystem.characterLights[this.character][this.lightId];
    this.dead = true;
    //=========================================
};
//==========================================================
//Game_QJLightLayerMini
//==========================================================
Game_QJLightLayerMini.prototype.initialize = function(attach,initLightData,index) {
    //=========================================
    this.lightId = initLightData.id;
    this.dead = false;
    this.visible = true;
    this.index = index;
    this.attach = attach;
    this.existTime = 0;
    //=========================================
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.opacity = 1;
    this.rotation = 0;
    this.rotationAuto = 0;
    this.tint = "#FFFFFF";
    this.initData = initLightData;
    this.time = this.initData.during;
    //========================================= 
    this.needRefreshFrame = true;
    let baseTextureData = saveTexture[initLightData.imgName];
    this.lightSpriteFrame = [0,0,baseTextureData.width,baseTextureData.height];
    let animEffect = initLightData.imgName.match(/\[([^,]+)\,([^]+)\]/i);
    if (animEffect) {
        this.dramaticBitmap = [0,Number(animEffect[2]),0,Number(animEffect[1])];
        this.lightSpriteFrame[2] /= this.dramaticBitmap[3];
    }
    //=========================================
    this.update();
    //=========================================
};
Game_QJLightLayerMini.prototype.updateFrame = function() {
    //=========================================
    if (!this.dramaticBitmap) return;
    let tarX=0;
    if (this.dramaticBitmap) {
        this.dramaticBitmap[0]++;
        if (this.dramaticBitmap[0]>=this.dramaticBitmap[1]) {
            this.dramaticBitmap[0] = 0;
            this.dramaticBitmap[2]++;
            if (this.dramaticBitmap[2]>=this.dramaticBitmap[3]) {
                this.dramaticBitmap[2]=0;
            }
        }
        tarX = this.dramaticBitmap[2]*this.lightSpriteFrame[2];
    }
    if (tarX!=this.lightSpriteFrame[0]) {
        this.needRefreshFrame = true;
        this.lightSpriteFrame[0] = tarX;
    }
    //=========================================
};
Game_QJLightLayerMini.prototype.update = function() {
    //=========================================
    let od = this.initData;
    this.updateFrame();
    //=========================================
    if (this.time>0) this.time--;
    else if (this.time==0) {
        this.setDead();
        return;
    }
    this.updatePosition(od);
    this.updateRotation(od);
    this.updateScale(od);
    this.updateOpacity(od)
    this.tint = od.tint.get();
    this.existTime++;
    if (this.attach.type==1) {
        let ifShow = false,id = this.attach.regionId;
        if (od.showCondition==0) {
            ifShow=true;
        } else if (od.showCondition==1) {
            ifShow=$gamePlayer.remRegionId==id;
        } else if (od.showCondition==2) {
            ifShow=$gamePlayer.reSetX==this.attach.mapX&&$gamePlayer.reSetY==this.attach.mapY;
        }
        if (regionLightsData[id].showConditionExtra) {
            ifShow = regionLightsData[id].showConditionExtra.call(this,ifShow);
        }
        this.visible = ifShow;
    }
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.update) functions.update.call(this,od);
    }
    //=========================================
};
Game_QJLightLayerMini.prototype.updatePosition = function(od) {
    //=========================================
    if (this.attach.type==0||this.attach.type==1) {
        this.x = this.attach.x+od.offsetX.get();
        this.y = this.attach.y+od.offsetY.get();
    } else if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updatePosition) functions.updatePosition.call(this,od);
    }
    //=========================================
};
Game_QJLightLayerMini.prototype.updateRotation = function(od) {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updateRotation) {
            functions.updateRotation.call(this,od);
            return;
        }
    }
    this.rotation = od.rotation.get();
    //=========================================
};
Game_QJLightLayerMini.prototype.updateScale = function(od) {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updateScale) {
            functions.updateScale.call(this,od);
            return;
        }
    }
    this.scaleX = od.scaleX.get();
    this.scaleY = od.scaleY.get();
    //=========================================
};
Game_QJLightLayerMini.prototype.updateOpacity = function(od) {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.updateOpacity) {
            functions.updateOpacity.call(this,od);
            return;
        }
    }
    this.opacity = od.opacity.get();
    //=========================================
};
Game_QJLightLayerMini.prototype.setDead = function() {
    //=========================================
    if (this.attach.type==2) {
        let functions = QJ.LL.miniLightObjectFunction[this.attach.attributeName];
        if (functions.setDead) functions.setDead.call(this);
    }
    $gameSystem.miniLights[this.index] = null;
    this.dead = true;
    //=========================================
};
//==========================================================
//Sprite_QJLightPart
//==========================================================
function Sprite_QJLightLayer() {
    this.initialize.apply(this, arguments);
}
Sprite_QJLightLayer.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_QJLightLayer.prototype.constructor = Sprite_QJLightLayer;
Sprite_QJLightLayer.prototype.initialize = function(_parent,odata) {
    //====================================
    this._spriteset = _parent;
    this.lightId = odata.lightId;
    this.odata = odata;
    this.initData = odata.initData;
    this.character = odata.character;
    this.oldScaleXRem = 0;
    this.oldScaleYRem = 0;
    this.onWallMode = false;
    this.dead = false;
    this.shadowWall = this.odata.shadowWall;
    //====================================
    let baseTextureUse = saveTexture[odata.initData.imgName];
    this.dialogLength = this.odata.dialogLength;
    //====================================
    if (this.shadowWall) {
        PIXI.Sprite.call(this,new PIXI.RenderTexture.create({width:this.dialogLength,height:this.dialogLength}));
    } else {
        PIXI.Sprite.call(this,new PIXI.Texture(baseTextureUse));
    }
    if (this.shadowWall) this.pluginName = "qjlightrender";
    this.anchor.set(0.5,0.5);
    //====================================
    if (this.shadowWall) {
        this.lightTexture = new PIXI.Texture(baseTextureUse);
    }
    //====================================
    if (this.shadowWall) {
        this.shadowSprite = new PIXI.Graphics();
        this.shadowSprite.isLightShadow = true;
        this.shadowSprite.x = this.dialogLength/2;
        this.shadowSprite.y = this.dialogLength/2;
        this.shadowTexture = new PIXI.RenderTexture.create({width:this.dialogLength,height:this.dialogLength});
        this._texture.baseTexture.sendTextureData = [this.lightTexture,this.shadowTexture];
        this._texture.baseTexture.sendRotationData = [0,0,0,0,0,0,0,0,this.odata.lightSpriteFrame,this.odata.startX,this.odata.startY];
        this.shadowTexture.baseTexture.clearColor=[1,1,1,1];
    }
    //====================================
    this.buildShadowContainer();
    //====================================
};
Sprite_QJLightLayer.prototype.buildShadowContainer = function() {
    if (this.odata.shadowCharacter) {
        this.characterShadowContainer = new PIXI.Container();
        this.characterShadowContainer.csList = [];
    }
};
Sprite_QJLightLayer.prototype.render = function(renderer) {
    if (!this.visible) return;
    this._render(renderer);
};
Sprite_QJLightLayer.prototype.update = function() {
    //===================================
    if ($gameSystem.characterLights[this.character][this.lightId]!=this.odata) {
        this.setDead();
        return;
    }
    //===================================
    let refreshShadow=false,refreshShadowUvs=false,newVisible=true;
    //===================================
    this.updatePosition();
    //===================================
    newVisible = this.odata.visible;
    //===================================
    if (newVisible!=this.visible) {
        this.visible = newVisible;
        if (this.visible) {
            if (this.characterShadowContainer) this.characterShadowContainer.visible = true;
            refreshShadow=true;
            refreshShadowUvs=true;
        } else {
            if (this.characterShadowContainer) this.characterShadowContainer.visible = false;
        }
    }
    //===================================
    if (!this.visible) return;
    //===================================
    this.alpha = this.odata.opacity;
    //===================================
    if (this.oldTint!=this.odata.tint) {
        this.tint = Number("0x"+this.odata.tint.substr(1));
        this.oldTint = this.odata.tint;
    }
    //===================================
    let scaleData = this.updateScale();
    if (scaleData[0]) refreshShadowUvs = scaleData[0];
    if (scaleData[1]) refreshShadow    = scaleData[1];
    //===================================
    if (this.oldRotation!=this.odata.rotation) {
        this.oldRotation = this.odata.rotation;
        this.rotation = this.oldRotation;
        refreshShadowUvs = true;
    }
    //===================================
    if (this.oldX!=this.odata.x||this.oldY!=this.odata.y) {
        this.oldX=this.odata.x;
        this.oldY=this.odata.y;
        refreshShadow = true;
    }
    //===================================
    if (refreshShadowUvs&&this.shadowWall) this.refreshShadowUvs();
    if (refreshShadow&&this.shadowWall) this.refreshShadowRegion();
    //===================================
};
Sprite_QJLightLayer.prototype.updateScale = function() {
    //===================================
    let refreshShadowUvs,refreshShadow;
    if (this.oldScaleX!=this.odata.scaleX||this.oldScaleY!=this.odata.scaleY) {
        this.oldScaleX = this.odata.scaleX;
        this.oldScaleY = this.odata.scaleY;
        this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
        refreshShadowUvs = true;
        if (this.oldScaleX>this.oldScaleXRem||this.oldScaleY>this.oldScaleYRem) {
            this.oldScaleXRem=this.oldScaleX;
            this.oldScaleYRem=this.oldScaleY;
            refreshShadow = true;
        }
    }
    return [refreshShadowUvs,refreshShadow];
    //===================================
};
Sprite_QJLightLayer.prototype.updatePosition = function() {
    this.x = this.odata.x-dx48+standardTile/2;
    this.y = this.odata.y-dy48+standardTile/2;
};
Sprite_QJLightLayer.prototype.refreshShadowUvs = function() {
    let sin = Math.sin(this.rotation),cos = Math.cos(this.rotation);
    this._texture.baseTexture.sendRotationData[0] = sin;
    this._texture.baseTexture.sendRotationData[1] = cos;
    this._texture.baseTexture.sendRotationData[2] = 0.5-((cos)*this.oldScaleX-(sin)*this.oldScaleY)*0.5/this.oldScaleXRem;
    this._texture.baseTexture.sendRotationData[3] = 0.5-((sin)*this.oldScaleX+(cos)*this.oldScaleY)*0.5/this.oldScaleYRem;
    this._texture.baseTexture.sendRotationData[4] = this.oldScaleX;
    this._texture.baseTexture.sendRotationData[5] = this.oldScaleY;
    this._texture.baseTexture.sendRotationData[6] = 1/this.oldScaleXRem;
    this._texture.baseTexture.sendRotationData[7] = 1/this.oldScaleYRem;
}
Sprite_QJLightLayer.prototype.refreshShadowRegion = function() {
    //===================================
    let regionIdForShadow = $gameMap.regionIdForShadow.bind($gameMap);
    let pixiPointer = PIXI;
    let mathPointer = Math;
    //===================================
    let x = this.oldX,y = this.oldY;
    let sc = this.shadowSprite,dl = this.dialogLength/2,sd = $gameMap.shadowDataQJLL;
    let absPX = mathPointer.floor(x/48)*48-x,absPY = mathPointer.floor(y/48)*48-y;
    let scaleX=this.oldScaleXRem,scaleY=this.oldScaleYRem;
    let iStart = mathPointer.max(mathPointer.floor((x-dl*scaleX)/48),0),iEnd = mathPointer.min(mathPointer.floor((x+dl*scaleX)/48),$gameMap.width()-1);
    let jStart = mathPointer.max(mathPointer.floor((y-dl*scaleY)/48),0),jEnd = mathPointer.min(mathPointer.floor((y+dl*scaleY)/48),$gameMap.height()-1);
    let id,x1,y1,x2,y2,sx,sy,expandTimes=mathPointer.max(jEnd-jStart,iEnd-iStart),addHeight=0;
    //===================================
    let tempNullLineStyle = new pixiPointer.LineStyle();
    let tempFillStyle0 = Object.assign(new pixiPointer.FillStyle(),{color:0xffffff,alpha:1,visible:true});
    let tempFillStyle1;
    let tempFillStyle2 = Object.assign(new pixiPointer.FillStyle(),{color:0x000000,alpha:1,visible:true});//黑色
    //===================================
    sc.clear();
    //===================================
    this.onWallMode = sd[
        mathPointer.min(mathPointer.max(mathPointer.round(x/48),0),$gameMap.width()-1)][
        mathPointer.min(mathPointer.max(mathPointer.round(y/48),0),$gameMap.height()-1)];
    //===================================
    let tarY;
    let whiteBlockList = [];
    let blockBlockList = [];
    //===================================
    for (let i=iStart;i<=iEnd;i++) {
        for (let j=jStart;j<=jEnd;j++) {
            //===================================
            if (sd[i][j]==-1) continue;
            id = regionIdForShadow(i,j);
            if (regionData[id]&&regionData[id].shadowShow) {
                //===========================
                sx = i*48-x-24;
                sy = j*48-y-24;
                //===========================
                if (sx<0&&sy<0&&sx>-48&&sy>-48) continue;
                //===========================
                tempFillStyle1 = Object.assign(new pixiPointer.FillStyle(),{
                    color:regionData[id].shadowTint,alpha:regionData[id].shadowOpacity,visible:true});
                addHeight = regionData[id].shadowHeight;
                //===========================
                if (this.onWallMode!=-1) {
                    //===========================
                    tarY = sd[i][j];
                    //===========================
                    if (tarY!=j&&tarY==this.onWallMode) {
                        //===========================
                        sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                            (sx+48)/scaleX,(sy)/scaleY                ,(sx+48)/scaleX,(sy+addHeight*48+48)/scaleY,
                            (sx)/scaleX,   (sy+addHeight*48+48)/scaleY,(sx)/scaleX,   (sy)/scaleY
                            ),tempFillStyle0,tempNullLineStyle,null));
                        //===========================
                        j = tarY;
                        //===========================
                    } else {
                        //==========================
                        sy+=addHeight*48;
                        //===========================
                        if (j+addHeight-this.onWallMode==1) {
                            if (sx>=0&&sy>=0)         {//3
                                x1=(sx   )/scaleX; y1=(sy+48)/scaleY; x2=(sx+48)/scaleX; y2=(sy   )/scaleY;
                                sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                    x1*expandTimes,y1*expandTimes,x1,y1,x1,y2,dl,y2
                                    ),tempFillStyle1,tempNullLineStyle,null));
                            } else if (sx<=-48&&sy>=0){//1
                                x1=(sx   )/scaleX; y1=(sy   )/scaleY; x2=(sx+48)/scaleX; y2=(sy+48)/scaleY;
                                sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                    -dl,y1,x2,y1,x2,y2,x2*expandTimes,y2*expandTimes
                                    ),tempFillStyle1,tempNullLineStyle,null));
                            }
                        } else {
                            if (sx>=0&&sy>=0)         {//3
                                x1=(sx   )/scaleX; y1=(sy+48)/scaleY; x2=(sx+48)/scaleX; y2=(sy   )/scaleY;
                            } else if (sx<=-48&&sy>=0){//1
                                x1=(sx   )/scaleX; y1=(sy   )/scaleY; x2=(sx+48)/scaleX; y2=(sy+48)/scaleY;
                            } else if (sy>=0)         {//2
                                x1=(sx   )/scaleX; y1=(sy   )/scaleY; x2=(sx+48)/scaleX; y2=(sy   )/scaleY;
                            }
                            sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                x1*expandTimes,y1*expandTimes,x1,y1,x2,y2,x2*expandTimes,y2*expandTimes
                                ),tempFillStyle1,tempNullLineStyle,null));
                        }
                        //===========================
                        sc.geometry.graphicsData.unshift(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                            (sx+48)/scaleX,(sy   )/scaleY,(sx+48)/scaleX,(sy+48)/scaleY,(sx   )/scaleX,(sy+48)/scaleY,(sx   )/scaleX,(sy   )/scaleY
                            ),tempFillStyle1,tempNullLineStyle,null));
                        //===========================
                    }
                    //===========================
                    continue;
                    //===========================
                } else {
                    //===========================
                    sy += addHeight*48;
                    //===========================
                    if (sx>=0&&sy>=0)         {x1=sx   ; y1=sy+48; x2=sx+48; y2=sy   ;}//3
                    else if (sx<=-48&&sy>=0)  {x1=sx   ; y1=sy   ; x2=sx+48; y2=sy+48;}//1
                    else if (sy>=0)           {x1=sx   ; y1=sy   ; x2=sx+48; y2=sy   ;}//2
                    else if (sx>=0&&sy<-48)   {x1=sx+48; y1=sy+48; x2=sx   ; y2=sy   ;}//9
                    else if (sx>=0)           {x1=sx   ; y1=sy+48; x2=sx   ; y2=sy   ;}//6
                    else if (sx<=-48&&sy<-48) {x1=sx+48; y1=sy   ; x2=sx   ; y2=sy+48;}//7
                    else if (sx<=-48)         {x1=sx+48; y1=sy   ; x2=sx+48; y2=sy+48;}//4
                    else if (sy<=-48)         {x1=sx+48; y1=sy+48; x2=sx   ; y2=sy+48;}//8
                    //===========================
                    blockBlockList.push([x1,y1,x2,y2]);//收集基础射线数据
                    //===========================
                    x1/=scaleX;
                    y1/=scaleY;
                    x2/=scaleX;
                    y2/=scaleY;
                    //===========================
                    sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                        x1*expandTimes,y1*expandTimes,x1,y1,x2,y2,x2*expandTimes,y2*expandTimes
                        ),tempFillStyle1,tempNullLineStyle,null));
                    //===========================
                    if (j+1<$gameMap.height() && regionIdForShadow(i,j+1)!=id) {//收集所有墙面数据
                        whiteBlockList.push([sx,sy-addHeight*48+48,sx+48,sy+48]);
                    }
                    //===========================
                    /*if (y>j*48-24+48+regionData[id].shadowHeight*48) {
                        for (let k=0,kl=regionData[id].shadowHeight;k<kl;k++) {
                            if (regionIdForShadow(i,j+k+1)==id) {addHeight=k;break;}
                            sy = j*48-y-24+48+k*48;
                            sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                sx/scaleX,     sy/scaleY     ,(sx+48)/scaleX,(sy)/scaleY,
                                (sx+48)/scaleX,(sy+48)/scaleY,(sx)/scaleX,   (sy+48)/scaleY
                                ),tempFillStyle0,tempNullLineStyle,null));
                        }
                    } else {
                        for (let k=0,kl=regionData[id].shadowHeight;k<kl;k++) {
                            if (regionIdForShadow(i,j+k+1)==id) {addHeight=k;break;}
                            sy = j*48-y-24+48+k*48;
                            sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                sx/scaleX,     sy/scaleY     ,(sx+48)/scaleX,(sy)/scaleY,
                                (sx+48)/scaleX,(sy+48)/scaleY,(sx)/scaleX,   (sy+48)/scaleY
                                ),Object.assign(new pixiPointer.FillStyle(),{color:pixiPointer.utils.rgb2hex([1,1,1]),
                                alpha:1,visible:true}),tempNullLineStyle,null));
                        }
                    }*/
                    //===========================
                }
                //===========================
            }
            //===========================
        }
    }
    //===================================
    if (this.onWallMode!=-1) {
        sy = (this.onWallMode*48-y-24+48)/scaleY;
        sc.geometry.graphicsData.splice(0,0,new pixiPointer.GraphicsData(new pixiPointer.Polygon(
            dl,-dl,dl,sy,-dl,sy,-dl,-dl),
            Object.assign(new pixiPointer.FillStyle(),{color:0x000000,alpha:1,visible:true}),tempNullLineStyle,null));
    } else {
        //blackAfterAdd：将黑色前墙面涂色储存起来，在之后再重新输出，保证黑色在白色上面让黑色完全覆盖白色。
        //因为这里的白色除了整个块都是白色的外，其它半白块都是处于“背后”的状态。
        for (let i=0,il=whiteBlockList.length,detail,blackAfterAdd;i<il;i++) {
            let detail = whiteBlockList[i];
            if (detail[3]>=0) {//玩家完全在其上
                sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                    detail[0]/scaleX,detail[1]/scaleY,
                    detail[2]/scaleX,detail[1]/scaleY,
                    detail[2]/scaleX,detail[3]/scaleY,
                    detail[0]/scaleX,detail[3]/scaleY
                    ),tempFillStyle2,tempNullLineStyle,null));
            } else {//分为两种，一种是渐变过渡色，一种是纯白，但不管是哪一个，只有完全可透时是自己的颜色，不然就是纯黑色
                let isTotalNoCave = true;
                let footY = detail[3];
                let footSX = detail[0];
                let footEX = detail[2];
                blackAfterAdd = [];
                for (let j=0,jl=blockBlockList.length,blockDetail,lineX1,lineX2;j<jl;j++) {
                    blockDetail = blockBlockList[j];
                    if (footY>=mathPointer.max(blockDetail[1],blockDetail[3])) {
                        continue;
                    }
                    if (mathPointer.min(blockDetail[0],blockDetail[2])>=detail[0] && 
                        mathPointer.max(blockDetail[0],blockDetail[2])<=detail[2] &&
                        mathPointer.min(blockDetail[1],blockDetail[3])>=detail[1] && 
                        mathPointer.max(blockDetail[1],blockDetail[3])<=detail[3]) {
                        continue;
                    }
                    if (blockDetail[0]==blockDetail[2]&&blockDetail[0]*footSX>0&&blockDetail[0]*footEX>0) {//八个象限，这个方法中全左和全右需要特殊判定，也就是射点在同一竖列时
                        lineX1 = (blockDetail[0]>0?footEX:footSX)*blockDetail[1]/blockDetail[0];
                        lineX2 = (blockDetail[0]>0?footEX:footSX)*blockDetail[3]/blockDetail[2];
                        if (footY>=mathPointer.max(lineX1,lineX2) || footY<=mathPointer.min(lineX1,lineX2)) {
                            continue;
                        }
                    } else {//八个象限，其他6个象限使用此通用办法
                        lineX1 = footY*blockDetail[0]/blockDetail[1];
                        if (lineX1*blockDetail[0]<0) {//不要加上等于号
                            continue;
                        }
                        lineX2 = footY*blockDetail[2]/blockDetail[3];
                        if (lineX2*blockDetail[2]<0) {//不要加上等于号
                            continue;
                        }
                        if (footSX>=mathPointer.max(lineX1,lineX2) || footEX<=mathPointer.min(lineX1,lineX2)) {
                            continue;
                        }
                    }
                    //是黑色
                    isTotalNoCave = false;
                    lineX1 = footY*(blockDetail[0]<blockDetail[2]?(blockDetail[0]/blockDetail[1]):(blockDetail[2]/blockDetail[3]));
                    if (lineX1>footSX&&lineX1<footEX) {//左白右黑分涂块
                        sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                            detail[0]/scaleX,detail[1]/scaleY,
                            lineX1/scaleX,detail[1]/scaleY,
                            lineX1/scaleX,detail[3]/scaleY,
                            detail[0]/scaleX,detail[3]/scaleY
                            ),tempFillStyle0,tempNullLineStyle,null));
                        blackAfterAdd.push([
                            lineX1/scaleX,detail[1]/scaleY,
                            detail[2]/scaleX,detail[1]/scaleY,
                            detail[2]/scaleX,detail[3]/scaleY,
                            lineX1/scaleX,detail[3]/scaleY
                        ]);
                    } else {
                        lineX1 = footY*(blockDetail[0]>blockDetail[2]?(blockDetail[0]/blockDetail[1]):(blockDetail[2]/blockDetail[3]));
                        if (lineX1>footSX&&lineX1<footEX) {//左黑右白分涂块
                            sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                                lineX1/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[3]/scaleY,
                                lineX1/scaleX,detail[3]/scaleY
                                ),tempFillStyle0,tempNullLineStyle,null));
                            blackAfterAdd.push([
                                detail[0]/scaleX,detail[1]/scaleY,
                                lineX1/scaleX,detail[1]/scaleY,
                                lineX1/scaleX,detail[3]/scaleY,
                                detail[0]/scaleX,detail[3]/scaleY
                            ]);
                        } else {//全黑块
                            blackAfterAdd.push([
                                detail[0]/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[1]/scaleY,
                                detail[2]/scaleX,detail[3]/scaleY,
                                detail[0]/scaleX,detail[3]/scaleY
                            ]);
                        }
                    }
                }
                for (let bAA of blackAfterAdd) {
                    sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(bAA),tempFillStyle2,tempNullLineStyle,null));
                }
                if (isTotalNoCave) {//完全没有被射到，是原色，或者说纯白块
                    sc.geometry.graphicsData.push(new pixiPointer.GraphicsData(new pixiPointer.Polygon(
                        detail[0]/scaleX,detail[1]/scaleY,
                        detail[2]/scaleX,detail[1]/scaleY,
                        detail[2]/scaleX,detail[3]/scaleY,
                        detail[0]/scaleX,detail[3]/scaleY
                        ),tempFillStyle0,tempNullLineStyle,null));
                }
            }
            
        }
    }
    sc.geometry.dirty++;
    //===================================
    Graphics._app.renderer.render(this.shadowSprite,this.shadowTexture);
    //===================================
};
Sprite_QJLightLayer.prototype.setDead = function() {
    //===================================
    if (this.characterShadowContainer&&this.characterShadowContainer.parent) {
        this.characterShadowContainer.parent.removeChild(this.characterShadowContainer);
    }
    this.parent.removeChild(this);
    this.destroy();
    this.dead = true;
    //===================================
};
//==========================================================
//Sprite_QJLightPart
//==========================================================
function Sprite_QJLightLayerMini() {
    this.initialize.apply(this, arguments);
}
Sprite_QJLightLayerMini.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_QJLightLayerMini.prototype.constructor = Sprite_QJLightLayerMini;
Sprite_QJLightLayerMini.prototype.initialize = function(_parent,odata) {
    //====================================
    this._spriteset = _parent;
    this.odata = odata;
    this.initData = odata.initData;
    this.index = odata.index;
    this.dead = false;
    //====================================
    PIXI.Sprite.call(this,new PIXI.Texture(saveTexture[odata.initData.imgName]));
    this.anchor.set(0.5,0.5);
    this.update();
    //====================================
};
Sprite_QJLightLayerMini.prototype.update = function() {
    //===================================
    if ($gameSystem.miniLights[this.index]!=this.odata) {
        this.setDead();
        return;
    }
    //===================================
    this.updatePosition();
    //===================================
    this.alpha = this.odata.opacity;
    this.visible = this.odata.visible;
    //===================================
    if (this.oldTint!=this.odata.tint) {
        this.tint = Number("0x"+this.odata.tint.substr(1));
        this.oldTint = this.odata.tint;
    }
    this.updateScale();
    if (this.oldRotation!=this.odata.rotation) {
        this.oldRotation = this.odata.rotation;
        this.rotation = this.oldRotation;
    }
    if (this.odata.needRefreshFrame) {
        this.odata.needRefreshFrame = false;
        this.texture.frame.x = this.odata.lightSpriteFrame[0];
        this.texture.frame.width = this.odata.lightSpriteFrame[2];
        this.texture.frame = this.texture.frame;
    }
    //===================================
};
Sprite_QJLightLayerMini.prototype.setDead = function() {
    //===================================
    this.parent.removeChild(this);
    this.destroy();
    this.dead = true;
    //===================================
};
Sprite_QJLightLayerMini.prototype.updatePosition = function() {
    //===================================
    this.x = this.odata.x-dx48;
    this.y = this.odata.y-dy48;
    //===================================
};
Sprite_QJLightLayerMini.prototype.updateScale = function() {
    //===================================
    if (this.oldScaleX!=this.odata.scaleX||this.oldScaleY!=this.odata.scaleY) {
        this.oldScaleX = this.odata.scaleX;
        this.oldScaleY = this.odata.scaleY;
        this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
    }
    //===================================
};
//==========================================================
//UltraMode7
//==========================================================
if (Imported.Blizzard_UltraMode7) {
    //==========================================================
    //
    //==========================================================
    const LLS_Game_QJLightLayer_updatePosition = Game_QJLightLayer.prototype.updatePosition;
    Game_QJLightLayer.prototype.updatePosition = function(od,character,d) {
        if (!$gameMap.useUltraMode7) return LLS_Game_QJLightLayer_updatePosition.call(this,od,character,d);
        //=========================================
        if (!$dataMap) return; 
        this.x = character._realX*standardTile;
        this.xAdd = od.offsetX.get()+od.dirOffsetX[d];
        this.y = character._realY*standardTile;
        this.yAdd = od.offsetY.get()+od.dirOffsetY[d];
        //=========================================
    };
    const LLS_Sprite_QJLightLayer_updatePosition = Sprite_QJLightLayer.prototype.updatePosition;
    Sprite_QJLightLayer.prototype.updatePosition = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayer_updatePosition.call(this);
        //===================================
        let loopedPosition = $gameMap.adjustUltraMode7LoopedPosition((this.odata.x+standardTile/2)/48,(this.odata.y+standardTile/2)/48);
        let position = UltraMode7.mapToScreen(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        let scale = this.UM7scale = UltraMode7.mapToScreenScale(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        this.x = position.x+standardExpand/2+this.odata.xAdd*scale;
        this.y = position.y+standardExpand/2+this.odata.yAdd*scale;
        //===================================
    };
    const LLS_Sprite_QJLightLayer_updateScale = Sprite_QJLightLayer.prototype.updateScale;
    Sprite_QJLightLayer.prototype.updateScale = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayer_updateScale.call(this);
        //===================================
        let scale = this.UM7scale,refreshShadowUvs,refreshShadow;
        let scaleX = this.odata.scaleX*scale;
        let scaleY = this.odata.scaleY*scale;
        if (this.oldScaleX!=scaleX||this.oldScaleY!=scaleY) {
            this.oldScaleX = scaleX;
            this.oldScaleY = scaleY;
            this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
            refreshShadowUvs = true;
            if (this.oldScaleX>this.oldScaleXRem||this.oldScaleY>this.oldScaleYRem) {
                this.oldScaleXRem=this.oldScaleX;
                this.oldScaleYRem=this.oldScaleY;
                refreshShadow = true;
            }
        }
        return [refreshShadowUvs,refreshShadow];
        //===================================
    };
    //==========================================================
    //
    //==========================================================
    const LLS_Game_QJLightLayerMini_updatePosition = Game_QJLightLayerMini.prototype.updatePosition;
    Game_QJLightLayerMini.prototype.updatePosition = function(od) {
        if (!$gameMap.useUltraMode7) return LLS_Game_QJLightLayerMini_updatePosition.call(this,od);
        //=========================================
        this.xAdd = od.offsetX.get();
        this.yAdd = od.offsetY.get();
        if (this.attach.type==0||this.attach.type==1) {
            this.x = this.attach.x;
            this.y = this.attach.y;
        } else if (this.attach.type==2) {
            if (this.attach.object.isDeadQJ()) {
                this.setDead();
                return;
            }
            this.x = this.attach.object.mapShowXQJ();
            this.y = this.attach.object.mapShowYQJ();
        }
        this.x += this.xAdd;
        this.y += this.yAdd;
        //=========================================
    };
    const LLS_Sprite_QJLightLayerMini_updatePosition = Sprite_QJLightLayerMini.prototype.updatePosition;
    Sprite_QJLightLayerMini.prototype.updatePosition = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayerMini_updatePosition.call(this);
        //===================================
        let loopedPosition = $gameMap.adjustUltraMode7LoopedPosition(this.odata.x/48,this.odata.y/48);
        let position = UltraMode7.mapToScreen(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        this.x = position.x+standardExpand/2;
        this.y = position.y+standardExpand/2;
        let scale = UltraMode7.mapToScreenScale(loopedPosition.x*$gameMap.tileWidth(),loopedPosition.y*$gameMap.tileHeight());
        let scaleX = this.odata.scaleX*scale;
        let scaleY = this.odata.scaleY*scale;
        if (this.oldScaleX!=scaleX||this.oldScaleY!=scaleY) {
            this.oldScaleX = scaleX;
            this.oldScaleY = scaleY;
            this.scale = new PIXI.ObservablePoint(null,null,this.oldScaleX,this.oldScaleY);
        }
        //===================================
    };
    const LLS_Sprite_QJLightLayerMini_updateScale = Sprite_QJLightLayerMini.prototype.updateScale;
    Sprite_QJLightLayerMini.prototype.updateScale = function() {
        if (!$gameMap.useUltraMode7) return LLS_Sprite_QJLightLayerMini_updateScale.call(this);
        //===================================
        //nothing
        //===================================
    };
    //==========================================================
    //
    //==========================================================
}
//==========================================================
//
//==========================================================
Sprite_QJLightSystem.prototype.render = function(renderer) {
    if (!this.visible) return;
    renderer.batch.flush();
    var filters = this.filters;
    if (filters) {
        if (!this._enabledFilters) this._enabledFilters = [];
        this._enabledFilters.length = 0;
        for (var i = 0; i < filters.length; i++) {
            if (filters[i].enabled) this._enabledFilters.push(filters[i]);
        }
        if (this._enabledFilters.length) renderer.filter.push(this, this._enabledFilters);
    }
    this._render(renderer);
    if (this.children.length>2) {
        for (var _i2 = 0, j = this.children.length-2; _i2 < j; _i2++) {
            this.children[_i2].render(renderer);
        }
        renderer.batch.flush();
    }
    this.children[this.children.length-2].render(renderer);
    this.children[this.children.length-1].render(renderer);
    renderer.batch.flush();
    if (filters && this._enabledFilters && this._enabledFilters.length) {
        renderer.filter.pop();
    }
};
//==========================================================
//QJLightRender
//==========================================================
QJLightRender = function() {
    this.initialize(...arguments);
}
QJLightRender._drawCallPool = [];
QJLightRender._textureArrayPool = [];
QJLightRender.prototype = Object.create(PIXI.ObjectRenderer.prototype);
QJLightRender.prototype.constructor = QJLightRender;
QJLightRender.prototype.initialize = function(renderer) {
    PIXI.ObjectRenderer.call(this,renderer);
    //====================================
    this.geometryClass = PIXI.BatchGeometry;
    this.vertexSize = 6;
    this.state = PIXI.State.for2d();
    this.size = PIXI.settings.SPRITE_BATCH_SIZE * 4;
    this._vertexCount = 0;
    this._indexCount = 0;
    this._bufferedElements = [];
    this._bufferedTextures = [];
    this._bufferSize = 0;
    this._shader = null;
    this._packedGeometries = [];
    this._packedGeometryPoolSize = 2;
    this._flushId = 0;
    this._aBuffers = {};
    this._iBuffers = {};
    this.MAX_TEXTURES = 1;
    //====================================
    this.renderer.on('prerender', this.onPrerender, this);
    renderer.runners.contextChange.add(this);
    //====================================
    this._dcIndex = 0;
    this._aIndex = 0;
    this._iIndex = 0;
    this._attributeBuffer = null;
    this._indexBuffer = null;
    this._tempBoundTextures = [];
    this._defaultSyncData = {textureCount:0};
    //====================================
};
QJLightRender.prototype.onPrerender = function() {
    this._flushId = 0;
};
QJLightRender.prototype.contextChange = function() {
    var gl = this.renderer.gl;
    this.MAX_TEXTURES = 1;
    this._shader = QJ.LL.generateMultiTextureShader();
    for (var i = 0; i < this._packedGeometryPoolSize; i++) {
        this._packedGeometries[i] = new (this.geometryClass)();
    }
    this.initFlushBuffers();
};
QJLightRender.prototype.initFlushBuffers = function() {
    var _drawCallPool = QJLightRender._drawCallPool;
    var _textureArrayPool = QJLightRender._textureArrayPool;
    var MAX_SPRITES = this.size / 4;
    var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;
    while (_drawCallPool.length < MAX_SPRITES) {
        _drawCallPool.push(new PIXI.BatchDrawCall());
    }
    while (_textureArrayPool.length < MAX_TA) {
        _textureArrayPool.push(new PIXI.BatchTextureArray());
    }
    for (var i = 0; i < this.MAX_TEXTURES; i++) {
        this._tempBoundTextures[i] = null;
    }
};
QJLightRender.prototype.render = function(element) {
    if (!element._texture.valid) return;
    if (this._vertexCount + (element.vertexData.length / 2) > this.size) this.flush();
    this._vertexCount += element.vertexData.length / 2;
    this._indexCount += element.indices.length;
    this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
    this._bufferedElements[this._bufferSize++] = element;
};
QJLightRender.prototype.buildTexturesAndDrawCalls = function() {
    var ref = this;
    var textures = ref._bufferedTextures;
    var MAX_TEXTURES = ref.MAX_TEXTURES;
    var textureArrays = QJLightRender._textureArrayPool;
    var batch = this.renderer.batch;
    var boundTextures = this._tempBoundTextures;
    var touch = this.renderer.textureGC.count;
    var TICK = ++PIXI.BaseTexture._globalBatch;
    var countTexArrays = 0;
    var texArray = textureArrays[0];
    var start = 0;
    batch.copyBoundTextures(boundTextures, MAX_TEXTURES);
    for (var i = 0; i < this._bufferSize; ++i) {
        var tex = textures[i];
        textures[i] = null;
        if (tex._batchEnabled === TICK) continue;
        if (texArray.count >= MAX_TEXTURES) {
            batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
            this.buildDrawCalls(texArray, start, i);
            start = i;
            texArray = textureArrays[++countTexArrays];
            ++TICK;
        }
        tex._batchEnabled = TICK;
        tex.touched = touch;
        texArray.elements[texArray.count++] = tex;
    }
    if (texArray.count > 0) {
        batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
        this.buildDrawCalls(texArray, start, this._bufferSize);
        ++countTexArrays;
        ++TICK;
    }
    for (var i$1 = 0; i$1 < boundTextures.length; i$1++) {
        boundTextures[i$1] = null;
    }
    PIXI.BaseTexture._globalBatch = TICK;
};
QJLightRender.prototype.buildDrawCalls = function(texArray, start, finish) {
    var ref = this;
    var elements = ref._bufferedElements;
    var _attributeBuffer = ref._attributeBuffer;
    var _indexBuffer = ref._indexBuffer;
    var vertexSize = ref.vertexSize;
    var drawCalls = QJLightRender._drawCallPool;
    var dcIndex = this._dcIndex;
    var aIndex = this._aIndex;
    var iIndex = this._iIndex;
    var drawCall = drawCalls[dcIndex];
    drawCall.start = this._iIndex;
    drawCall.texArray = texArray;
    for (var i = start; i < finish; ++i) {
        var sprite = elements[i];
        var tex = sprite._texture.baseTexture;
        var spriteBlendMode = PIXI.utils.premultiplyBlendMode[
            tex.alphaMode ? 1 : 0][sprite.blendMode];
        elements[i] = null;
        if (start < i && drawCall.blend !== spriteBlendMode) {
            drawCall.size = iIndex - drawCall.start;
            start = i;
            drawCall = drawCalls[++dcIndex];
            drawCall.texArray = texArray;
            drawCall.start = iIndex;
        }
        this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
        aIndex += sprite.vertexData.length / 2 * vertexSize;
        iIndex += sprite.indices.length;
        drawCall.blend = spriteBlendMode;
    }
    if (start < finish) {
        drawCall.size = iIndex - drawCall.start;
        ++dcIndex;
    }
    this._dcIndex = dcIndex;
    this._aIndex = aIndex;
    this._iIndex = iIndex;
};
QJLightRender.prototype.updateGeometry = function() {
    var ref = this;
    var packedGeometries = ref._packedGeometries;
    var attributeBuffer = ref._attributeBuffer;
    var indexBuffer = ref._indexBuffer;
    if (!PIXI.settings.CAN_UPLOAD_SAME_BUFFER) {
        if (this._packedGeometryPoolSize <= this._flushId) {
            this._packedGeometryPoolSize++;
            packedGeometries[this._flushId] = new (this.geometryClass)();
        }
        packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
        packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
        this.renderer.geometry.bind(packedGeometries[this._flushId]);
        this.renderer.geometry.updateBuffers();
        this._flushId++;
    } else {
        packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
        packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
        this.renderer.geometry.updateBuffers();
    }
};
QJLightRender.prototype.bindUniforms = function(ud,uv,renderer,syncData) {
    var v = null;
    var cv = null
    var t = 0;
    var gl = renderer.gl
    cv = ud.uSamplers.value;
    v = uv.uSamplers;
    gl.uniform1iv(ud.uSamplers.location, v);
    gl.uniformMatrix3fv(ud.projectionMatrix.location, false, uv.projectionMatrix.toArray(true));
    if(uv.sRSin !== ud.sRSin.value) {
        ud.sRSin.value = uv.sRSin
        gl.uniform1f(ud.sRSin.location, uv.sRSin)
    }
    if(uv.sRCos !== ud.sRCos.value) {
        ud.sRCos.value = uv.sRCos
        gl.uniform1f(ud.sRCos.location, uv.sRCos)
    }
    if(uv.sROffsetX !== ud.sROffsetX.value) {
        ud.sROffsetX.value = uv.sROffsetX
        gl.uniform1f(ud.sROffsetX.location, uv.sROffsetX)
    }
    if(uv.sROffsetY !== ud.sROffsetY.value) {
        ud.sROffsetY.value = uv.sROffsetY
        gl.uniform1f(ud.sROffsetY.location, uv.sROffsetY)
    }
    if(uv.sRScaleX !== ud.sRScaleX.value) {
        ud.sRScaleX.value = uv.sRScaleX
        gl.uniform1f(ud.sRScaleX.location, uv.sRScaleX)
    }
    if(uv.sRScaleY !== ud.sRScaleY.value) {
        ud.sRScaleY.value = uv.sRScaleY
        gl.uniform1f(ud.sRScaleY.location, uv.sRScaleY)
    }
    if(uv.sRScaleX2 !== ud.sRScaleX2.value) {
        ud.sRScaleX2.value = uv.sRScaleX2
        gl.uniform1f(ud.sRScaleX2.location, uv.sRScaleX2)
    }
    if(uv.sRScaleY2 !== ud.sRScaleY2.value) {
        ud.sRScaleY2.value = uv.sRScaleY2
        gl.uniform1f(ud.sRScaleY2.location, uv.sRScaleY2)
    }
    if(uv.frameX !== ud.frameX.value) {
        ud.frameX.value = uv.frameX
        gl.uniform1f(ud.frameX.location, uv.frameX)
    }
    if(uv.frameY !== ud.frameY.value) {
        ud.frameY.value = uv.frameY
        gl.uniform1f(ud.frameY.location, uv.frameY)
    }
    if(uv.frameW !== ud.frameW.value) {
        ud.frameW.value = uv.frameW
        gl.uniform1f(ud.frameW.location, uv.frameW)
    }
    if(uv.frameH !== ud.frameH.value) {
        ud.frameH.value = uv.frameH
        gl.uniform1f(ud.frameH.location, uv.frameH)
    }
    if(uv.startX !== ud.startX.value) {
        ud.startX.value = uv.startX
        gl.uniform1f(ud.startX.location, uv.startX)
    }
    if(uv.startY !== ud.startY.value) {
        ud.startY.value = uv.startY
        gl.uniform1f(ud.startY.location, uv.startY)
    }
    renderer.shader.syncUniforms(uv.globals,renderer.shader.getglProgram(), syncData);
}
QJLightRender.prototype.drawBatches = function() {
    var dcCount = this._dcIndex;
    var ref = this.renderer;
    var gl = ref.gl;
    var stateSystem = ref.state;
    var drawCalls = QJLightRender._drawCallPool;
    var curTexArray = null;
    var unif = this._shader.uniforms;
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
    //=================================
    for (var i = 0; i < dcCount; i++) {
        var ref$1 = drawCalls[i];
        var texArray = ref$1.texArray;
        var type = ref$1.type;
        var size = ref$1.size;
        var start = ref$1.start;
        var blend = ref$1.blend;
        curTexArray = texArray;
        var textureSystem = this.renderer.texture;
        var currentTexture = texArray.elements[0];
        textureSystem.bind(currentTexture.sendTextureData[0],0);
        textureSystem.bind(currentTexture.sendTextureData[1],1);
        texArray.elements[0] = null;
        texArray.count = 0;
        //=================================
        var sendData = currentTexture.sendRotationData;
        unif.sRSin = sendData[0];
        unif.sRCos = sendData[1];
        unif.sROffsetX = sendData[2];
        unif.sROffsetY = sendData[3];
        unif.sRScaleX = sendData[4];
        unif.sRScaleY = sendData[5];
        unif.sRScaleX2 = sendData[6];
        unif.sRScaleY2 = sendData[7];
        unif.frameX = sendData[8][0];
        unif.frameY = sendData[8][1];
        unif.frameW = sendData[8][2];
        unif.frameH = sendData[8][3];
        unif.startX = sendData[9];
        unif.startY = sendData[10];
        this._defaultSyncData.textureCount = 0;
        this.bindUniforms(this.renderer.shader.getglProgram().uniformData,
            this._shader.uniformGroup.uniforms,ref,this._defaultSyncData);
        //=================================
        this.state.blendMode = blend;
        stateSystem.set(this.state);
        gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
    }
};
QJLightRender.prototype.flush = function() {
    if (this._vertexCount === 0) return;
    this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
    this._indexBuffer = this.getIndexBuffer(this._indexCount);
    this._aIndex = 0;
    this._iIndex = 0;
    this._dcIndex = 0;
    this.buildTexturesAndDrawCalls();
    this.updateGeometry();
    this.drawBatches();
    this._bufferSize = 0;
    this._vertexCount = 0;
    this._indexCount = 0;
};
QJLightRender.prototype.start = function() {
    this.renderer.state.set(this.state);
    this.renderer.shader.bind(this._shader,true);
    if (PIXI.settings.CAN_UPLOAD_SAME_BUFFER) {
        this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
    }
};
QJLightRender.prototype.stop = function() {
    this.flush();
};
QJLightRender.prototype.destroy = function() {
    for (var i = 0; i < this._packedGeometryPoolSize; i++) {
        if (this._packedGeometries[i]) {
            this._packedGeometries[i].destroy();
        }
    }
    this.renderer.off('prerender', this.onPrerender, this);
    this._aBuffers = null;
    this._iBuffers = null;
    this._packedGeometries = null;
    this._attributeBuffer = null;
    this._indexBuffer = null;
    if (this._shader) {
        this._shader.destroy();
        this._shader = null;
    }
    PIXI.ObjectRenderer.prototype.destroy.call(this);
};
QJLightRender.prototype.getAttributeBuffer = function(size) {
    var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 8));
    var roundedSizeIndex = PIXI.utils.log2(roundedP2);
    var roundedSize = roundedP2 * 8;
    if (this._aBuffers.length <= roundedSizeIndex) {
        this._iBuffers.length = roundedSizeIndex + 1;
    }
    var buffer = this._aBuffers[roundedSize];
    if (!buffer) {
        this._aBuffers[roundedSize] = buffer = new PIXI.ViewableBuffer(roundedSize * this.vertexSize * 4);
    }
    return buffer;
};
QJLightRender.prototype.getIndexBuffer = function(size) {
    var roundedP2 = PIXI.utils.nextPow2(Math.ceil(size / 12));
    var roundedSizeIndex = PIXI.utils.log2(roundedP2);
    var roundedSize = roundedP2 * 12;
    if (this._iBuffers.length <= roundedSizeIndex) {
        this._iBuffers.length = roundedSizeIndex + 1;
    }
    var buffer = this._iBuffers[roundedSizeIndex];
    if (!buffer) {
        this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
    }
    return buffer;
};
QJLightRender.prototype.packInterleavedGeometry = function(element, attributeBuffer, indexBuffer, aIndex, iIndex) {
    var uint32View = attributeBuffer.uint32View;
    var float32View = attributeBuffer.float32View;
    var packedVertices = aIndex / this.vertexSize;
    var uvs = element.uvs;
    var indicies = element.indices;
    var vertexData = element.vertexData;
    var textureId = element._texture.baseTexture._batchLocation;
    var alpha = Math.min(element.worldAlpha, 1.0);
    var argb = (alpha < 1.0
        && element._texture.baseTexture.alphaMode)
        ? PIXI.utils.premultiplyTint(element._tintRGB, alpha)
        : element._tintRGB + (alpha * 255 << 24);
    for (var i = 0; i < vertexData.length; i += 2) {
        float32View[aIndex++] = vertexData[i];
        float32View[aIndex++] = vertexData[i + 1];
        float32View[aIndex++] = uvs[i];
        float32View[aIndex++] = uvs[i + 1];
        uint32View[aIndex++] = argb;
        float32View[aIndex++] = textureId;
    }
    for (var i$1 = 0; i$1 < indicies.length; i$1++) {
        indexBuffer[iIndex++] = packedVertices + indicies[i$1];
    }
};
PIXI.Renderer.registerPlugin("qjlightrender",QJLightRender);
//==========================================================
//Sprite_QJLightShadowLayer
//==========================================================
function Sprite_QJCharacterShadowLayer() {
    this.initialize.apply(this, arguments);
}
Sprite_QJCharacterShadowLayer.prototype = Object.create(PIXI.Container.prototype);
Sprite_QJCharacterShadowLayer.prototype.constructor = Sprite_QJCharacterShadowLayer;
Sprite_QJCharacterShadowLayer.prototype.initialize = function(scene,mainMask) {
    //====================================
    PIXI.Container.call(this);
    //====================================
    this.scene = scene;
    this.mainMask = mainMask;
    this.z = 1;
    //====================================
};
Sprite_QJCharacterShadowLayer.prototype.update = function() {
    //===================================
    this.visible = $gameSystem.showLights&&this.mainMask.visible;
    if (!this.visible) return;
    //===================================
    let children = this.mainMask.children;
    let container,initData,csd,csTarget,characterSprite,odata,character,angle,jumpHeight;
    let mcsl=$gameMap.characterShadowList;
    let lx,ly,cx,cy,distence,direction;
    //===================================
    for (let i=0,il=children.length-1;i<il;i++) {
        //===================================
        if (!children[i]||!children[i].characterShadowContainer) continue;
        container = children[i].characterShadowContainer;
        if (!container.parent) this.addChild(container);
        //===================================
        lx = children[i].x - standardExpand/2;
        ly = children[i].y - standardExpand/2;
        initData = children[i].initData;
        odata = children[i].odata;
        //===================================
        for (let j in mcsl) {
            //===================================
            if (j==children[i].character) continue;
            if (mcsl[j]==false) {
                if (container.csList[j]) {
                    container.removeChild(container.csList[j]);
                    delete container.csList[j];
                }
                continue;
            }
            if (!container.csList[j]) {
                csTarget = new PIXI.Sprite();
                csTarget.blendMode = 2;
                csTarget.anchor.set(0.5,1);
                container.addChild(csTarget);
                container.csList[j] = csTarget;
            } else csTarget = container.csList[j];
            //===================================
            characterSprite = mapCharacterSpriteReSaveList[j];
            if (!characterSprite) continue;
            character = characterSprite._character;
            jumpHeight = character.jumpHeight();
            //===================================
            csd = character.QJSC;
            cx = character.screenX();
            cy = character.screenY()-csd.yCut+jumpHeight;
            angle = QJ.LL.calculateAngleByTwoPoint(lx,ly,cx-odata.shadowCharacterOffsetX,cy-odata.shadowCharacterOffsetY);
            cx += Math.sin(angle)*jumpHeight;
            cy += -Math.cos(angle)*jumpHeight;
            //===================================
            distence = Math.sqrt((cx-odata.shadowCharacterOffsetX-lx)*(cx-odata.shadowCharacterOffsetX-lx)+
                (cy-odata.shadowCharacterOffsetY-ly)*(cy-odata.shadowCharacterOffsetY-ly))+jumpHeight;
            //===================================
            csTarget.alpha = Math.floor(csd.opacity*initData.shadowCharacterMaxOpacity*100*(
                Math.min(1,Math.max(1-distence/initData.shadowCharacterMaxDistance))))/100
                *this.mainMask.averageColorAlpha;
            //===================================
            if (csTarget.alpha<=0.01) {
                csTarget.visible = false;
                continue;
            } else csTarget.visible = true;
            //===================================
            if (!csd.imgName) {
                if (!characterSprite.textureLL) continue;
                if (csTarget.texture!=characterSprite.textureLL) csTarget.texture = characterSprite.textureLL;
                if (csTarget.texture.frame.x!=characterSprite._frame.x||
                    csTarget.texture.frame.y!=characterSprite._frame.y||
                    csTarget.texture.frame.width!=characterSprite._frame.width||
                    csTarget.texture.frame.height!=characterSprite._frame.height-csd.yCut) {
                    csTarget.texture.frame.x=characterSprite._frame.x;
                    csTarget.texture.frame.y=characterSprite._frame.y;
                    csTarget.texture.frame.width=characterSprite._frame.width;
                    csTarget.texture.frame.height=characterSprite._frame.height-csd.yCut;
                    characterSprite.textureLL.frame = characterSprite.textureLL.frame;
                }
            } else {
                if (!characterSprite.textureLLSpecial) continue;
                if (csTarget.texture!=characterSprite.textureLLSpecial) {
                    csTarget.texture = characterSprite.textureLLSpecial;
                }
            }
            //===================================
            direction = character.direction();
            csTarget.tint = csd.tint;
            csTarget.x = cx+csd.offsetX+csd.offsetDirX[direction];
            csTarget.y = cy+csd.offsetY+csd.offsetDirY[direction];
            //===================================
            if (csd.model[0]==0) {
                csTarget.rotation = angle;
                csTarget.skew.x = 0;
            } else {
                csTarget.rotation = 0;
                csTarget.skew.x =  -angle;
            }
            //===================================
            csTarget.scale.y = children[i].odata.shadowCharacterShakeX;
            if (csd.model[1]==0) {
                //nothing
            } else if (csd.model[1]==1) {
                csTarget.scale.y *= distence/csd.model[2];
            } else if (csd.model[1]==2) {
                csTarget.scale.y *= Math.min(Math.max(2 - distence/csd.model[2],0.1),2);
            }
            //===================================
        }
        this.updateOtherShadow(container,lx,ly,initData,odata);
        //===================================
    }
    //===================================
};
Sprite_QJCharacterShadowLayer.prototype.updateOtherShadow = function(container,lx,ly,initData,odata) {

}
//==========================================================
//QJ-Doodads.js
//==========================================================
if (Imported.QJDoodads) {
    //==========================================================
    //
    //==========================================================
    QJ.DD.standardStructData.shadow = {
        status:false,
        yCut:0,
        opacity:1,
        tint:"#000000",
        offsetX:0,
        offsetY:0,
        model:"B[]"
    };
    const LL_Sprite_DoodadQJ_fixNewValueNull = Sprite_DoodadQJ.prototype.fixNewValueNull;
    Sprite_DoodadQJ.prototype.fixNewValueNull = function(data) {
        data = LL_Sprite_DoodadQJ_fixNewValueNull.call(this,data);
        if (typeof data.shadow != 'object') {
            data.shadow = {};
            for (let i in QJ.DD.standardStructData.shadow) {
                data.shadow[i] = QJ.DD.standardStructData.shadow[i];
            }
        }
        return data;
    };
    const LL_Scene_Map_addNewDoodadEditAttribute = Scene_Map.prototype.addNewDoodadEditAttribute;
    Scene_Map.prototype.addNewDoodadEditAttribute = function(list,doodadData,editWindow) {
        list = LL_Scene_Map_addNewDoodadEditAttribute.call(this,list,doodadData,editWindow);
        list = list.concat([
            {name:"------↓--shadow--↓------",enable:false,ext:{
                content:"",inputType:0,
                help:["The following attribute is shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Status",enable:true,ext:{
                content:doodadData.shadow.status?"true":"false",inputType:3,attribute:['shadow','status'],
                fixValue:(value)=>{return !eval(value);},
                help:["Show/Hide shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow yCut",enable:true,ext:{
                content:doodadData.shadow.yCut,inputType:1,attribute:['shadow','yCut'],
                fixValue:(value)=>{value=Number(value);return isNaN(value)?0:Math.floor(value);},
                left:(value)=>{return Number(value)-1;},
                right:(value)=>{return Number(value)+1;},
                help:["The yCut data of shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow X Offset",enable:true,ext:{
                content:doodadData.shadow.offsetX,inputType:1,attribute:['shadow','offsetX'],
                fixValue:(value)=>{value=Number(value);return isNaN(value)?0:Math.floor(value);},
                left:(value)=>{return Number(value)-1;},
                right:(value)=>{return Number(value)+1;},
                help:["The x offset of shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Y Offset",enable:true,ext:{
                content:doodadData.shadow.offsetY,inputType:1,attribute:['shadow','offsetY'],
                fixValue:(value)=>{value=Number(value);return isNaN(value)?0:Math.floor(value);},
                left:(value)=>{return Number(value)-1;},
                right:(value)=>{return Number(value)+1;},
                help:["The y offset of shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Opacity",enable:true,ext:{
                content:doodadData.shadow.opacity,inputType:1,attribute:['shadow','opacity'],
                fixValue:(value)=>{value=Number(value);return (value>=0&&value<=1)?Math.floor(value*1000)/1000:1;},
                left:(value)=>{return Number(value)-0.05;},
                right:(value)=>{return Number(value)+0.05;},
                help:["The opacity of shadow. range 0-1.","Press ← to subtract 0.05.Press → to add 0.05. ","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Tint",enable:true,ext:{
                content:doodadData.shadow.opacity,inputType:1,attribute:['shadow','tint'],
                fixValue:(value)=>{value=String(value);return (value[0]=='#'&&value.length==7&&!isNaN(Number("0x"+value.substr(1))))?
                    value:"#000000";},
                help:["The tint of shadow.","Default value is #000000 (black).","Need plugin QJ-Lighting."],
            },handler:null},
            {name:"Shadow Model",enable:true,ext:{
                content:doodadData.shadow.model,inputType:1,attribute:['shadow','model'],
                fixValue:(value)=>{return value;},
                help:["The model of shadow.","Default value is B[].","Need plugin QJ-Lighting. Please visit the help of QJ-Lighting for detail."],
            },handler:null},
            {name:"------↑--shadow--↑------",enable:false,ext:{
                content:"",inputType:0,
                help:["The above attribute is shadow.","Need plugin QJ-Lighting."],
            },handler:null},
            ]);
        return list;
    }
    //==========================================================
    //
    //==========================================================
    const LL_Sprite_QJCharacterShadowLayer_updateOtherShadow = Sprite_QJCharacterShadowLayer.prototype.updateOtherShadow;
    Sprite_QJCharacterShadowLayer.prototype.updateOtherShadow = function(container,lx,ly,initData,odata) {
        LL_Sprite_QJCharacterShadowLayer_updateOtherShadow.call(this,container,lx,ly,initData,odata);
        if (container.doodadsShadow) {
            for (let i of container.doodadsShadow) {
                i.mainDoodads.updateDoodadsShadow(i,lx,ly,initData,odata);
            }
        }
    }
    //==========================================================
    //
    //==========================================================
    //+doodads ok
    const LL_Sprite_DoodadQJ_setBase = Sprite_DoodadQJ.prototype.setBase;
    Sprite_DoodadQJ.prototype.setBase = function() {
        LL_Sprite_DoodadQJ_setBase.call(this);
        this.shadowData = JsonEx.makeDeepCopy(this.data.shadow?this.data.shadow:QJ.DD.standardStructData.shadow);
        this.shadowData.model = QJ.LL.getCSModel(this.shadowData.model);
        this.shadowData.tint = Number("0x"+this.shadowData.tint.substr(1));
        if (this.constructor.name == "Sprite_MouseDoodadsCursorQJ"||
            !this._spriteset.lightSystemSprite) {this.doodadShadowSprite = [];return;}
        if (this.doodadShadowSprite) {
            this.doodadShadowSprite.forEach((sprite)=>{
                let container = sprite.parent;
                sprite.parent.removeChild(sprite);
                container.doodadsShadow.splice(container.doodadsShadow.indexOf(sprite),1);
            });
        }
        this.doodadShadowSprite = [];
        if (this.shadowData.status) {
            let children = this._spriteset.lightSystemSprite.children;
            for (let i of children) {
                if (!i||!i.characterShadowContainer) continue;
                this.addShadow(i.characterShadowContainer);
            }
        }
    };
    Sprite_DoodadQJ.prototype.addShadow = function(container) {
        for (let i=0,idata=container.children,il=idata.length;i<il;i++) {
            if (idata[i].mainDoodads==this) {
                return;
            }
        }
        let newShadowSprite = new PIXI.Sprite();
        newShadowSprite.mainDoodads = this;
        newShadowSprite.blendMode = 2;
        newShadowSprite.anchor.set(0.5,1);
        container.addChild(newShadowSprite);
        this.doodadShadowSprite.push(newShadowSprite);
        container.doodadsShadow.push(newShadowSprite);
    };
    //-doodads ok
    const LL_Sprite_DoodadQJ_destroy = Sprite_DoodadQJ.prototype.destroy;
    Sprite_DoodadQJ.prototype.destroy = function() {
        LL_Sprite_DoodadQJ_destroy.call(this);
        if (this.doodadShadowSprite&&this.doodadShadowSprite.length) {
            this.doodadShadowSprite.forEach((sprite)=>{
                let container = sprite.parent;
                container.removeChild(sprite);
                container.doodadsShadow.splice(container.doodadsShadow.indexOf(sprite),1);
            });
        }
        this.doodadShadowSprite = [];
    };
    Sprite_MouseDoodadsCursorQJ.prototype.destroy = function() {
        LL_Sprite_DoodadQJ_destroy.call(this);
    };
    const LL_Sprite_DoodadQJ_update = Sprite_DoodadQJ.prototype.update;
    Sprite_DoodadQJ.prototype.update = function() {
    LL_Sprite_DoodadQJ_update.call(this);
    if (this.doodadShadowSprite&&this.doodadShadowSprite.length) {
        this.doodadShadowSprite.forEach((sprite)=>this.updateShadowSprite(sprite));
    }
    };
    Sprite_DoodadQJ.prototype.updateShadowSprite = function(sprite) {
    
    };
    //==========================================================
    //
    //==========================================================
    //+lights ok
    const LL_Sprite_QJLightLayer_buildShadowContainer = Sprite_QJLightLayer.prototype.buildShadowContainer;
    Sprite_QJLightLayer.prototype.buildShadowContainer = function() {
        LL_Sprite_QJLightLayer_buildShadowContainer.call(this);
        if (this.characterShadowContainer) {
            this.characterShadowContainer.doodadsShadow = [];
            if (this._spriteset._doodadsQJ) {
                for (let i of this._spriteset._doodadsQJ) {
                    if (i.shadowData&&i.shadowData.status) i.addShadow(this.characterShadowContainer);
                }
            }
        }
    };
    //-lights 
    const Sprite_QJLightLayer_setDead = Sprite_QJLightLayer.prototype.setDead;
    Sprite_QJLightLayer.prototype.setDead = function() {
        //===================================
        Sprite_QJLightLayer.prototype.setDead.call(this);
        if (this.characterShadowContainer) {
            for (let i of this.characterShadowContainer.children) {
                if (i.addShadow) {
                    let sprites = i.addShadow.doodadShadowSprite;
                    sprites.splice(sprites.indexOf(i),1);
                }
            }
        }
        //===================================
    };
    //==========================================================
    //
    //==========================================================
    Sprite_DoodadQJ.prototype.updateDoodadsShadow = function(csTarget,lx,ly,initData,odata) {
            //===================================
            csd = this.shadowData;
            cx = this.x;
            cy = this.y-csd.yCut;
            angle = QJ.LL.calculateAngleByTwoPoint(lx,ly,cx-odata.shadowCharacterOffsetX,cy-odata.shadowCharacterOffsetY);
            cx += Math.sin(angle);
            cy += -Math.cos(angle);
            //===================================
            distence = Math.sqrt((cx-odata.shadowCharacterOffsetX-lx)*(cx-odata.shadowCharacterOffsetX-lx)+
                (cy-odata.shadowCharacterOffsetY-ly)*(cy-odata.shadowCharacterOffsetY-ly));
            //===================================
            csTarget.alpha = Math.floor(csd.opacity*initData.shadowCharacterMaxOpacity*100*(
                Math.min(1,Math.max(1-distence/initData.shadowCharacterMaxDistance))))/100;
            //===================================
            if (csTarget.alpha<=0.01) {
                csTarget.visible = false;
                return;
            } else csTarget.visible = true;
            //===================================
            if (!csd.imgName) {
                if (!this.texture) return;
                if (csTarget.texture!=this.texture) csTarget.texture = this.texture;
            }
            //===================================
            csTarget.tint = csd.tint;
            csTarget.x = cx+csd.offsetX;
            csTarget.y = cy+csd.offsetY;
            //===================================
            if (csd.model[0]==0) {
                csTarget.rotation = angle;
                csTarget.skew.x = 0;
            } else {
                csTarget.rotation = 0;
                csTarget.skew.x =  -angle;
            }
            //===================================
            csTarget.scale.y = odata.shadowCharacterShakeX;
            if (csd.model[1]==0) {
                //nothing
            } else if (csd.model[1]==1) {
                csTarget.scale.y *= distence/csd.model[2];
            } else if (csd.model[1]==2) {
                csTarget.scale.y *= Math.min(Math.max(2 - distence/csd.model[2],0.1),2);
            }
    };
    //==========================================================
    //
    //==========================================================
}
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
//==========================================================
//QJFrameLight./ fade effect.| direction effect.
//==========================================================
QJFrameLight.prototype.initialize = function(name,orginData,dataType,noFadeCopy) {
    noFadeCopy = noFadeCopy||false;
    this.i = dataType;//0-number 1-text 2-degree
    this.n = name;
    this.d = {};
    this.m = 0;
    this.t = 0;
    this.rt = 0;
    this.isMode = true;
    if (typeof orginData == "string"&&orginData.includes("~")) {
        let data = orginData.split("~"),num=0,fadeT=0,last;
        for (let i=0,il=data.length,detail;i<il;i++) {
            if (data[i].includes("|")) {
                detail = data[i].split("|");
                if (dataType==0) num = Number(detail[1]);
                else if (dataType==1) num = detail[1];
                else if (dataType==2) num = Number(detail[1])*Math.PI/180;
                this.d[this.m] = num;
                if (noFadeCopy) {
                    for (let i=this.m,ll=Number(detail[0]);i<ll;i++) {
                        this.d[i] = num;
                    }
                }
                this.m+=Number(detail[0]);
                this.d[this.m] = num;
            } else if (data[i].includes("/")) {
                detail = data[i].split("/");
                fadeT = Number(detail[0]);
                if (dataType==0) {
                    num = Number(detail[1]);
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = last+(num-last)*j/fadeT;
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                } else if (dataType==1) {
                    num = QJ.LL.hexToRgb(detail[1]);
                    last = QJ.LL.hexToRgb(this.d[this.m])//[0,{r:0,g:0,b:0}];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = QJ.LL.rgbToHex({
                            r:Math.floor(last.r+(num.r-last.r)*j/fadeT),
                            g:Math.floor(last.g+(num.g-last.g)*j/fadeT),
                            b:Math.floor(last.b+(num.b-last.b)*j/fadeT)
                        });
                    }
                    this.m+=fadeT;
                    this.d[this.m] = detail[1];
                } else if (dataType==2) {
                    num = Number(detail[1])*Math.PI/180;
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = last+(num-last)*j/fadeT;
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                }
            } else if (data[i].includes("%")) {
                detail = data[i].split("%");
                fadeT = Number(detail[0]);
                if (dataType==0) {
                    num = Number(detail[1]);
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = num-(num-last)*Math.sqrt(1-Math.pow(j/fadeT,2));
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                } else if (dataType==1) {
                    num = QJ.LL.hexToRgb(detail[1]);
                    last = QJ.LL.hexToRgb(this.d[this.m])//[0,{r:0,g:0,b:0}];
                    for (let j=1,xs;j<=fadeT;j++) {
                        xs = Math.sqrt(1-Math.pow(j/fadeT,2));
                        this.d[this.m+j] = QJ.LL.rgbToHex({
                            r:Math.floor(num.r-(num.r-last.r)*xs),
                            g:Math.floor(num.g-(num.g-last.g)*xs),
                            b:Math.floor(num.b-(num.b-last.b)*xs)
                        });
                    }
                    this.m+=fadeT;
                    this.d[this.m] = detail[1];
                } else if (dataType==2) {
                    num = Number(detail[1])*Math.PI/180;
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = num-(num-last)*Math.sqrt(1-Math.pow(j/fadeT,2));
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                }
            }
        }
    } else {
        this.isMode = false;
        let num;
        if (dataType==0) num = Number(orginData);
        else if (dataType==1) num = orginData;
        else if (dataType==2) num = Number(orginData)*Math.PI/180;
        this.d[this.m] = num;
    }
};
QJFrameLight.prototype.get = function() {
    if (this.t>this.m) this.t = 0;
    if (this.d[this.t]!=undefined) this.rt = this.t;
    this.t++;
    return this.d[this.rt];
};
QJFrameLight.prototype.getOnly = function() {
    return this.d[this.rt];
};
QJFrameLight.prototype.getTar = function(i) {
    return this.d[i>this.m?0:i];
};
//==========================================================
//
//==========================================================
})();
//==========================================================
//
//==========================================================