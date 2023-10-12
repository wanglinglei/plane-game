// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  @property(cc.Prefab)
  bulletPre: cc.Prefab = null;

  @property  // 键盘控制移动速度
  speed: number = 20;
  @property  // 射击间隔
  shootCd: number = 1;
  scrWidth: number;
  scrHeight: number;
  isFocus: boolean;
  level: 1|2|3=1;

  onLoad() {
    const dpi = window.devicePixelRatio || 1;
    this.scrWidth = cc.view.getCanvasSize().width / dpi;
    this.scrHeight = cc.view.getCanvasSize().height / dpi;

  }

  start() {
    this.addEvent();
    this.schedule(this.shoot, this.shootCd)
  }
  // update (dt) {}

  shoot() {
    cc.resources.load("audio/bullet", cc.AudioClip, (err, clip: cc.AudioClip) => {
      cc.audioEngine.playEffect(clip, false);
    })
    if(this.level===1){
      let bullet = cc.instantiate(this.bulletPre);
      bullet.x = this.node.x;
      bullet.y = this.node.y + this.node.height / 2;
      bullet.setParent(cc.director.getScene());
    }else if(this.level===2){
      let bullet1 = cc.instantiate(this.bulletPre);
      bullet1.x = this.node.x-this.node.width / 4;
      bullet1.y = this.node.y + this.node.height / 2;
      let bullet2 = cc.instantiate(this.bulletPre);
      bullet2.x = this.node.x+this.node.width/4;
      bullet2.y = this.node.y + this.node.height / 2;
      bullet1.setParent(cc.director.getScene());
      bullet2.setParent(cc.director.getScene());
    }else {
      [1,2,3].forEach((item,index) =>{
        const bullet = cc.instantiate(this.bulletPre);
        bullet.x=this.node.x-this.node.width/4+this.node.width/4*index;
        bullet.y = this.node.y + this.node.height / 2;
        bullet.angle=15-15*index;
        bullet.setParent(cc.director.getScene());
      })

    }

  }
  addEvent() {
    // 鼠标控制事件        
    this.node.on(cc.Node.EventType.MOUSE_DOWN, (e: cc.Event.EventMouse) => {
      this.isFocus = true;
    })
    this.node.on(cc.Node.EventType.MOUSE_UP, (e: cc.Event.EventMouse) => {
      this.isFocus = false;
    })
    this.node.on(cc.Node.EventType.MOUSE_MOVE, (e: cc.Event.EventMouse) => {
      if (this.isFocus) {
        this.node.setPosition(e.getLocation())
        this.checkBoundary();
      }
    })
    // 键盘控制事件
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (e: cc.Event.EventKeyboard) => {
      if (e.keyCode === cc.macro.KEY.up) {
        this.node.y += this.speed;
      }
      if (e.keyCode === cc.macro.KEY.down) {
        this.node.y -= this.speed;
      }
      if (e.keyCode === cc.macro.KEY.left) {
        this.node.x -= this.speed;
      }
      if (e.keyCode === cc.macro.KEY.right) {
        this.node.x += this.speed;
      }
      this.checkBoundary();
    })

    // 触摸事件
    this.node.on(cc.Node.EventType.TOUCH_START, (e: cc.Event.EventMouse) => {
      this.isFocus = true;
    })
    this.node.on(cc.Node.EventType.TOUCH_END, (e: cc.Event.EventMouse) => {
      this.isFocus = false;
    })
    this.node.on(cc.Node.EventType.TOUCH_MOVE, (e: cc.Event.EventMouse) => {
      if (this.isFocus) {
        this.node.setPosition(e.getLocation());
        this.checkBoundary();
      }
    })
  }

  checkBoundary() {
    // 边界处理
    if (this.node.x - this.node.width / 2 < 0) {
      this.node.x = this.node.width / 2;
    }
    if (this.node.x + this.node.width / 2 > this.scrWidth) {
      this.node.x = this.scrWidth - this.node.width / 2;
    }
    if (this.node.y - this.node.height / 2 < 0) {
      this.node.y = this.node.height / 2;
    }
    if (this.node.y + this.node.height / 2 > this.scrHeight) {
      this.node.y = this.scrHeight - this.node.height / 2;
    }
  }
}
