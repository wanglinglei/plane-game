import Background from "./background";
import Bullet from "./bullet";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
  @property
  speed: number = 100;

  scrHeight: number;
  scrWidth: number;
  frameId: number=1;
  isDied: boolean = false;

  onLoad() {
    const dpi = window.devicePixelRatio || 1;
    this.scrHeight = cc.view.getCanvasSize().height / dpi;
    this.scrWidth = cc.view.getCanvasSize().width / dpi;
  }

  start() {
    this.node.y = this.scrHeight + this.node.height;
    this.node.x = Math.random() * (this.scrWidth - this.node.width) + this.node.width / 2;
  }

  update(dt) {
    this.node.y -= this.speed * dt;
    if (this.node.y - this.node.height / 2 < 0) {
      this.node.removeFromParent();
      this.destroy()
    }
  }

  onCollisionEnter(other:cc.Collider){
    // 碰到子弹
    if(other.tag===11&&!this.isDied){
      cc.find("background").getComponent(Background).score++;
      cc.find("score").getComponent(cc.Label).string="分数:"+cc.find("background").getComponent(Background).score;
      this.die();
      other.getComponent(Bullet).remove();
    }else if(other.tag===0&&!this.isDied){
      // 碰到玩家 游戏结束
      cc.game.pause();
      cc.find("background").getComponent(cc.AudioSource).stop();
    }
  }

  die(){
    this.isDied=true;
    // 播放击中音效
    cc.resources.load("audio/boom",cc.AudioClip,(err,clip:cc.AudioClip)=>{
      cc.audioEngine.playEffect(clip,false)
    })
    this.schedule(()=>{
      cc.resources.load(`images/explosion${this.frameId}`,cc.SpriteFrame,(err,sf:cc.SpriteFrame)=>{
        this.getComponent(cc.Sprite).spriteFrame=sf;
        this.frameId++;
      })
    },0.02,19,0)
  }
}
