const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
  @property
  speed: number =50;
  scrHeight: number;
  scrWidth: number;

  onLoad () {
    const dpi=window.devicePixelRatio||1;
    this.scrWidth = cc.view.getCanvasSize().width / dpi;
    this.scrHeight = cc.view.getCanvasSize().height/dpi;
  }

  start() {

  }

  update (dt) {
    // NOTE 获得子弹运动的角度值 注意默认方向与坐标系方向有90夹角
    const rad=(this.node.angle+90)*Math.PI/180;
    this.node.x+=this.speed*dt*Math.cos(rad); 
    this.node.y +=this.speed*dt*Math.sin(rad);
    // y 坐标超出移除
    if(this.node.y+this.node.height>this.scrHeight){
      this.node.removeFromParent();
    }
    // x 坐标超出移除
    if(this.node.x+this.node.width>this.scrWidth||this.node.x-this.node.width<0){
      this.node.removeFromParent();
    }
  }

  remove(){
    this.node.removeFromParent();
  }
}
