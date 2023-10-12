const { ccclass, property } = cc._decorator;
import Player from './player'
@ccclass
export default class Background extends cc.Component {
  @property
  speed: number = 50;

  @property(cc.Prefab)
  enemy:cc.Prefab=null;

  @property
  enemyCd:number=2;
  bgs: cc.Node[];
  scrWidth: number;
  scrHeight: number;
  score:number=0; // 分数

  onLoad() {
    const dpi = window.devicePixelRatio || 1;
    this.scrHeight = cc.view.getCanvasSize().height / dpi;
    this.scrWidth = cc.view.getCanvasSize().width / dpi;
    console.log('----------',this.scrWidth,this.scrHeight);
    
    this.bgs = this.node.children;
    // 开启碰撞检测
    cc.director.getCollisionManager().enabled=true;
  }

  start() {
    this.schedule(()=>{
      let enemy=cc.instantiate(this.enemy);
      enemy.setParent(cc.director.getScene());
    },this.enemyCd)
  }

  update (dt:number) {
    this.bgs[0].y-=this.speed*dt;
    this.bgs[1].y-=this.speed*dt;
    if(this.bgs[0].y<-this.node.height){
      this.bgs[0].y=this.bgs[1].y+this.bgs[1].height;
    }
    if(this.bgs[1].y<-this.node.height){
      this.bgs[1].y=this.bgs[0].y+this.bgs[0].height;
    }

    // 判断分数升级
    if(this.score>15){
      cc.find("hero").getComponent(Player).level=3;
    }else if(this.score>5){
      cc.find("hero").getComponent(Player).level=2;
    }

  }
}
